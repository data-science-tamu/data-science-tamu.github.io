# Academic Website Release

Owner explicitly authorized GitHub publication of the current academic readability
and restrained polish on 2026-10-13, using gpt-6.1-sol/max. This supersedes the
earlier local-only scope and approval timeout; it is not evidence of publication.

Implementation and independent reviews are complete; see history.md and
docs/validation.md. All current staged/unstaged work belongs to this approved
release. Parent owns the following remaining gates; this worker changes docs only.

## Parent Release Gates

1. Fresh verification of the final candidate, including tests/build and browser QA.
2. Task-branch commit/push and successful CI for that exact commit.
3. Fast-forward integration into clean primary main, then main push.
4. Successful Pages run for the exact main head and live HTTPS readback against
   that build. Parent records successful release evidence only after verification.

Preserve backup/pre-academic-20261012, .local/academic/pre-academic.bundle and
.local/polish/pre-polish-source.tar.gz. Rollback uses a new revert commit, never
reset or force-push. Port4173 follows primary dist; use a separate worktree at
the backup tag for an unchanged original comparison. Leave the4174 prototype alone.

## Strategic Considerations

Prior suggestions2/3/4 remain consideration-only in todo.md, not approved release
implementation. Evaluate research visibility, collaboration and publicity first.
