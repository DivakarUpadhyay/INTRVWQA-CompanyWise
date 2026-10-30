# Answer Bank 4 – Version Control (Git/GitHub and ClearCase)

## Git – questions and answers

**Q: Explain your daily Git workflow.**
"Pull the latest main, create a feature branch (`feature/ticket-123`), make small commits with clear messages, rebase on main before pushing, open a pull request, get review and CI green, then squash-merge. Hotfixes branch from the release tag and are merged back to main."

**Q: How do you undo things?**
| Situation | Command |
|---|---|
| Unstage a file | `git restore --staged file` |
| Discard local changes in a file | `git restore file` |
| Fix the last commit message (not pushed) | `git commit --amend` |
| Undo a pushed commit safely | `git revert <sha>` (new commit, history preserved) |
| Move branch back locally (not pushed) | `git reset --soft/--mixed/--hard <sha>` |
| Recover "lost" commits | `git reflog` |

**Q: Resolve a merge conflict?**
Open the conflicted files, understand both sides (talk to the other author if needed), edit, then `git add` and continue (`git merge --continue` / `git rebase --continue`). Build and run tests before pushing. Never resolve blindly by picking "ours".

**Q: Cherry-pick?**
`git cherry-pick <sha>` copies one commit onto the current branch. Used to bring a bug fix into a release branch for a customer patch.

**Q: Tags and releases?**
Annotated tags (`git tag -a v10.2.1 -m ...`) mark exactly what was shipped. Essential for support: you must be able to rebuild and get the symbols of the version a customer runs.

**Q: Large binary files?**
Git LFS. ClearCase handles binaries natively, which is one reason hardware companies used it.

**Q: Branching strategy for a product with several supported versions (like IG-XL releases)?**
A main/development branch, plus **release branches per supported version** (`release/10.40`). Fixes go to the oldest supported release that needs them and are merged or cherry-picked forward. Every customer build is tagged, with its PDBs archived on a symbol server.

## ClearCase – what to know

| Concept | Meaning | Git equivalent |
|---|---|---|
| VOB (Versioned Object Base) | Repository | Repository |
| View | Your workspace, chosen versions of elements | Working directory + checked-out branch |
| Snapshot view | Local copy, updated on demand | Clone |
| Dynamic view | Virtual file system (MVFS), shows versions live from the server | No direct equivalent |
| Config spec | Rules that pick which version of each element you see (e.g. `element * LATEST`, `element * REL_1.0`) | Branch/tag checkout |
| Checkout / checkin | Explicit per-file; reserved checkout locks the file for others | Edit + commit (no locking) |
| Label | Marks versions | Tag |
| Branch (base ClearCase) | Per-element branches (`/main/rel1/1`) | Branch (whole repo) |
| UCM: stream / activity / baseline / deliver / rebase | Structured workflow: stream = branch, activity = change set linked to a task, baseline = release snapshot, deliver = merge up, rebase = update from parent | Branch / commit set / tag / merge / rebase |
| `cleartool` | Command-line tool (`cleartool co`, `ci`, `lsco`, `mkbranch`, `findmerge`) | `git` |

**Answer if asked:** "I haven't used ClearCase in production, but I understand its model. It versions files individually, with views defined by config specs, explicit checkout/checkin and, in UCM, streams, activities and baselines. I'd need a short time to learn the team's conventions and `cleartool` commands, and the concepts transfer directly from Git."
