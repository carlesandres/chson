# git Core Cheats

Version: 2.x
Published: 2026-01-15T00:00:00Z

Common git commands for day-to-day work.

## Setup & Config

Set up identity and useful defaults.

| Example | Description |
| --- | --- |
| <pre>git config --global user.name "Your Name"<br/>git config --global user.email "you@example.com"</pre> | Configure the author name/email used for new commits. |
| <pre>git config --list<br/>git config --global --list<br/>git config user.email</pre> | Inspect Git configuration (all scopes or a single key). |
| <pre>git config --global init.defaultBranch main</pre> | Make new repositories use `main` as the initial branch. |
| <pre>git config --global push.autoSetupRemote true</pre> | Automatically set upstream when pushing a new branch (Git 2.37+). |
| <pre># repo-local<br/>echo ".DS_Store" &gt;&gt; .gitignore<br/><br/># global (macOS example)<br/>git config --global core.excludesfile ~/.config/git/ignore</pre> | Ignore files in one repo via `.gitignore`, or globally via `core.excludesfile`. |

## Inspect

Understand repo state and history.

| Example | Description |
| --- | --- |
| <pre>git status<br/>git status --short<br/>git status --porcelain</pre> | Show staged/unstaged changes and untracked files. |
| <pre>git log --oneline --decorate --graph --max-count 20<br/>git log --oneline --decorate --graph --all</pre> | Browse commit history in a compact, visual format. |
| <pre>git show HEAD<br/>git show &lt;sha&gt;<br/>git show &lt;sha&gt; --name-only</pre> | Display a commit, its patch, and optionally affected files. |
| <pre>git diff<br/>git diff --staged<br/>git diff main...HEAD</pre> | Compare working tree, index, or branches. |
| <pre>git branch<br/>git branch -vv<br/>git branch -a</pre> | List local branches (and optionally remotes + upstream tracking). |
| <pre>git remote -v<br/>git remote show origin</pre> | List remotes and inspect remote-tracking branches. |
| <pre>git blame path/to/file.ext<br/>git blame -L 120,180 path/to/file.ext</pre> | Attribute lines to commits (useful for debugging and archaeology). |
| <pre>git reflog<br/>git reflog --date=iso</pre> | Show where `HEAD` and branches pointed recently (great for recovery). |

## Edit & Commit

Stage changes and create commits.

| Example | Description |
| --- | --- |
| <pre>git add .<br/>git add -A<br/>git add path/to/file.ext</pre> | Add changes to the index (staging area). |
| <pre>git add -p<br/># (use to split a file into multiple commits)</pre> | Stage hunks selectively instead of staging the whole file. |
| <pre>git restore --staged path/to/file.ext<br/>git reset HEAD -- path/to/file.ext</pre> | Remove changes from the index while keeping your working tree edits. |
| <pre>git restore path/to/file.ext<br/>git restore .</pre> | Discard working tree changes (use carefully; edits are lost). |
| <pre>git commit -m "Add feature"<br/>git commit<br/># opens editor</pre> | Create a commit from staged changes. |
| <pre>git commit --amend -m "Better message"</pre> | Update the most recent commit (avoid if already pushed/shared). |
| <pre>git cherry-pick &lt;sha&gt;<br/>git cherry-pick &lt;sha1&gt; &lt;sha2&gt;</pre> | Apply commit(s) from elsewhere onto your current branch. |

## Branching

Create, switch, and clean up branches.

| Example | Description |
| --- | --- |
| <pre>git switch -c feature/my-branch<br/># older equivalent<br/>git checkout -b feature/my-branch</pre> | Create a new branch and check it out. |
| <pre>git switch main<br/>git switch -</pre> | Move between branches (`-` toggles to previous branch). |
| <pre>git branch -m old-name new-name<br/># rename current branch<br/>git branch -m new-name</pre> | Rename a local branch. |
| <pre>git branch -d feature/my-branch<br/># force delete (unmerged)<br/>git branch -D feature/my-branch</pre> | Delete a local branch (safe delete refuses if not merged). |
| <pre>git fetch origin<br/>git switch --track origin/feature/my-branch<br/># shorthand if branch name matches<br/>git switch feature/my-branch</pre> | Create a local branch that tracks a remote branch. |

## Remote

Sync with GitHub/GitLab/etc.

