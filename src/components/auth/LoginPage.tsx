import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  AccountType,
  AUTH_VALIDATION,
  isPasswordStrong,
  validatePasswordStrength,
} from '../../types/auth';

type AuthMode = 'signin' | 'signup' | 'reset';

function mapAuthError(err: unknown): {
  message: string;
  needsEmailProviderEnabled?: boolean;
} {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return {
        message:
          'Email & Password sign-in is not enabled yet in Firebase Console. Enable it under Authentication → Sign-in method → Email/Password, or use Continue with Google below.',
        needsEmailProviderEnabled: true,
      };
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return {
        message: 'Incorrect email or password. Please check your details and try again.',
      };
    case 'auth/email-already-in-use':
      return {
        message:
          'An account with this email already exists. Switch to Sign In or reset your password.',
      };
    case 'auth/weak-password':
      return {
        message:
          'Password is too weak. Use at least 8 characters with uppercase, lowercase, and a number.',
      };
    case 'auth/too-many-requests':
      return {
        message: 'Too many attempts. Please wait a moment before trying again.',
      };
    case 'auth/popup-closed-by-user':
      return {
        message: 'Google sign-in popup was closed before completing.',
      };
    default:
      return {
        message:
          err instanceof Error
            ? err.message
            : 'Unable to complete sign-in. Please try again.',
      };
  }
}

