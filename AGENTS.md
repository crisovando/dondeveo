<!-- gentle-ai:project-conventions -->

# Donde veo — Project Conventions

## Skills

- `comment-discipline` — Prevent redundant comments in this codebase. Read `skills/comment-discipline/SKILL.md` before writing or editing any code here.

## GitHub CLI account

**This repository is public.** Never record account names, email addresses, or local filesystem
paths in it — machine-specific setup belongs in the machine's own configuration, not here.

This repository is owned by `crisovando`. On this machine `gh` is already configured to use the
right account here, so no manual switch is ever needed.

- **Do not switch accounts by hand.** `gh auth switch` rewrites a machine-wide setting and
  breaks the account routing for other repositories on this machine. `gh auth status` is enough
  to confirm what is in use — then leave it alone.
- Account routing is automatic and per directory, in two layers that apply the same boundary:
  the shells that read a startup file, and a `gh` wrapper that covers the ones that do not
  (bash, sh, a direct exec from an agent). Change one layer, change the other. The concrete
  profiles and paths belong to the machine's own configuration and are deliberately not
  recorded in this public repository.
- To force a specific profile, bypass the wrapper and call the real `gh` binary directly.
- `git push` is unaffected, because it goes over SSH: a branch can push successfully while
  `gh` is on the wrong account. A green push is not proof the account is right.
- A failed mutation under the wrong account reports
  `Unauthorized: As an Enterprise Managed User`, which is an account problem, not a code or
  permissions problem in this repository.
- Commits here must use the personal identity, never a work address. It is already configured
  as a repository-local `user.email`; do not change it.
- This repository has no `.github/` directory, no workflows and no issues. Pull requests
  follow the body structure of PR #2 (Summary, Changes table, Implementation notes,
  Verification); there is no issue-first gate and no `type:*` label to add.
