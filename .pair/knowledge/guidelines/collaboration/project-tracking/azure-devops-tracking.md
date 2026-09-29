# Azure DevOps Project Tracking

Azure Boards configuration and hierarchical project tracking for comprehensive project management.

## Overview

This guide covers Azure Boards setup for tracking initiatives, epics, product backlog items (PBI), and tasks with comprehensive progress monitoring and reporting capabilities.

## Board Setup

### Board Configuration

Azure Boards uses a Kanban-style board with columns mapped to work item states.

**PBI Board Columns:**

- `New` - Items appena aggiunti al backlog
- `Committed` - Items committed in sprint
- `Approved` - Items discussi e approvati
- `Done` - Items con PR associata chiusa

**Task Board Columns:**

- `To Do` - Task non ancora iniziati
- `In Progress` - Task in corso di sviluppo
- `Done` - Task con PR creata

### Swim Lanes (Optional)

- **Expedite**: Urgent items that bypass normal flow
- **Standard**: Normal priority items
- **Blocked**: Items waiting on external dependencies

## Custom Fields

### Priority

Azure DevOps uses built-in priority field:
- **1** (P0) - Must-Have / Critical
- **2** (P1) - Should-Have / High
- **3** (P2) - Could-Have / Medium
- **4** (P3) - Nice-to-Have / Low

### Effort (Story Points = Hours)

- **Field**: `Microsoft.VSTS.Scheduling.StoryPoints` (on PBI)
- **Convention**: 1 story point = 1 hour
- **Remaining Work**: `Microsoft.VSTS.Scheduling.RemainingWork` (on Task)

### Iteration Path

- Sprint assignment via Iteration Path
- Example: `learnn\Sprint 1`, `learnn\Sprint 2`

## Hierarchy Tracking

### Work Item Hierarchy

```
Initiative (Feature)
└── Epic
    └── Product Backlog Item (PBI / User Story)
        └── Task
```

### Creating Hierarchy via CLI

```bash
# Create PBI
PBI_ID=$(az boards work-item create \
  --title "[WEB] User Story Title" \
  --type "Product Backlog Item" \
  --organization https://dev.azure.com/learnn \
  --project learnn \
  --query id --output tsv)

# Create Task as child
TASK_ID=$(az boards work-item create \
  --title "[WEB] Task Title" \
  --type "Task" \
  --fields "Microsoft.VSTS.Scheduling.RemainingWork=8" \
  --organization https://dev.azure.com/learnn \
  --project learnn \
  --query id --output tsv)

# Link parent-child
az boards work-item relation add \
  --id $PBI_ID \
  --relation-type child \
  --target-id $TASK_ID \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

## Progress Metrics

### Velocity Tracking

Track story points (hours) completed per sprint:

```bash
# Query completed PBIs in current sprint
az boards query --wiql "SELECT [System.Id], [System.Title], [Microsoft.VSTS.Scheduling.StoryPoints] FROM workitems WHERE [System.WorkItemType] = 'Product Backlog Item' AND [System.State] = 'Done' AND [System.IterationPath] = 'learnn\\Sprint X'" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Burndown

Azure DevOps provides built-in burndown charts:
- Navigate to: Boards -> Sprints -> Analytics
- Select: Sprint Burndown widget
- Tracks remaining work over time

### Cycle Time

- **Cycle Time**: Time from "Committed" to "Done"
- Available via: Analytics -> Cycle Time widget
- Helps identify bottlenecks in the workflow

### Lead Time

- **Lead Time**: Time from "New" to "Done"
- Available via: Analytics -> Lead Time widget

## Useful Queries

### Active Sprint Items

```bash
az boards query --wiql "SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo] FROM workitems WHERE [System.WorkItemType] = 'Product Backlog Item' AND [System.State] <> 'Done' AND [System.IterationPath] UNDER 'learnn' ORDER BY [Microsoft.VSTS.Common.Priority]" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Blocked Items

```bash
az boards query --wiql "SELECT [System.Id], [System.Title], [System.State] FROM workitems WHERE [System.Tags] CONTAINS 'blocked' ORDER BY [Microsoft.VSTS.Common.Priority]" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

### Items Without Estimates

```bash
az boards query --wiql "SELECT [System.Id], [System.Title] FROM workitems WHERE [System.WorkItemType] = 'Product Backlog Item' AND [Microsoft.VSTS.Scheduling.StoryPoints] = '' AND [System.State] <> 'Done'" \
  --organization https://dev.azure.com/learnn \
  --project learnn
```

## Dashboards

### Recommended Widgets

1. **Sprint Burndown** - Track sprint progress
2. **Velocity** - Historical velocity chart
3. **Cumulative Flow Diagram** - Visualize work-in-progress
4. **Cycle Time** - Average time to complete items
5. **Query Results** - Custom queries for specific views

## Workflow Integration with pair

### Status Flow per Step

```
Step 8 (crea-pbi):      PBI created -> New
Step 9 (task-breakdown): PBI -> Committed, Tasks created -> To Do
Step 10 (implementa):    Task -> In Progress -> Done, PBI -> Approved
Step 11 (review):        PBI -> Done (after PR merge)
```

## Related Topics

- [Azure DevOps Implementation](../project-management-tool/azure-devops-implementation.md) - CLI commands and setup
- [Azure DevOps Automation](../automation/azure-devops-automation.md) - Board rules and pipelines
- [Azure DevOps Issues](../issue-management/azure-devops-issues.md) - Work item management
- [Estimation Guidelines](../estimation/README.md) - Story points and effort tracking
