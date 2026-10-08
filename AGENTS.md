<!-- gentle-ai:project-conventions -->

# Donde veo — Project Conventions

## Skills

- `comment-discipline` — Prevent redundant comments in this codebase. Read `skills/comment-discipline/SKILL.md` before writing or editing any code here.

## GitHub CLI account

This repository is owned by `crisovando`. This machine is already wired so that `gh` picks
the right account by itself, so this repository needs no switch at all:

- The **default** gh profile (`~/.config/gh`) is `crisovando`, so `gh` works here directly.
- Projects that need the Allie credential live under `~/<work-repo-root>/` and are
  routed to `~/.config/<work-gh-profile>` (`<account>`) in **two layers that apply the same
  boundary**: a function plus a `chpwd` hook in `~/<shell-startup-file>`, which every zsh reads including
  non-interactive ones, and a `gh` wrapper at `~/<gh-wrapper>`, which covers the shells that
  never read `<shell-startup-file>` — bash, sh, a direct exec from an agent. Change one, change the other.
- To force a specific profile, bypass the wrapper and call the real binary directly:
  `/opt/<gh-binary>`.

**Do not switch accounts by hand.** In particular, do not "restore" the active account to
`<account>` when a task is done: `gh auth switch` rewrites the default profile,
and doing that is what breaks this setup for every personal repository on the machine. If you
want to confirm which account is in use, `gh auth status` is enough — then leave it alone.

- `git push` is unaffected, because it goes over SSH: a branch can push successfully while
  `gh` is on the wrong account. A green push is not proof the account is right.
- A failed mutation under the wrong account reports
  `Unauthorized: As an Enterprise Managed User`, which is an account problem, not a code or
  permissions problem in this repository.
- Git identity: this repository resolves to `<personal-email>` (the `crisovando`
  account email). That now comes from the machine-wide `~/.gitconfig`, which defaults to the
  personal identity and pulls in `~/.<work-gitconfig>` only for repositories under
  `~/<work-repo-root>/`. The value is also pinned with a repo-local `user.email`; the two
  agree, so leave both in place.
- This repository has no `.github/` directory, no workflows and no issues. Pull requests
  follow the body structure of PR #2 (Summary, Changes table, Implementation notes,
  Verification); there is no issue-first gate and no `type:*` label to add.
