# Security Specification - Todo+ Habit Tracker

## Data Invariants
1. A **Habit** must define a valid frequency (daily or weekly) and belong to a verified user.
2. A **HistoryRecord** must link to a valid habit document and match the user's ID.
3. Users can only read and write their own data.
4. **Guest users** (isAnonymous: true) can only manage tasks for the current day. This is enforced client-side for UX, but rules should restrict cross-user access.
5. `streakCount` and `lastVisit` are system-managed or derived from user actions.

## 12 "Dirty Dozen" Payloads (Red Team Tests)

### Identity Attacks
1. **The Hijacker**: Authenticated user A tries to create a habit with `userId` of user B.
2. **The Guest Escalation**: A guest user tries to update their profile to `isAnonymous: false` without actually linking a credential.
3. **The Shadow Read**: User A tries to `get` a document from `/habits/` belonging to user B.

### Integrity & Type Attacks
4. **The Ghost Field**: Creating a habit with an extra field `isVerified: true`.
5. **The ID Poison**: Sending a habit creation with a document ID that is 200KB of junk characters.
6. **The Negative Streak**: Updating `streakCount` to -1.
7. **The Type Swap**: Sending `frequency: true` instead of "daily"/"weekly".

### Relational Attacks
8. **The Orphan Record**: Creating a `HistoryRecord` for a habit ID that does not exist in the `/habits/` collection.
9. **The Date Spoofer**: Creating a history record for a future date (e.g., 2027-01-01) if not allowed.
10. **The Record Thief**: User A updates user B's `HistoryRecord` status.

### Resource Exhaustion
11. **The Massive String**: Sending a habit name that is 1MB in size.
12. **The Collection Scraper**: Attempting `list` on `/users` to harvest all emails with `allow list: if isSignedIn()`.

## Test Runner Logic
The `firestore.rules` will be evaluated against these payloads to ensure `PERMISSION_DENIED`.
