# Bio9700 Security Specification & Threat Model

## 1. Data Invariants
1. **Identity Isolation**: A `UserProfile` at `/users/{userId}` can only be read or written by the authenticated, email-verified user whose `request.auth.uid == userId`. No blanket `isSignedIn()` reads or list queries are permitted on `/users`.
2. **Master Gate on Subcollections**: A `QuizProgress` document at `/users/{userId}/progress/{progressId}` cannot be created, updated, or read unless the parent `/users/{userId}` document exists and its `uid` matches `request.auth.uid`.
3. **Immutable Account Persona & Ownership**: `uid`, `email`, `accountType`, and `createdAt` cannot be modified after profile creation. `ownerId` and `createdAt` cannot be modified on `QuizProgress`.
4. **Strict Timestamp Integrity**: All `createdAt` and `updatedAt` fields must strictly equal `request.time`.
5. **Bounded Payloads**: All IDs match `^[a-zA-Z0-9_\-]+$` (max 128 chars), strings enforce `.size()` bounds matching `firebase-blueprint.json`, `answers` map size is capped at 200 entries, and no unknown shadow fields are allowed.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Profile Read**: `GET /users/userA` with `auth = null`.
2. **Cross-User PII Snooping**: `GET /users/userA` as `userB` (`email_verified = true`).
3. **Unverified Email Write**: `CREATE /users/userA` with `auth.uid = userA` and `email_verified = false`.
4. **UID Spoofing on Create**: `CREATE /users/userA` with `uid: "userB"` in payload while authenticated as `userA`.
5. **Shadow Field Injection**: `CREATE /users/userA` including extra field `isAdmin: true` or `isVerified: true`.
6. **Privilege / Persona Escalation on Update**: `UPDATE /users/userA` changing `accountType` from `"student"` to `"teacher"`.
7. **Client-Forged Timestamp**: `CREATE /users/userA` with `createdAt` set to a past client timestamp instead of `request.time`.
8. **Oversized String / Resource Poisoning**: `CREATE /users/userA` with 500-char `displayName` or 2KB `{userId}` path segment.
9. **Orphaned Progress Document**: `CREATE /users/userA/progress/quiz` when `/users/userA` does not exist.
10. **Cross-User Progress Tampering**: `UPDATE /users/userA/progress/quiz` as `userB`.
11. **Collection Enumeration (`list`)**: `LIST /users` as an authenticated user (`userA`).
12. **Unbounded Map / Out-of-Range Counts**: `UPDATE /users/userA/progress/quiz` with `totalAnswered: 9999` or negative counts.
