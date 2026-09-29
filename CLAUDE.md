# AGENTS.md

This repository uses a structured approach for AI agents. **Always start by reading the project context, then identify your task, then follow the specific guidance.**

In all interactions and commit messages, be extremely coincise and sacrify grammar for the sake of coincision.

## Skill-Enabled Assistants

If your agent supports **Agent Skills** (agentskills.io), start every session by running:

```text
/pair-next
```

The `/pair-next` skill reads project adoption files and PM tool state to recommend the most relevant action. Follow its suggestion or override with a specific skill.

**No skills installed?** Skip this section and follow the manual Quick Start Process below.

## 🧠 Session Context (Maintain Throughout Conversation)

**CRITICAL**: Establish and maintain these 4 key pieces of information for the entire session:

```text
SESSION STATE:
├── How-to: [which .pair/knowledge/how-to/XX-*.md file you're following]
├── Role: [product-manager | product-engineer | staff-engineer]
├── PM Tool: [GitHub Projects | Jira | Linear | Trello | etc.]
└── PM Access: [MCP command | URL/location for project management queries]
```

### Example session state

```text
How-to: 08-how-to-implement-a-task.md
Role: product-engineer
PM Tool: GitHub Projects
PM Access: MCP github_projects (org: mycompany, repo: myproject)
```

### How to establish session context

1. **Determine how-to**: Use task selection algorithm below
2. **Identify role**: Check user language/request type, or ask if unclear
3. **Find PM tool**: Read `.pair/adoption/tech/way-of-working.md` to get the current project management tool
4. **Get PM access**: Extract tool-specific access instructions from `.pair/knowledge/guidelines/collaboration/project-management-tool/README.md`

#### PM Tool Setup Process

- **Primary source**: `.pair/adoption/tech/way-of-working.md` (contains the adopted PM tool)
- **Usage instructions**: `.pair/knowledge/guidelines/collaboration/project-management-tool/README.md` (contains tool-specific guidance)
- **If tool not specified**: Ask developer which PM tool to use
- **Access details**: Extract MCP commands or URLs from the framework file for your specific tool

**Include this context in ALL subsequent responses** - it ensures consistency and prevents context drift as conversations grow long.

## 🎯 Quick Start Process

**With skills**: Run `/pair-next` — it handles steps 1-3 automatically.

**Without skills** (manual flow):

1. **Establish session context** (see Session Context above - maintain for entire conversation)
2. **Understand the project**: Read `.pair/adoption/product/PRD.md` for project overview
3. **Identify your task**: Match your request to a task category using `.pair/knowledge/how-to/` (see task list below)
4. **Follow the guidance**: Use the selected how-to file for specific instructions
5. **Apply constraints**: Check `.pair/adoption/tech/` for technical requirements

## 📋 Available Tasks

**Task index**: `.pair/knowledge/how-to` - consult this for precise task matching

### Induction (Getting Started)

| - **Create PRD** → `01-how-to-create-PRD.md` | Tags: prd, requirements, planning |
| - **Setup project** → `02-how-to-complete-bootstrap-checklist.md` | Tags: bootstrap, setup, onboarding |

### Strategic (High-level Planning)

| - **Plan initiatives** → `03-how-to-create-and-prioritize-initiatives.md` | Tags: initiative, roadmap |
| - **Break down epics** → `04-how-to-breakdown-epics.md` | Tags: epic, breakdown |

### Iteration (Sprint Planning)

| - **Create user stories** → `05-how-to-breakdown-user-stories.md` | Tags: story, requirements |
| - **Refine stories** → `06-how-to-refine-a-user-story.md` | Tags: refine, acceptance, criteria |
| - **Create tasks** → `07-how-to-create-tasks.md` | Tags: task, breakdown, assign |

### Execution (Development)

- **Implement feature** → `08-how-to-implement-a-task.md` | Tags: implement, feature, code

### Review (Quality Assurance)

- **Code review** → `09-how-to-code-review.md` | Tags: review, code, approve

## 🛠️ Essential Commands

```bash
# Setup
pnpm install
pnpm build

# Development
pnpm dev                    # Run all packages in dev mode (parallel)
pnpm build                  # Build all packages
pnpm build:packages         # Build only packages (not apps/services)

# Testing
pnpm pre-push               # Build + run tests (excludes e2e)

# Quality checks
pnpm lint                   # Lint all packages
pnpm format                 # Format code with prettier
pnpm pre-commit             # Run pre-commit checks (parallel)
```

## 📚 Key References

