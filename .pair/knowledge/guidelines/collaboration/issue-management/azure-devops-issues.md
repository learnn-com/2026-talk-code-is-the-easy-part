# Azure DevOps Work Items

Azure DevOps work item management for comprehensive issue tracking integrated with project boards.

## Overview

This guide covers Azure DevOps work item types, workflows, and configuration for managing product backlog items, tasks, bugs, and features within the pair development framework.

## Work Item Types

### Product Backlog Item (PBI)

The primary unit for user stories and feature requests.

- **Equivalent to**: User Story in pair framework
- **States**: New -> Committed -> Approved -> Done
- **Key Fields**: Title, Description, Story Points, Priority, Iteration Path
- **Created by**: following the pair workflow in [06-how-to-refine-a-user-story](../../../how-to/06-how-to-refine-a-user-story.md)

### Task

Sub-work item of PBI for implementation tracking.

- **States**: To Do -> In Progress -> Done
- **Key Fields**: Title, Remaining Work (hours), Assigned To
- **Relationship**: Always child of a PBI
- **Created by**: following the pair workflow in [07-how-to-create-tasks](../../../how-to/07-how-to-create-tasks.md)

### Bug

Defect tracking and resolution.

- **States**: New -> Active -> Resolved -> Closed
- **Key Fields**: Title, Repro Steps, Severity, Priority
- **Can be**: Standalone or child of PBI/Epic

### Epic

Large body of work spanning multiple sprints.

- **States**: New -> Active -> Resolved -> Closed
- **Key Fields**: Title, Description, Priority
- **Contains**: Multiple PBIs as children

### Feature (Initiative)

Strategic initiative spanning multiple epics.

- **States**: New -> Active -> Resolved -> Closed
- **Key Fields**: Title, Description, Priority
- **Contains**: Multiple Epics as children

## Work Item Lifecycle

### PBI Lifecycle (pair workflow)

```
New            -> Newly created PBI
  |
Committed      -> PBI committed into the sprint
  |
Approved       -> PBI in development, PR created
  |
Done           -> PR merged, PBI completed
```

### Task Lifecycle

```
To Do          -> Task created, not started
  |
In Progress    -> Developer is working on it
  |
Done           -> Implementation completed
```

## Creating Work Items via CLI

### Create PBI

```bash
az boards work-item create \
  --title "[Piattaforma] Descrizione" \
  --type "Product Backlog Item" \
  --description "$(cat pbi-description.html)" \
  --iteration "learnn" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Create Task

```bash
az boards work-item create \
  --title "[Piattaforma] Descrizione" \
  --type "Task" \
  --fields "Microsoft.VSTS.Scheduling.RemainingWork=[HOURS]" \
  --iteration "learnn" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Create Bug

```bash
az boards work-item create \
  --title "[BUG] Descrizione del problema" \
  --type "Bug" \
  --description "Repro steps..." \
  --fields "Microsoft.VSTS.Common.Severity=2 - High" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

## Priority and Severity

### Priority (all work item types)

- **1**: Must-Have / Critical (P0)
- **2**: Should-Have / High (P1)
- **3**: Could-Have / Medium (P2)
- **4**: Nice-to-Have / Low (P3)

### Severity (Bugs only)

- **1 - Critical**: System crash, data loss
- **2 - High**: Major feature broken, no workaround
- **3 - Medium**: Feature partially broken, workaround exists
- **4 - Low**: Cosmetic issue, minor inconvenience

## Linking and Relationships

### Parent-Child

```bash
# Link Task as child of PBI
az boards work-item relation add \
  --id [PBI-ID] \
  --relation-type child \
  --target-id [TASK-ID] \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Related

```bash
# Link two related work items
az boards work-item relation add \
  --id [WORK-ITEM-1] \
  --relation-type "System.LinkTypes.Related" \
  --target-id [WORK-ITEM-2] \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Duplicate

```bash
az boards work-item relation add \
  --id [ORIGINAL-ID] \
  --relation-type "System.LinkTypes.Duplicate-Forward" \
  --target-id [DUPLICATE-ID] \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

## Assignment

```bash
# Assign work item
az boards work-item update \
  --id [WORK-ITEM-ID] \
  --fields "System.AssignedTo=email@learnn.com" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

## Tags

```bash
# Add tags
az boards work-item update \
  --id [WORK-ITEM-ID] \
  --fields "System.Tags=frontend;discovery;sprint-5" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

## Workflow Integration with pair

### pair Step to Work Item Mapping

| pair Step | Work Item Action |
|-----------|-----------------|
| Step 8: Refine Story | Create PBI (New) + Task with Remaining Work |
| Step 9: Create Tasks | Append task breakdown to PBI body |
| Step 10: Implement | Task -> In Progress -> Done, Create PR |
| Step 11: Code Review | PBI -> Done (after merge) |

## Related Topics

- [Azure DevOps Implementation](../project-management-tool/azure-devops-implementation.md) - CLI commands and setup
- [Azure DevOps Tracking](../project-tracking/azure-devops-tracking.md) - Board setup and metrics
- [Azure DevOps Automation](../automation/azure-devops-automation.md) - Board rules and pipelines
