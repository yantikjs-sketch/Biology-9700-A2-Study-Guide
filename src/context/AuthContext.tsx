import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updatePassword,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  AccountType,
  AUTH_VALIDATION,
  isPasswordStrong,
  UserProfileData,
} from '../types/auth';

interface PendingProfilePayload {
  displayName: string;
  accountType: AccountType;
  classCode?: string;
}

interface RegisterParams {
  displayName: string;
  email: string;
  password: string;
  accountType: AccountType;
  classCode?: string;
}

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  profile: UserProfileData | null;
  profileLoading: boolean;
  cloudSyncReady: boolean;
  emailVerified: boolean;
  hasPasswordProvider: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (params: RegisterParams) => Promise<void>;
  signInWithGoogle: (
    accountType: AccountType,
    classCode?: string,
  ) => Promise<void>;
  createOrUpdatePassword: (params: {
    currentPassword?: string;
    newPassword: string;
  }) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUserVerification: () => Promise<boolean>;
  updateAccountProfile: (params: {
    displayName: string;
    classCode?: string;
  }) => Promise<void>;
  loadCloudProgress: () => Promise<Record<string, number> | null>;
  saveCloudProgress: (
    answers: Record<string, number>,
    totalCorrect: number,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function pendingProfileKey(uid: string) {
  return `bio9700_pending_profile_${uid}`;
}

function sanitizeDisplayName(raw: string, fallbackEmail: string): string {
  const cleaned = raw.trim().slice(0, AUTH_VALIDATION.DISPLAY_NAME_MAX_LENGTH);
  if (cleaned.length >= AUTH_VALIDATION.DISPLAY_NAME_MIN_LENGTH) {
    return cleaned;
  }
  const emailPrefix = fallbackEmail.split('@')[0]?.trim() || 'Biology Learner';
  return emailPrefix.slice(0, AUTH_VALIDATION.DISPLAY_NAME_MAX_LENGTH);
}

function sanitizeClassCode(raw?: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/[^a-zA-Z0-9_\- ]/g, '')
    .slice(0, AUTH_VALIDATION.CLASS_CODE_MAX_LENGTH);
}

