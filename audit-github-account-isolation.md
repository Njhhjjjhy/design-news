# Audit + fix: GitHub account isolation

Paste this prompt into Claude Code in any project to confirm the project is fully tied to my **personal** GitHub account (`Njhhjjjhy`, email `riaancjb@gmail.com`) and that my **work** account (`RiaanMOHA`, email `riaan.burger@moreharvest.com`) has zero footprint — and to actually FIX anything that fails, end-to-end, in one session.

---

I'm a designer, not a developer. Walk me through this in plain language. You may make changes, but only with my explicit go-ahead for each fix. After each fix, verify it worked before moving on.

## My setup (reference)

- **Personal GitHub:** `Njhhjjjhy` / `riaancjb@gmail.com` — this is where this project lives.
- **Work GitHub:** `RiaanMOHA` / `riaan.burger@moreharvest.com` — should have zero involvement.
- Both accounts are logged in via `gh`. The work account is usually the active one — leave it active when you're done so my other work isn't disrupted.

## Six things to verify

**Ownership & access (GitHub side):**
1. Repo on GitHub is owned by `Njhhjjjhy`, not `RiaanMOHA`.
2. `RiaanMOHA` is NOT a collaborator on the repo.
3. NO pending collaborator invitations to `RiaanMOHA`.
4. The two accounts share NO GitHub organizations (a shared org could create backdoor access).

**Local commit identity (this computer, going forward):**
5. `git config user.name` and `user.email` in this project stamp NEW commits with my personal identity, not work.

**Historical commit identity (past commits on GitHub):**
6. EVERY commit in `git log` is signed with my personal identity. No commit anywhere shows the work identity.

---

## The playbook

### Step 1 — Run the audit (read-only)

```bash
# Where is the repo, and what is it called?
git remote -v

# How are commits currently being stamped going forward?
git config user.name
git config user.email

# How are existing commits stamped? (Check ALL of them, not just the latest.)
git log --pretty=format:'%h %an <%ae> — %s'

# Which GitHub accounts are logged in? Which is active?
gh auth status

# Switch to the personal account and inspect the repo
gh auth switch --user Njhhjjjhy
gh api repos/Njhhjjjhy/<repo-name>/collaborators --jq '.[].login'
gh api repos/Njhhjjjhy/<repo-name>/invitations --jq '.[].invitee.login'
gh api user/orgs --jq '.[].login'

# Check work account's orgs and switch back
gh auth switch --user RiaanMOHA
gh api user/orgs --jq '.[].login'
```

Use the repo name from `git remote -v` in place of `<repo-name>`.

### Step 2 — Report findings in plain language

For each of the six checks: ✅ pass or ❌ fail. For each fail, explain in plain language what it means and what the risk is. Do NOT apply fixes yet.

### Step 3 — Offer fixes, one at a time, get explicit go-ahead for each

**Fix for check #5 — future commits labeled wrong:**

Plain language: "Right now, every save you make in this project is labeled with your work name and work email. Your work account doesn't actually have access — but the label makes commits *look* like work output. I can change this for this project only; your other projects are untouched."

```bash
git config user.name "Njhhjjjhy"
git config user.email "riaancjb@gmail.com"
```

Verify:

```bash
git config user.name && git config user.email
```

**Fix for check #6 — past commits labeled wrong:**

Plain language warning first:
> "Each existing commit is like a signed piece of paper. We can re-sign them, but doing so rewrites history and requires force-pushing to GitHub. This is safe **only** if I am the only contributor, there are no open pull requests, and no other branches anyone else is using. This repo qualifies because it's brand new and I'm the only person on it. Confirm before I proceed."

```bash
# Rewrite every commit authored/committed under the work email
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --env-filter '
OLD_EMAIL="riaan.burger@moreharvest.com"
CORRECT_NAME="Njhhjjjhy"
CORRECT_EMAIL="riaancjb@gmail.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]; then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

Verify locally:

```bash
git log --pretty=format:'%h %an <%ae> — %s'
```

Every line should show `Njhhjjjhy <riaancjb@gmail.com>`.

Then push the rewritten history. The work account does NOT have permission to push to the personal repo (this is the separation working as intended), so switch to the personal account first:

```bash
gh auth switch --user Njhhjjjhy
git push --force-with-lease origin main
gh auth switch --user RiaanMOHA
```

`--force-with-lease` is the safer version of force-push — it refuses if the remote has changes I don't know about.

### Step 4 — Final verification

1. Re-run `git log --pretty=format:'%h %an <%ae> — %s'` and confirm every line shows the personal identity.
2. Re-run `git config user.name && git config user.email` and confirm personal identity.
3. Tell me to open the repo page in a browser: `https://github.com/Njhhjjjhy/<repo-name>`. The latest commit row at the top of the file list should show `Njhhjjjhy` as the author. Ask me to confirm visually.
4. Confirm that `gh auth status` shows `RiaanMOHA` as the active account (back to where we started).

### Step 5 — Final report

Report back exactly like this:

> **Confirmed — RiaanMOHA has zero access to this project, and all commits (past and future) are signed personally.**
> - Repo owner: Njhhjjjhy
> - Collaborators: only Njhhjjjhy
> - Pending invites: none
> - Shared orgs: none
> - Local commit identity (going forward): Njhhjjjhy / riaancjb@gmail.com
> - Historical commits: all signed Njhhjjjhy / riaancjb@gmail.com
> - Active gh account: RiaanMOHA (unchanged)

If anything could not be fixed (e.g. the repo has other contributors and history rewrite isn't safe), flag it clearly and tell me the trade-off — don't silently skip.
