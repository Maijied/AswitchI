---
name: "source-command-implement"
description: "Migrated source command `implement`"
---

# source-command-implement

Use this skill when the user asks to run the migrated source command `implement`.

## Command Template

# /implement — Execute a finalized plan

Implement the **ready/finalized** plan step by step (phases → todos → verification → git if the plan says so).

**Input (optional):**

```
/implement
/implement ~/.cursor/plans/common_report_universal_kit_a8f3c201.plan.md
/implement Phase 0 only
```

When invoked: read the plan → mark todos in order → implement each step → verify → summarize.

Follow `.cursor/skills/implement/SKILL.md` and `~/.cursor/skills/implement/SKILL.md`.

Do **not** re-plan unless the plan is missing or the user asks to revise it. No Codex attribution in commits.