function readPendingProfile(uid: string): PendingProfilePayload | null {
  try {
    const raw = localStorage.getItem(pendingProfileKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingProfilePayload>;
    const accountType: AccountType =
      parsed.accountType === 'teacher' ? 'teacher' : 'student';
    return {
      displayName: parsed.displayName || '',
      accountType,
      classCode: sanitizeClassCode(parsed.classCode),
    };
  } catch {
    return null;
  }
}

function writePendingProfile(uid: string, data: PendingProfilePayload) {
  try {
    localStorage.setItem(pendingProfileKey(uid), JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function clearPendingProfile(uid: string) {
  try {
    localStorage.removeItem(pendingProfileKey(uid));
  } catch {
    // Ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [cloudSyncReady, setCloudSyncReady] = useState(false);

  const intendedRoleRef = useRef<{
    accountType: AccountType;
    classCode?: string;
  }>({ accountType: 'student' });

  const syncUserProfile = useCallback(async (firebaseUser: User) => {
    setProfileLoading(true);
    const email = (firebaseUser.email || '').trim().slice(0, AUTH_VALIDATION.EMAIL_MAX_LENGTH);
    const pending = readPendingProfile(firebaseUser.uid);

    if (!firebaseUser.emailVerified) {
      const localProfile: UserProfileData = {
        uid: firebaseUser.uid,
        displayName: sanitizeDisplayName(
          pending?.displayName || firebaseUser.displayName || '',
          email,
        ),
        email,
        accountType: pending?.accountType || intendedRoleRef.current.accountType,
        classCode:
          pending?.classCode ?? sanitizeClassCode(intendedRoleRef.current.classCode),
      };
      setProfile(localProfile);
      setCloudSyncReady(false);
      setProfileLoading(false);
      return;
    }

    const userDocPath = `users/${firebaseUser.uid}`;
    const userRef = doc(db, 'users', firebaseUser.uid);

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const loadedProfile: UserProfileData = {
          uid: String(data.uid || firebaseUser.uid),
          displayName: sanitizeDisplayName(
            String(data.displayName || firebaseUser.displayName || ''),
            email,
          ),
          email: String(data.email || email),
          accountType: data.accountType === 'teacher' ? 'teacher' : 'student',
          classCode: data.classCode ? String(data.classCode) : '',
        };
        setProfile(loadedProfile);
        setCloudSyncReady(true);
        clearPendingProfile(firebaseUser.uid);
        return;
      }
    } catch (error) {
      setProfileLoading(false);
      handleFirestoreError(error, OperationType.GET, userDocPath);
    }

    // Create verified profile in Firestore on first verified login
    const accountType: AccountType =
      pending?.accountType || intendedRoleRef.current.accountType || 'student';
    const displayName = sanitizeDisplayName(
      pending?.displayName || firebaseUser.displayName || '',
      email,
    );
    const classCode = sanitizeClassCode(
      pending?.classCode ?? intendedRoleRef.current.classCode,
    );

    if (!AUTH_VALIDATION.EMAIL_PATTERN.test(email)) {
      setProfileLoading(false);
      throw new Error('A valid verified email address is required.');
    }

    try {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        displayName,
        email,
        accountType,
        classCode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setProfile({
        uid: firebaseUser.uid,
        displayName,
        email,
        accountType,
        classCode,
      });
      setCloudSyncReady(true);
      clearPendingProfile(firebaseUser.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, userDocPath);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setProfile(null);
        setCloudSyncReady(false);
        setProfileLoading(false);
      } else {
        void syncUserProfile(nextUser);
      }
    });
    return () => unsubscribe();
  }, [syncUserProfile]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!AUTH_VALIDATION.EMAIL_PATTERN.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }
    await signInWithEmailAndPassword(auth, trimmedEmail, password);
  }, []);

  const registerWithEmail = useCallback(
    async ({
      displayName,
      email,
      password,
      accountType,
      classCode,
    }: RegisterParams) => {
      const trimmedEmail = email.trim();
      const cleanedName = displayName
        .trim()
        .slice(0, AUTH_VALIDATION.DISPLAY_NAME_MAX_LENGTH);
      const cleanedClassCode = sanitizeClassCode(classCode);

      if (cleanedName.length < AUTH_VALIDATION.DISPLAY_NAME_MIN_LENGTH) {
        throw new Error('Please enter your full name.');
      }
      if (
        trimmedEmail.length < AUTH_VALIDATION.EMAIL_MIN_LENGTH ||
        trimmedEmail.length > AUTH_VALIDATION.EMAIL_MAX_LENGTH ||
        !AUTH_VALIDATION.EMAIL_PATTERN.test(trimmedEmail)
      ) {
        throw new Error('Please enter a valid email address (max 120 chars).');
      }
      if (!isPasswordStrong(password)) {
        throw new Error(
          'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
        );
      }

      intendedRoleRef.current = { accountType, classCode: cleanedClassCode };

      const cred = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password,
      );
      await updateProfile(cred.user, { displayName: cleanedName });
      writePendingProfile(cred.user.uid, {
        displayName: cleanedName,
        accountType,
        classCode: cleanedClassCode,
      });

      try {
        await sendEmailVerification(cred.user);
      } catch {
        // Do not block account creation if verification dispatch is rate-limited
      }

      await syncUserProfile(cred.user);
    },
    [syncUserProfile],
  );

  const signInWithGoogle = useCallback(
    async (accountType: AccountType, classCode?: string) => {
      intendedRoleRef.current = {
        accountType,
        classCode: sanitizeClassCode(classCode),
      };
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    },
    [syncUserProfile],
  );

  const createOrUpdatePassword = useCallback(
    async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword?: string;
      newPassword: string;
    }) => {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No authenticated user email found.');
      }
      if (!isPasswordStrong(newPassword)) {
        throw new Error(
          'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
        );
      }

      const alreadyHasPassword = currentUser.providerData.some(
        (p) => p.providerId === 'password',
      );

      if (alreadyHasPassword) {
        if (!currentPassword) {
          throw new Error('Please enter your current password.');
        }
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      } else {
        const emailCredential = EmailAuthProvider.credential(
          currentUser.email,
          newPassword,
        );
        try {
          await linkWithCredential(currentUser, emailCredential);
        } catch (error) {
          const code = (error as { code?: string })?.code;
          if (code === 'auth/requires-recent-login') {
            await reauthenticateWithPopup(currentUser, googleProvider);
            await linkWithCredential(currentUser, emailCredential);
          } else {
            throw error;
          }
        }
      }

      await currentUser.reload();
      setUser({ ...currentUser } as User);
    },
    [],
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    const trimmedEmail = email.trim();
    if (!AUTH_VALIDATION.EMAIL_PATTERN.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    await sendPasswordResetEmail(auth, trimmedEmail);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Please sign in first.');
    }
    await sendEmailVerification(currentUser);
  }, []);

  const refreshUserVerification = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    await currentUser.reload();
    await currentUser.getIdToken(true);
    setUser(auth.currentUser);
    if (auth.currentUser) {
      await syncUserProfile(auth.currentUser);
      return auth.currentUser.emailVerified;
    }
    return false;
  }, [syncUserProfile]);

  const updateAccountProfile = useCallback(
    async ({
      displayName,
      classCode,
    }: {
      displayName: string;
      classCode?: string;
    }) => {
      const currentUser = auth.currentUser;
      if (!currentUser || !profile) {
        throw new Error('You must be signed in to update your profile.');
      }

      const cleanedName = displayName
        .trim()
        .slice(0, AUTH_VALIDATION.DISPLAY_NAME_MAX_LENGTH);
      const cleanedClassCode = sanitizeClassCode(classCode);

      if (cleanedName.length < AUTH_VALIDATION.DISPLAY_NAME_MIN_LENGTH) {
        throw new Error('Display name cannot be empty.');
      }

      await updateProfile(currentUser, { displayName: cleanedName });

      if (currentUser.emailVerified && cloudSyncReady) {
        const path = `users/${currentUser.uid}`;
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            displayName: cleanedName,
            classCode: cleanedClassCode,
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      } else {
        writePendingProfile(currentUser.uid, {
          displayName: cleanedName,
          accountType: profile.accountType,
          classCode: cleanedClassCode,
        });
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: cleanedName,
              classCode: cleanedClassCode,
            }
          : prev,
      );
    },
    [cloudSyncReady, profile],
  );

  const loadCloudProgress = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified || !cloudSyncReady) {
      return null;
    }
    const path = `users/${currentUser.uid}/progress/quiz`;
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid, 'progress', 'quiz'));
      if (!snap.exists()) return null;
      const data = snap.data();
      if (!data.answers || typeof data.answers !== 'object') return null;
      const sanitized: Record<string, number> = {};
      for (const [k, v] of Object.entries(data.answers as Record<string, unknown>)) {
        if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 10) {
          sanitized[k] = v;
        }
      }
      return sanitized;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }, [cloudSyncReady]);

  const saveCloudProgress = useCallback(
    async (answers: Record<string, number>, totalCorrect: number) => {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.emailVerified || !cloudSyncReady) {
        return;
      }

      const entries = Object.entries(answers).slice(
        0,
        AUTH_VALIDATION.MAX_ANSWERS_COUNT,
      );
      const boundedAnswers = Object.fromEntries(entries);
      const totalAnswered = entries.length;
      const safeCorrect = Math.max(0, Math.min(totalCorrect, totalAnswered));

      const path = `users/${currentUser.uid}/progress/quiz`;
      const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'quiz');

      try {
        const existingSnap = await getDoc(progressRef);
        if (existingSnap.exists()) {
          await updateDoc(progressRef, {
            answers: boundedAnswers,
            totalAnswered,
            totalCorrect: safeCorrect,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(progressRef, {
            ownerId: currentUser.uid,
            answers: boundedAnswers,
            totalAnswered,
            totalCorrect: safeCorrect,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    },
    [cloudSyncReady],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const hasPasswordProvider = useMemo(() => {
    if (!user) return false;
    return user.providerData.some((p) => p.providerId === 'password');
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authReady,
      profile,
      profileLoading,
      cloudSyncReady,
      emailVerified: Boolean(user?.emailVerified),
      hasPasswordProvider,
      signInWithEmail,
      registerWithEmail,
      signInWithGoogle,
      createOrUpdatePassword,
      sendPasswordReset,
      sendVerificationEmail,
      refreshUserVerification,
      updateAccountProfile,
      loadCloudProgress,
      saveCloudProgress,
      signOut,
    }),
    [
      user,
      authReady,
      profile,
      profileLoading,
      cloudSyncReady,
      hasPasswordProvider,
      signInWithEmail,
      registerWithEmail,
      signInWithGoogle,
      createOrUpdatePassword,
      sendPasswordReset,
      sendVerificationEmail,
      refreshUserVerification,
      updateAccountProfile,
      loadCloudProgress,
      saveCloudProgress,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
