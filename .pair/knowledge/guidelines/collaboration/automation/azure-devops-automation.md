# Azure DevOps Automation

## Overview

Automation strategies for Azure DevOps workflows, including Azure Pipelines, board rules, service hooks, and workflow orchestration to improve team efficiency and consistency.

## Automation Components

### Status Synchronization

**Work Item to Board Updates**

- Automatic board column updates based on work item state changes
- Parent-child relationship status propagation
- Sprint assignment and capacity management

**Pull Request Integration**

- Automatic work item linking when commit messages contain `#WORK-ITEM-ID`
- Status updates when pull requests are created, reviewed, or merged
- Branch policy enforcement for required reviewers and build validation

**Hierarchical Status Management**

- Initiative -> Epic -> PBI -> Task status cascading
- Bottom-up status propagation rules
- Parent completion validation based on child item completion

### Board Automation Rules

Azure Boards supports built-in automation rules:

**Auto-State Transitions**

```
Rule: When a PR is merged for a PBI
Action: Set PBI state to "Done"
```

**Auto-Assignment**

```
Rule: When a work item is moved to "In Progress"
Action: Assign to current user (if unassigned)
```

Configure via: Project Settings -> Boards -> Rules

### Development Workflow Automation

**Branch Policies**

Configure via: Repos -> Branches -> Branch policies (on `main`):
- Require a minimum number of reviewers
- Check for linked work items
- Build validation (run CI pipeline before merge)
- Comment resolution required

**Azure Pipelines (CI/CD)**

```yaml
# azure-pipelines.yml - Example CI pipeline
trigger:
  branches:
    include:
      - main
      - feature/*

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
  - script: npm install
    displayName: 'Install dependencies'
  - script: npm run lint
    displayName: 'Run linter'
  - script: npm test
    displayName: 'Run tests'
  - script: npm run build
    displayName: 'Build project'
```

**PR Build Validation**

Configure via: Repos -> Branches -> Branch policies -> Build validation:
- Trigger: Automatic on PR creation/update
- Build pipeline: Select CI pipeline
- Policy requirement: Required

### Service Hooks

Azure DevOps supports webhooks for external integrations:

**Available Events**:
- Work item created/updated/deleted
- Pull request created/updated/merged
- Build completed
- Code pushed

**Configure via**: Project Settings -> Service hooks

**Common Integrations**:
- Slack/Teams notifications
- Custom webhook endpoints
- Azure Functions triggers

## Workflow Integration with pair

### Automated Flow

```
Developer creates branch (feature/#STORY-ID-description)
    |
    v
Developer commits with #STORY-ID in message
    -> Auto-links commit to work item
    |
    v
Developer creates PR via Azure CLI
    -> Auto-links PR to work item
    -> CI pipeline runs automatically
    -> Required reviewers assigned
    |
    v
Reviewer approves PR
    -> PR can be completed (merged)
    |
    v
PR merged (squash)
    -> Source branch deleted
    -> Work item state updated (if rules configured)
```

### Recommended Automation Setup

1. **Branch policies on `main`**: Required reviewers, build validation, linked work items
2. **CI Pipeline**: Lint, test, build on every PR
3. **Board rules**: Auto-state transitions for PBI/Task
4. **Service hooks**: Team notifications (Slack/Teams)

## Related Topics

- [Azure DevOps Implementation](../project-management-tool/azure-devops-implementation.md) - CLI commands and setup
- [Azure DevOps Tracking](../project-tracking/azure-devops-tracking.md) - Board setup and metrics
- [Azure DevOps Issues](../issue-management/azure-devops-issues.md) - Work item management
