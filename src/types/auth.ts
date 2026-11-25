export type AccountType = 'student' | 'teacher';

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  accountType: AccountType;
  classCode?: string;
}

export interface QuizProgressDoc {
  ownerId: string;
  answers: Record<string, number>;
  totalAnswered: number;
  totalCorrect: number;
}

// Synchronized verbatim with firebase-blueprint.json validation constraints
export const AUTH_VALIDATION = {
  UID_MAX_LENGTH: 128,
  UID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  DISPLAY_NAME_MIN_LENGTH: 1,
  DISPLAY_NAME_MAX_LENGTH: 80,
  EMAIL_MIN_LENGTH: 3,
  EMAIL_MAX_LENGTH: 120,
  EMAIL_PATTERN: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  CLASS_CODE_MAX_LENGTH: 32,
  CLASS_CODE_PATTERN: /^[a-zA-Z0-9_\- ]*$/,
  MAX_ANSWERS_COUNT: 200,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export function validatePasswordStrength(password: string) {
  return {
    hasMinLength: password.length >= AUTH_VALIDATION.PASSWORD_MIN_LENGTH,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

export function isPasswordStrong(password: string): boolean {
  const checks = validatePasswordStrength(password);
  return checks.hasMinLength && checks.hasUpper && checks.hasLower && checks.hasNumber;
}
