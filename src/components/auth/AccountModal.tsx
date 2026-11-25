import { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  AUTH_VALIDATION,
  isPasswordStrong,
  validatePasswordStrength,
} from '../../types/auth';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const {
    profile,
    emailVerified,
    hasPasswordProvider,
    cloudSyncReady,
    createOrUpdatePassword,
    updateAccountProfile,
    sendVerificationEmail,
    refreshUserVerification,
    signOut,
  } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [classCode, setClassCode] = useState(profile?.classCode ?? '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setDisplayName(profile.displayName);
      setClassCode(profile.classCode ?? '');
      setProfileNotice(null);
      setProfileError(null);
      setPasswordNotice(null);
      setPasswordError(null);
      setVerifyNotice(null);
    }
  }, [isOpen, profile]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  if (!isOpen || !profile) return null;

  const strength = validatePasswordStrength(newPassword);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);
    setProfileError(null);
    setProfileSaving(true);
    try {
      await updateAccountProfile({ displayName, classCode });
      setProfileNotice('Profile details updated.');
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : 'Could not update profile.',
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSavePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);
    setPasswordError(null);

    if (!isPasswordStrong(newPassword)) {
      setPasswordError(
        'Password must be at least 8 characters with uppercase, lowercase, and a number.',
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await createOrUpdatePassword({
        currentPassword: hasPasswordProvider ? currentPassword : undefined,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordNotice(
        hasPasswordProvider
          ? 'Your password has been updated. Use it next time you sign in with email.'
          : 'Your password has been created! You can now sign in with your email and password.',
      );
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPasswordError('Your current password is incorrect.');
      } else if (code === 'auth/operation-not-allowed') {
        setPasswordError(
          'Email/Password provider must be enabled in Firebase Console (Authentication → Sign-in method → Email/Password) before setting a password.',
        );
      } else {
        setPasswordError(
          err instanceof Error ? err.message : 'Unable to save password.',
        );
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleResendVerify = async () => {
    setVerifyBusy(true);
    setVerifyNotice(null);
    try {
      await sendVerificationEmail();
      setVerifyNotice('Verification email sent. Check your inbox and click the link.');
    } catch (err) {
      setVerifyNotice(
        err instanceof Error ? err.message : 'Could not send verification email.',
      );
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleRefreshVerify = async () => {
    setVerifyBusy(true);
    setVerifyNotice(null);
    try {
      const verified = await refreshUserVerification();
      setVerifyNotice(
        verified
          ? 'Email verified! Cloud progress sync is now active.'
          : 'Still awaiting verification — please click the link in your email first.',
      );
    } catch (err) {
      setVerifyNotice(
        err instanceof Error ? err.message : 'Could not refresh status.',
      );
    } finally {
      setVerifyBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="account-modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                Account &amp; Password Settings
              </h2>
              <p className="text-xs text-slate-500">
                {profile.email} ·{' '}
                <span className="font-semibold text-slate-700">
                  {profile.accountType === 'teacher'
                    ? 'Teacher Account'
                    : 'Student Account'}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close account settings"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Verification Banner if pending */}
          {!emailVerified && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2.5 text-sm text-amber-950">
              <div className="flex items-start gap-2.5">
                <MailCheck className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">
                    Verify your email to enable cloud quiz sync
                  </p>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Your quiz mastery is saved locally right now. Click the
                    verification link sent to {profile.email}, then refresh your
                    status.
                  </p>
                </div>
              </div>
              {verifyNotice && (
                <p className="text-xs font-medium text-amber-950 bg-white/70 rounded-md px-2.5 py-1.5">
                  {verifyNotice}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={verifyBusy}
                  onClick={handleResendVerify}
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100/60"
                >
                  Resend Verification Email
                </button>
                <button
                  type="button"
                  disabled={verifyBusy}
                  onClick={handleRefreshVerify}
                  className="inline-flex items-center gap-1.5 rounded-md bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-900"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  I&apos;ve Verified — Refresh
                </button>
              </div>
            </div>
          )}

          {emailVerified && cloudSyncReady && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                Verified account · Quiz progress syncs automatically to your
                cloud profile.
              </span>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Profile Details
            </h3>
            {profileError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                {profileError}
              </div>
            )}
            {profileNotice && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                {profileNotice}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="modal-display-name"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="modal-display-name"
                  type="text"
                  required
                  maxLength={AUTH_VALIDATION.DISPLAY_NAME_MAX_LENGTH}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-class-code"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Class Code
                </label>
                <input
                  id="modal-class-code"
                  type="text"
                  maxLength={AUTH_VALIDATION.CLASS_CODE_MAX_LENGTH}
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="e.g. A2-BIO-9700"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
            >
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <hr className="border-slate-200" />

          {/* Create or Change Password Form */}
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="flex items-start gap-2.5">
              <KeyRound className="h-4 w-4 text-blue-700 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {hasPasswordProvider
                    ? 'Change Your Password'
                    : 'Create Your Own Password'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {hasPasswordProvider
                    ? 'Update the password used when signing in with your email address.'
                    : 'Set a personal password for your account so you can sign in using email & password anytime.'}
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordNotice && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{passwordNotice}</span>
              </div>
            )}

            {hasPasswordProvider && (
              <div>
                <label
                  htmlFor="modal-current-password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="modal-current-password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="modal-new-password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="modal-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8+ chars, A-z & 0-9"
                    className="w-full rounded-lg border border-slate-300 pl-3 pr-9 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={
                      showNewPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="modal-confirm-new-password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="modal-confirm-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs flex flex-wrap gap-x-4 gap-y-1 items-center">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span
                className={
                  strength.hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }
              >
                {strength.hasMinLength ? '✓' : '○'} 8+ chars
              </span>
              <span
                className={
                  strength.hasUpper ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }
              >
                {strength.hasUpper ? '✓' : '○'} Uppercase
              </span>
              <span
                className={
                  strength.hasLower ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }
              >
                {strength.hasLower ? '✓' : '○'} Lowercase
              </span>
              <span
                className={
                  strength.hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }
              >
                {strength.hasNumber ? '✓' : '○'} Number
              </span>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {passwordSaving
                ? 'Saving Password...'
                : hasPasswordProvider
                  ? 'Update Password'
                  : 'Create My Password'}
            </button>
          </form>

          <hr className="border-slate-200" />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Sign out to switch between teacher &amp; student accounts.
            </span>
            <button
              type="button"
              onClick={async () => {
                onClose();
                await signOut();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