- **Project context**: `.pair/adoption/product/PRD.md`
- **PM tool adoption**: `.pair/adoption/tech/way-of-working.md` (determines which PM tool to use)
- **PM tool usage**: `.pair/knowledge/guidelines/collaboration/project-management-tool/README.md` (tool-specific instructions)
- **Technical decisions**: `.pair/adoption/tech/` (architecture, tech-stack, infrastructure)
- **Testing strategy**: `.pair/knowledge/guidelines/testing/README.md`
- **Code guidelines**: `.pair/knowledge/guidelines/code-design/README.md`
- **Security rules**: `.pair/knowledge/guidelines/quality-assurance/security/security-guidelines.md`

## 🎭 If unsure about your task

**Use the index**: Consult `.pair/knowledge/how-to/` and match user request keywords to task tags (see Task Catalog above)

### Workflow categories

- **Getting started / new project?** → Induction tasks
- **Planning roadmap / high-level design?** → Strategic tasks
- **Sprint planning / story work?** → Iteration tasks
- **Writing code / implementing?** → Execution tasks
- **Quality checks / reviewing?** → Review tasks

#### Role hints in request

- Product Manager language → prefer `role_preference: ["product-manager"]` tasks
- Technical/code language → prefer `product-engineer` or `staff-engineer` tasks

**Still unclear?** Show the 2 highest tag-matching tasks and ask the developer to confirm.

## ⚡ Quick Rules

- **Maintain session context** - Always reference your current how-to, role, PM tool, and access method
- **One task per session** - keep changes focused within the current how-to scope
- **Tests required** - follow testing strategy for all code changes
- **Check adoptions first** - `.pair/adoption/tech/` overrides other guidance
- **Package-specific rules win** - check for `.pair/knowledge/guidelines/` in target package
- **No secrets in code** - ask for secure access instructions if needed
- **Context consistency** - if switching how-to mid-session, explicitly update your session context
- **Bug fix workflow** - NEVER modify code to fix a bug before creating a test that reproduces it. Test-first debugging ensures the fix actually addresses the problem.

## 🐛 Bug Resolution Workflow

**Critical principle**: Test-first debugging prevents code changes that don't fix the actual problem.

### Process

1. **Understand the bug** - Read error messages, logs, and problem descriptions thoroughly
2. **Create a failing test** - Write a test that reproduces the bug (test should FAIL)
3. **Verify test fails** - Run test to confirm it fails with the expected error
4. **Fix the code** - Make minimal code changes to make the test pass
5. **Verify fix** - Run all tests to ensure fix doesn't break anything else
6. **Clean up** - Refactor and optimize once the test passes

### Example Bug Fix

```typescript
// ❌ WRONG: modifying code before understanding the bug
// Just changing things hoping it works

// ✅ RIGHT: create test first, then fix
// Step 1: Write failing test
test("should handle local path in --url parameter", () => {
  const result = isLocalPath("/absolute/path")
  expect(result).toBe(true) // This FAILS first
})

// Step 2: Verify it fails
// $ pnpm test  →  FAIL: expected false to equal true

// Step 3: Fix the code
function isLocalPath(str: string): boolean {
  return str.startsWith("/") || str.startsWith("./")
  // was missing slash check
}

// Step 4: Verify test passes
// $ pnpm test  →  PASS
```

### Key Benefits

- **Evidence-based**: Proves the fix actually works
- **Regression prevention**: Test stays in codebase to catch future breaks
- **Clarity**: Test documents expected behavior
- **Confidence**: Linting + tests pass before committing

## 🔄 Task Selection Algorithm

1. **Exact match**: Developer mentions specific how-to ID/filename → use it
2. **Tag matching**: Match request keywords to tags in `.pair/knowledge/how-to/` list above
3. **Category workflow**: Follow the natural progression (induction → strategic → iteration → execution → review)
4. **Role context**: Consider if developer specified a role (product-manager, product-engineer, staff-engineer)
5. **When ambiguous**: Show top 2 matches with their tags and ask for confirmation

**Example**: "implement login feature" → matches tags `["implement", "feature", "code"]` → task `08-how-to-implement-a-task.md`

---

## 📝 Session Context Examples

### Example 1: Implementation task

```text
SESSION STATE:
├── How-to: 08-how-to-implement-a-task.md
├── Role: product-engineer
├── PM Tool: GitHub Projects
└── PM Access: MCP github_projects --org=mycompany --repo=myproject
```

### Example 2: Planning task

```text
SESSION STATE:
├── How-to: 04-how-to-breakdown-epics.md
├── Role: product-manager
├── PM Tool: Linear
└── PM Access: https://linear.app/myteam/projects/active
```

### Example 3: Review task

```text
SESSION STATE:
├── How-to: 09-how-to-code-review.md
├── Role: staff-engineer
├── PM Tool: Jira
└── PM Access: MCP jira --project=MYPROJ --board=123
```

_This AGENTS.md follows the task-first approach: establish context, identify what you need to do, then follow the specific guidance files consistently throughout the session._
