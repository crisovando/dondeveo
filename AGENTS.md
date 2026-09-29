<!-- gentle-ai:project-conventions -->

# Donde veo — Project Conventions

## Skills

- `comment-discipline` — Prevent redundant comments in this codebase. Read `skills/comment-discipline/SKILL.md` before writing or editing any code here.

## GitHub CLI account

This repository is owned by `crisovando`. On this machine `gh` also has
`<account>` configured, an Enterprise Managed User that cannot act on this
repository.

- Never run `gh` against this repository while `<account>` is the active
  account — not even a read-only call. Check the active account with `gh auth status`
  before any `gh` work.
- `git push` is unaffected, because it goes over SSH: a branch can push successfully
  while `gh` is still on the wrong account. A green push is not proof the account is right.
- For `gh` work, get the user's authorization, run
  `gh auth switch --user crisovando`, do the work, then restore with
  `gh auth switch --user <account>`. The switch is global for the whole
  machine and affects other projects, so it is a credential change: never silent, and
  never left switched.
- A failed mutation under the wrong account reports
  `Unauthorized: As an Enterprise Managed User`, which is an account problem, not a
  code or permissions problem in this repository.
- This repository has no `.github/` directory, no workflows and no issues. Pull requests
  follow the body structure of PR #2 (Summary, Changes table, Implementation notes,
  Verification); there is no issue-first gate and no `type:*` label to add.