| Example | Description |
| --- | --- |
| <pre>git clone https://github.com/org/repo.git<br/>git clone git@github.com:org/repo.git</pre> | Create a local copy of a remote repository. |
| <pre>git fetch<br/>git fetch origin<br/>git fetch --prune</pre> | Download new objects/refs without modifying your current branch. |
| <pre>git pull<br/>git pull --rebase<br/>git pull origin main</pre> | Fetch and integrate changes into the current branch (merge or rebase). |
| <pre>git push<br/>git push -u origin feature/my-branch<br/>git push --set-upstream origin feature/my-branch</pre> | Upload commits to a remote, optionally setting upstream tracking. |
| <pre>git push origin --delete feature/my-branch<br/># equivalent<br/>git push origin :feature/my-branch</pre> | Remove a branch from the remote. |
| <pre>git remote set-url origin git@github.com:org/repo.git<br/>git remote -v</pre> | Change the remote URL (e.g., switch HTTPS ↔ SSH). |

## Merge & Rebase

Integrate changes between branches.

| Example | Description |
| --- | --- |
| <pre>git switch main<br/>git merge feature/my-branch</pre> | Merge another branch into the current branch. |
| <pre>git fetch origin<br/>git rebase origin/main</pre> | Replay your branch commits on top of an updated base. |
| <pre>git rebase --continue<br/>git rebase --abort<br/>git rebase --skip</pre> | Manage an in-progress rebase during conflict resolution. |
| <pre># after resolving files<br/>git add path/to/file.ext<br/>git commit<br/># or during rebase<br/>git rebase --continue</pre> | After fixing conflicts, stage resolved files and continue the operation. |
| <pre>git merge-base main HEAD<br/>git log --oneline $(git merge-base main HEAD)..HEAD</pre> | Find the common ancestor between branches. |

## Stash

Temporarily shelve work-in-progress changes.

| Example | Description |
| --- | --- |
| <pre>git stash<br/>git stash push -m "wip: refactor"<br/>git stash -u  # include untracked</pre> | Save local changes without committing them. |
| <pre>git stash list<br/>git stash show stash@&#123;0&#125;<br/>git stash show -p stash@&#123;0&#125;</pre> | See what you stashed and what it contains. |
| <pre>git stash apply<br/>git stash pop<br/>git stash pop stash@&#123;1&#125;</pre> | Re-apply stashed changes (pop also removes the stash entry). |
| <pre>git stash drop stash@&#123;0&#125;<br/>git stash clear</pre> | Remove one stash entry or all stashes. |

## Undo & Recovery

Safely back out changes and recover mistakes.

| Example | Description |
| --- | --- |
| <pre>git revert &lt;sha&gt;<br/>git revert HEAD</pre> | Create a new commit that undoes an existing commit. |
| <pre># keep changes staged<br/>git reset --soft HEAD~1<br/><br/># keep changes unstaged<br/>git reset --mixed HEAD~1<br/><br/># discard changes entirely (dangerous)<br/>git reset --hard HEAD~1</pre> | Move `HEAD`/branch to another commit (soft/mixed/hard control what happens to changes). |
| <pre>git restore --source &lt;sha&gt; path/to/file.ext<br/># older equivalent<br/>git checkout &lt;sha&gt; -- path/to/file.ext</pre> | Bring back a previous version of a file without switching branches. |
| <pre>git reflog<br/># then recover<br/>git branch recover/&lt;name&gt; &lt;sha&gt;</pre> | Use reflog to locate old commit SHAs and create a recovery branch. |

## Tags

Mark releases or important points in history.

| Example | Description |
| --- | --- |
| <pre>git tag -a v1.2.3 -m "v1.2.3"<br/>git tag -a v1.2.3 &lt;sha&gt;</pre> | Create a signed/annotated pointer to a commit (preferred for releases). |
| <pre>git tag<br/>git tag -l "v1.*"<br/>git show v1.2.3</pre> | Browse tags and inspect what they point to. |
| <pre>git push origin v1.2.3<br/>git push origin --tags</pre> | Publish tags to the remote. |
| <pre># local<br/>git tag -d v1.2.3<br/><br/># remote<br/>git push origin :refs/tags/v1.2.3</pre> | Remove a tag locally and/or from the remote. |

## Search

Locate commits, changes, and text quickly.

| Example | Description |
| --- | --- |
| <pre>git grep "TODO"<br/>git grep -n "functionName" -- path/to/dir</pre> | Search tracked content (fast, respects `.gitignore`). |
| <pre>git log --grep="fix" --oneline<br/>git log --grep="JIRA-123" --oneline</pre> | Find commits whose commit message matches a pattern. |
| <pre>git log -S "mySymbol" --oneline<br/>git log -G "regexPattern" --oneline</pre> | Find commits that add/remove a string (`-S`) or match a regex in diffs (`-G`). |