export function LoginPage() {
  const { signInWithEmail, registerWithEmail, signInWithGoogle, sendPasswordReset } =
    useAuth();

  const [role, setRole] = useState<AccountType>('student');
  const [mode, setMode] = useState<AuthMode>('signin');

  const [displayName, setDisplayName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showProviderSetupHint, setShowProviderSetupHint] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const strength = validatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(null);
    setStatusMessage(null);
    setShowProviderSetupHint(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setShowProviderSetupHint(false);

    if (mode === 'reset') {
      setSubmitting(true);
      try {
        await sendPasswordReset(email);
        setStatusMessage(
          'Password reset link sent! Check your inbox to set a new password.',
        );
      } catch (err) {
        const mapped = mapAuthError(err);
        setErrorMessage(mapped.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (!isPasswordStrong(password)) {
        setErrorMessage(
          'Please create a password meeting all 4 requirements below.',
        );
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail({
          displayName,
          email,
          password,
          accountType: role,
          classCode,
        });
      }
    } catch (err) {
      const mapped = mapAuthError(err);
      setErrorMessage(mapped.message);
      setShowProviderSetupHint(Boolean(mapped.needsEmailProviderEnabled));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setShowProviderSetupHint(false);
    setSubmitting(true);
    try {
      await signInWithGoogle(role, classCode);
    } catch (err) {
      const mapped = mapAuthError(err);
      setErrorMessage(mapped.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lab-canvas-bg text-slate-900 flex flex-col justify-between">
      {/* Minimal Header */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-8 py-4">
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Bio9700 Revision
          </span>
          <span className="text-sm font-medium text-slate-600">
            Cambridge International A Level Biology (9700)
          </span>
        </div>
      </header>

      {/* Main Two-Column Auth Layout */}
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 sm:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Role Selection & Syllabus Preview */}
          <section className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                A2 Biology Portal · Topics 12–15
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Sign in to your revision &amp; teaching workspace
              </h1>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Select your role below to sign in, create a new account with your
                own password, or continue with Google and set a personal password
                anytime.
              </p>
            </div>

            {/* Interactive Role Selector */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                1. Choose your account role
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    role === 'student'
                      ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-lg p-2 ${
                        role === 'student'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    {role === 'student' && (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-slate-900">
                    Student
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Explore animated 9700 pathways, run virtual labs, and save your
                    quiz mastery.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    role === 'teacher'
                      ? 'border-emerald-700 bg-white shadow-sm ring-2 ring-emerald-700/20'
                      : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-lg p-2 ${
                        role === 'teacher'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    {role === 'teacher' && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                    )}
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-slate-900">
                    Teacher
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Demonstrate interactive A2 9700 diagrams in class and manage
                    your class code.
                  </p>
                </button>
              </div>
            </div>

            {/* Syllabus Scope Summary */}
            <div className="rounded-xl border border-slate-200/90 bg-white/85 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <BookOpenCheck className="h-4 w-4 text-emerald-700" />
                <span>Included 9700 Interactive Modules</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-sm text-slate-700">
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2">
                  <span className="font-mono text-xs font-semibold text-blue-700">
                    12.
                  </span>{' '}
                  Energy &amp; Respiration
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2">
                  <span className="font-mono text-xs font-semibold text-emerald-700">
                    13.
                  </span>{' '}
                  Photosynthesis
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2">
                  <span className="font-mono text-xs font-semibold text-teal-700">
                    14.
                  </span>{' '}
                  Homeostasis
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2">
                  <span className="font-mono text-xs font-semibold text-violet-700">
                    15.
                  </span>{' '}
                  Control &amp; Coordination
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Login / Create Account & Password Card */}
          <section className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              {/* Auth Mode Tabs */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div
                  className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
                  role="tablist"
                  aria-label="Authentication mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'signin'}
                    onClick={() => switchMode('signin')}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                      mode === 'signin'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'signup'}
                    onClick={() => switchMode('signup')}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                      mode === 'signup'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <span
                  className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md border ${
                    role === 'teacher'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-blue-200 bg-blue-50 text-blue-800'
                  }`}
                >
                  {role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-sm text-rose-900 space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-rose-700 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  {showProviderSetupHint && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 space-y-1">
                      <p className="font-semibold">
                        How to enable Email &amp; Password in Firebase Console:
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5">
                        <li>Open Firebase Console for your project.</li>
                        <li>
                          Go to <strong>Authentication → Sign-in method</strong>.
                        </li>
                        <li>
                          Click <strong>Add new provider → Email/Password</strong>{' '}
                          and toggle <strong>Enable</strong>, then save.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {statusMessage && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="auth-display-name"
                        className="block text-sm font-medium text-slate-800 mb-1.5"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="auth-display-name"
                          type="text"
                          required
                          maxLength={AUTH_VALIDATION.DISPLAY_NAME_MAX_LENGTH}
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder={
                            role === 'teacher'
                              ? 'e.g. Ms. Lim Wei Ling'
                              : 'e.g. Daniel Tan'
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="auth-class-code"
                        className="block text-sm font-medium text-slate-800 mb-1.5"
                      >
                        Class Code <span className="text-slate-400">(optional)</span>
                      </label>
                      <input
                        id="auth-class-code"
                        type="text"
                        maxLength={AUTH_VALIDATION.CLASS_CODE_MAX_LENGTH}
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="e.g. A2-BIO-9700"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-sm font-medium text-slate-800 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      maxLength={AUTH_VALIDATION.EMAIL_MAX_LENGTH}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        role === 'teacher'
                          ? 'teacher@school.edu'
                          : 'student@school.edu'
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                {mode !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="auth-password"
                        className="block text-sm font-medium text-slate-800"
                      >
                        {mode === 'signup' ? 'Create Your Password' : 'Password'}
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => switchMode('reset')}
                          className="text-xs font-medium text-blue-700 hover:text-blue-800"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === 'signup'
                            ? 'Create a strong personal password'
                            : 'Enter your password'
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <>
                    <div>
                      <label
                        htmlFor="auth-confirm-password"
                        className="block text-sm font-medium text-slate-800 mb-1.5"
                      >
                        Confirm Your Password
                      </label>
                      <div className="relative">
                        <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="auth-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          aria-label={
                            showConfirmPassword
                              ? 'Hide confirm password'
                              : 'Show confirm password'
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Requirements Checklist */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-xs">
                      <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                        Password requirements:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <span
                          className={
                            strength.hasMinLength
                              ? 'text-emerald-700 font-medium'
                              : 'text-slate-500'
                          }
                        >
                          {strength.hasMinLength ? '✓' : '○'} 8+ characters
                        </span>
                        <span
                          className={
                            strength.hasUpper
                              ? 'text-emerald-700 font-medium'
                              : 'text-slate-500'
                          }
                        >
                          {strength.hasUpper ? '✓' : '○'} Uppercase letter
                        </span>
                        <span
                          className={
                            strength.hasLower
                              ? 'text-emerald-700 font-medium'
                              : 'text-slate-500'
                          }
                        >
                          {strength.hasLower ? '✓' : '○'} Lowercase letter
                        </span>
                        <span
                          className={
                            strength.hasNumber
                              ? 'text-emerald-700 font-medium'
                              : 'text-slate-500'
                          }
                        >
                          {strength.hasNumber ? '✓' : '○'} Number (0–9)
                        </span>
                      </div>
                      {confirmPassword.length > 0 && (
                        <p
                          className={`pt-0.5 font-medium ${
                            passwordsMatch ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {passwordsMatch
                            ? '✓ Passwords match'
                            : '× Passwords do not match'}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
                >
                  {submitting
                    ? 'Please wait...'
                    : mode === 'signin'
                      ? `Sign In as ${role === 'teacher' ? 'Teacher' : 'Student'}`
                      : mode === 'signup'
                        ? `Create ${role === 'teacher' ? 'Teacher' : 'Student'} Account`
                        : 'Send Password Reset Email'}
                </button>

                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Back to Sign In
                  </button>
                )}
              </form>

              {mode !== 'reset' && (
                <>
                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="mx-3 shrink-0 text-xs font-medium uppercase tracking-wider text-slate-400">
                      or
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleGoogleSignIn}
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                        />
                      </svg>
                      Continue with Google as{' '}
                      {role === 'teacher' ? 'Teacher' : 'Student'}
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      Signed in with Google? You can also create your own password
                      inside Account Settings.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200/90 bg-white/90 backdrop-blur-md py-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 sm:px-8 text-sm text-slate-600">
          <span>Bio9700 Revision · Teacher &amp; Student Portal</span>
          <span>Syllabus Coverage: Topics 12–15</span>
        </div>
      </footer>
    </div>
  );
}
