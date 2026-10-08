<!-- gentle-ai:project-conventions -->

# Donde veo — Project Conventions

## Skills

- `comment-discipline` — Prevent redundant comments in this codebase. Read `skills/comment-discipline/SKILL.md` before writing or editing any code here.

## GitHub CLI account

This repository is owned by `crisovando`. This machine is already wired so that `gh` picks
the right account by itself, so this repository needs no switch at all:

- The **default** gh profile (`~/.config/gh`) is `crisovando`, so `gh` works here directly.
- Projects that need the Allie credential live under `~/<work-repo-root>/` and are
  routed to `~/.config/<work-gh-profile>` (`<account>`) by a function plus a `chpwd` hook
  in `~/<shell-startup-file>`. That covers both a shell started inside such a project and a shell opened
  elsewhere that `cd`s into one.

**Do not switch accounts by hand.** In particular, do not "restore" the active account to
`<account>` when a task is done: `gh auth switch` rewrites the default profile,
and doing that is what breaks this setup for every personal repository on the machine. If you
want to confirm which account is in use, `gh auth status` is enough — then leave it alone.

- `git push` is unaffected, because it goes over SSH: a branch can push successfully while
  `gh` is on the wrong account. A green push is not proof the account is right.
- A failed mutation under the wrong account reports
  `Unauthorized: As an Enterprise Managed User`, which is an account problem, not a code or
  permissions problem in this repository.
- Git identity: `user.email` is set **locally** in this repository to
  `<personal-email>` (the `crisovando` account email). The machine-wide
  `~/.gitconfig` carries the Allie address, so removing this local override would attribute
  commits here to the wrong account.
- This repository has no `.github/` directory, no workflows and no issues. Pull requests
  follow the body structure of PR #2 (Summary, Changes table, Implementation notes,
  Verification); there is no issue-first gate and no `type:*` label to add.
