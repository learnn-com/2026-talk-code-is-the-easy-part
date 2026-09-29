# Azure DevOps Implementation

## Overview

Learnn uses **Azure DevOps** for source control (Azure Repos) and project management (Azure Boards). This guide covers creating pull requests and linking work items via Azure CLI.

**Defaults:** Organization `https://dev.azure.com/learnn`, Project `learnn`, Repository `learnn`.

---

## Prerequisites

- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Extension `azure-devops` (installed automatically on first `az repos` use)
- Logged in: `az login` (and, if needed, `az devops login` for PAT)

---

## Pull requests

### PR description: use the template

Use the [PR template](../templates/pr-template.md) for the PR description. Copy it, fill the relevant sections (Summary, Changes Made, Testing, etc.), then pass the body when creating the PR.

**From a file (recommended for long descriptions):**

```bash
# After filling pr-body.md from the template:
az repos pr create ... --description "$(cat pr-body.md)"
```

**Minimal (title + short summary):** you can pass a short `--description "## Summary\n..."` and optionally edit the PR in the Azure DevOps UI to add the full template content.

### Create a PR

```bash
az repos pr create \
  --organization "https://dev.azure.com/learnn" \
  --project learnn \
  --repository learnn \
  --source-branch <feature-branch> \
  --target-branch Development \
  --title "[<PBI-ID>] <type>: <short description>" \
  --description "$(cat pr-body.md)"
```

**Optional:** link work items at creation time:

```bash
az repos pr create ... --work-items <ID1> [ID2 ...]
```

**Example (description from file):**

```bash
az repos pr create \
  --organization "https://dev.azure.com/learnn" \
  --project learnn \
  --repository learnn \
  --source-branch feature/9557-garanzia-rimborso-checkout \
  --target-branch Development \
  --title "[9557] feat: 14-day refund guarantee UI in custom checkout" \
  --description "$(cat pr-body.md)"
```

### Checkout a PR locally

```bash
az repos pr checkout --id <PR_ID> --org https://dev.azure.com/learnn
```

---

## Linking work items to a PR

### Link one or more work items (PBI/Task)

```bash
az repos pr work-item add --id <PR_ID> --work-items <ID1> [ID2 ...] --org https://dev.azure.com/learnn
```

**Example:**

```bash
az repos pr work-item add --id 2018 --work-items 9557 --org https://dev.azure.com/learnn
```

### List linked work items

```bash
az repos pr work-item list --id <PR_ID> --org https://dev.azure.com/learnn
```

### Unlink work items

```bash
az repos pr work-item remove --id <PR_ID> --work-items <ID1> [ID2 ...] --org https://dev.azure.com/learnn
```

---

## Related

- **Way of working:** [.pair/adoption/tech/way-of-working.md](/.pair/adoption/tech/way-of-working.md) — branch naming, commit policy, PR review/diff
- **Branch template:** [templates/branch-template.md](../templates/branch-template.md)
- **Commit template:** [templates/commit-template.md](../templates/commit-template.md)
- **PR template:** [templates/pr-template.md](../templates/pr-template.md)
