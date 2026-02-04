# Git Essentials

Version: 2.x
Published: 2026-01-16

Essential git commands for day-to-day development.

## Setup

| Example | Description |
| --- | --- |
| <pre>git config --global user.name "Your Name"</pre> | Configure your name for commits (also set user.email). |
| <pre>git config --global init.defaultBranch main</pre> | Use 'main' as the default branch for new repos. |

## Inspect

| Example | Description |
| --- | --- |
| <pre>git status</pre> | Show staged, unstaged, and untracked files. |
| <pre>git log --oneline --graph -10</pre> | View recent commit history in compact format. |
| <pre>git diff --staged</pre> | Show changes staged for the next commit. |
| <pre>git blame path/to/file.ext</pre> | Show who last modified each line of a file. |

## Stage & Commit

| Example | Description |
| --- | --- |
| <pre>git add .</pre> | Stage all changes in current directory. |
| <pre>git add -p</pre> | Stage changes hunk by hunk. |
| <pre>git restore --staged file.ext</pre> | Remove file from staging area, keep changes. |
| <pre>git commit -m "Add feature"</pre> | Create a commit with staged changes. |
| <pre>git commit --amend</pre> | Modify the last commit (message or content). |

## Branches

| Example | Description |
| --- | --- |
| <pre>git switch -c feature/new-thing</pre> | Create a new branch and switch to it. |
| <pre>git switch main</pre> | Switch to an existing branch. |
| <pre>git branch -vv</pre> | List branches with upstream tracking info. |
| <pre>git branch -d feature/done</pre> | Delete a merged branch (-D to force). |

## Remote

| Example | Description |
| --- | --- |
| <pre>git clone git@github.com:org/repo.git</pre> | Download a repository and its history. |
| <pre>git fetch --prune</pre> | Download refs and clean up deleted remote branches. |
| <pre>git pull --rebase</pre> | Fetch and rebase local commits on top. |
| <pre>git push -u origin feature/branch</pre> | Push branch and set upstream tracking. |

## Merge & Rebase

| Example | Description |
| --- | --- |
| <pre>git merge feature/branch</pre> | Merge another branch into current branch. |
| <pre>git rebase origin/main</pre> | Replay commits on top of another base. |
| <pre>git rebase --continue</pre> | Continue after resolving conflicts. |
| <pre>git cherry-pick abc123</pre> | Apply a specific commit to current branch. |

## Stash

| Example | Description |
| --- | --- |
| <pre>git stash push -m "wip"</pre> | Temporarily save uncommitted changes. |
| <pre>git stash list</pre> | Show all stashed changes. |
| <pre>git stash pop</pre> | Restore and remove most recent stash. |

## Undo

| Example | Description |
| --- | --- |
| <pre>git restore file.ext</pre> | Discard working tree changes to a file. |
| <pre>git revert HEAD</pre> | Create a new commit that undoes a previous one. |
| <pre>git reset --soft HEAD~1</pre> | Undo last commit, keep changes staged. |
| <pre>git reflog</pre> | Show history of HEAD movements for recovery. |
