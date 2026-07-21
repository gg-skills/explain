---
name: explain
description: when configuring explain, summarize, or make plans, studies, specs, decisions, or code flows easier to understand. Handoff explanations before decisions. MCP-compatible. Not for unexplained code.
---

# GG → Explain → Technical Narratives

> **Snapshot age:** This is a hand-authored skill with no captured corpus. Reference content is maintained manually.

## Overview

Use this skill to translate existing local evidence into a compact explanation surface. It does not
do new research or planning; it turns a known plan, study, spec cluster, decision set,
architecture path, or code flow into concise prose plus the smallest set of visuals that
materially improve understanding.

## When to Use This Skill

**TRIGGER when:**
- The user explicitly asks to explain, summarize visually, make something easier to understand, or show the flow.
- A plan, study, spec set, decision packet, or code path already exists but is too dense for fast comprehension.
- Another workflow wants to offer a digestible explanation packet before planning or decision resolution.
- The task is about translating known local evidence, not collecting new evidence.

**SKIP when:**
- No explanation target or source artifact is available.
- The request requires new evidence, new planning, or a durable decision workflow instead of explanation.
- The source material is too contradictory or incomplete to explain honestly.
- The requested output medium has rendering constraints that cannot be satisfied and no safe fallback exists.

## Common Misconceptions

| # | Misconception | Correction | Key concept |
|---|---------------|------------|-------------|
| 1 | This skill performs research or planning. | It only translates and presents existing evidence. | Translation layer |
| 2 | Explanations should include every detail. | Include only what improves scan speed and actionability. | Concise first |
| 3 | Multiple visuals always help. | Use one primary visual; add a second only when it removes ambiguity. | Minimal visuals |
| 4 | Code pointers are always useful. | Skip file tables when the explanation is purely conceptual. | Contextual inclusion |
| 5 | This skill can invent missing facts. | Stop and hand off to `study` or `research-online` when evidence is thin. | Evidence grounded |
| 6 | Explanations can start with background. | Lead with the shortest truthful answer sentence. | Answer-first |
| 7 | Any visual format works everywhere. | Validate Mermaid locally and use ASCII as fallback. | Renderer compatibility |
| 8 | Explanations without next steps are acceptable. | Always end with the next downstream action. | Actionable handoff |

## Guidance Alignment

- Apply repository guidance consistently with `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`.
- Prefer existing local evidence, repo artifacts, and code references over fresh discovery.
- If diagram-format selection needs deeper guidance, use `text-architecture`.
- If the explanation must be published through a constrained downstream renderer, validate Mermaid locally with `npm run check:mermaid -- --files <packet.md>`.
- When native Codex sub-agents are available, use the skill-local prompt assets under `agents/`:
  - `diagram-selector.md` to choose the strongest single visual,
  - `clarity-auditor.md` to pressure-test scan speed and fidelity before finalizing the packet.
- If current external facts are missing, hand off to `research-online/SKILL.md` instead of guessing.

## Explanation Quality Checklist

Use this checklist before delivering any explanation packet. Each item is a gate—the explanation is not ready until all required items are satisfied.

| # | Checklist Item | Why It Matters | Gate |
|---|---------------|---------------|------|
| 1 | **Source artifact identified** — Explanation target has an existing source (plan/study/code/decision) | Enables evidence grounding | Pre-draft |
| 2 | **Target question clarified** — Exact question being answered is stated | Prevents scope creep | Pre-draft |
| 3 | **Packet shape chosen** — Visual form selected from `visual-packet-patterns.md` | Ensures lowest cognitive load | Draft |
| 4 | **Answer-first prose** — Lead with 2–5 sentences of concise answer | Enables fast scanning | Draft |
| 5 | **Primary visual present** — One strong visual (Mermaid/ASCII/table) | Supports visual learners | Draft |
| 6 | **Visual validated** — Mermaid syntax checked with `npm run check:mermaid` | Prevents broken renders | Draft |
| 7 | **File pointers contextual** — Only included when they improve actionability | Avoids noise | Draft |
| 8 | **Evidence grounded** — Every claim maps to source artifact | Prevents speculation | Draft |
| 9 | **Uncertainties called out** — Open questions explicitly stated | Honest communication | Draft |
| 10 | **What To Do Next included** — Clear downstream action or next skill | Prevents user stranded | Closeout |
| 11 | **Scan speed verified** — Packet reads in < 30 seconds | Ensures actionability | Closeout |
| 12 | **Visual count ≤ 2** — Only 1–2 visuals maximum | Prevents over-visualization | Closeout |

### Quality Tiers

| Tier | Criteria | Use When |
|------|----------|----------|
| **Minimal** | Items 1–4, 10 | Purely conceptual, no visuals needed |
| **Standard** | Items 1–8, 10 | Explanation with single visual |
| **Full** | All 12 items | Complex explanation with multiple components |

### Pre-Delivery Verification

Before delivering an explanation packet, verify:

```
□ Source artifact identified and referenced
□ Target question is clear and scoped
□ Packet shape chosen from visual-packet-patterns.md
□ Answer-first prose: 2–5 sentences lead
□ Primary visual present and validated
□ File pointers only when actionable
□ All claims grounded in evidence
□ Uncertainties explicitly called out
□ What To Do Next included
□ Scan speed < 30 seconds
□ Visual count ≤ 2
```

## Explanation Consistency Validator

Before delivering an explanation, run these consistency checks. A packet that fails any check must be fixed before delivery.

### Consistency Check Matrix

| Check | What to Verify | How to Fix |
|-------|---------------|------------|
| **Prose vs Visual** | Visual reflects claims made in prose | Update visual |
| **Claims vs Source** | Every claim maps to source artifact | Add citation or remove claim |
| **Visual vs Renderer** | Diagram syntax compatible with target | Simplify or use ASCII fallback |
| **Files vs Actionability** | File paths are verified and relevant | Remove unverified paths |
| **Next Step vs Downstream** | Next action routes to correct skill | Verify routing |
| **Uncertainties vs Evidence** | Gaps are acknowledged, not smoothed | Add explicit uncertainty callout |

### Red Flags (Never Present)

An explanation with any of these must be fixed before delivery:

- [ ] Claim not grounded in source evidence
- [ ] Unverified file path cited
- [ ] Mermaid diagram fails validation
- [ ] No "What To Do Next" section
- [ ] More than 2 visuals
- [ ] Over 800 words for core explanation

## Non-Negotiable Policy

1. Use this as a translation and presentation layer, not as a research or planning workflow.
2. Start from an existing source surface: code, plan, study, spec set, decision packet, runbook, task, or explicit question context.
3. Do not invent missing facts. If source evidence is thin, contradictory, or outdated, stop and hand off to `study`, `research-online`, or the owning workflow.
4. Optimize for scan speed: concise prose first, visuals second, only the minimal supporting detail after that.
5. Use at least one strong visual when the subject is non-trivial. Prefer Mermaid, ASCII diagrams, and tables over binary images.
6. Choose the smallest visual surface that matches the question. Do not stack multiple diagram types unless each answers a different part of the explanation.
7. Keep explanation packets grounded in repository-relative file paths, concrete symbols, or named artifacts whenever they matter.
8. End with the clearest next downstream action when one exists; explanation alone is not implementation.

## Output Contract

Default user-facing packet:

1. `What This Is`
2. `Short Explanation`
3. `Visual Explanation`
4. `Key Files / Contracts`
5. `What To Do Next`

Visual packet defaults:

- Use one primary visual for the core explanation.
- Add one secondary table or mini-diagram only when it removes real ambiguity.
- Cap the usual packet at 1–2 visuals.

## Quick Commands

```bash
# Validate Mermaid diagrams in an explanation packet
npm run check:mermaid -- --files <explanation-packet.md>

# Check explanation completeness (12-item checklist)
npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --latest
npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --packet <path.md>
npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --latest --json

# Choose the best visual format
npx tsx .agents/skills/explain/scripts/choose-visual-format.ts --question <question>
```

## Workflow

1. **Normalize the explanation target.**
   - Identify the source artifact, the exact question being answered, and the likely downstream lane.
2. **Choose the packet shape.**
   - Use `references/visual-packet-patterns.md` to pick the visual form with the lowest cognitive load.
3. **Build the explanation packet from existing evidence only.**
   - Lead with 2–5 sentences of concise explanation.
   - Add the primary visual.
   - Add key file or contract pointers only where they improve actionability.
4. **Validate against the source.**
   - Check that every node, state, or table row maps cleanly back to known evidence.
   - Call out open uncertainties explicitly instead of smoothing them over.
5. **Hand off clearly.**
   - If the user is now ready to act, point to the owning downstream skill.
   - If the explanation surfaced new unknowns, escalate to `study` or `research-online`.

## Explanation Generation Template

Use this template when building an explanation packet. Fill in each section with specific content.

### Explanation Packet Structure

```markdown
# Explain: [Concise title answering the question]
**Source Artifact:** [Path to source plan/study/code/decision]
**Quality Tier:** [Minimal | Standard | Full]
**Question Answered:** [Exact question]

## What This Is
[2–5 sentences. Lead with the answer. Be concise.]

## Short Explanation
[Additional context only if needed for actionability.]

## Visual Explanation
[Primary visual: Mermaid diagram, ASCII art, or table]
[Secondary visual only if it removes real ambiguity]

## Key Files / Contracts
[Only if they improve actionability]
| File | What it does |
|------|-------------|
| `path/to/file` | Purpose |

## Open Questions
[Any uncertainties not resolved by the source]

## What To Do Next
[Next downstream action or skill]
- Ready to act → Route to [next skill]
- Need more evidence → Hand off to `study/SKILL.md`
- Need research → Hand off to `research-online/SKILL.md`
```

### Packet Shape Selection Guide

| Explanation Type | Recommended Shape | When to Add Second Visual |
|------------------|-------------------|--------------------------|
| Architecture flow | Flowchart (graph LR) | When branching paths exist |
| Component hierarchy | Tree (graph TD) | When nested relationships matter |
| State transitions | State diagram (stateDiagram-v2) | When states have actions |
| Data flow | Sequence (sequenceDiagram) | When order matters |
| Comparison | Table | When tradeoffs differ by dimension |
| Timeline | Gantt or timeline | When order + duration matters |
| Pure concept | Prose only | N/A (Minimal tier) |

### Reference Loading by Task Type

| Task type | Load these files | Skip |
|-----------|-----------------|------|
| Choosing a visual format | `references/visual-packet-patterns.md` | Agent prompt assets |
| Need a second opinion on a draft | `agents/clarity-auditor.md` | `visual-packet-patterns.md` |
| Uncertain which single visual is best | `agents/diagram-selector.md` | `visual-packet-patterns.md` |
| General packet structure guidance | `references/visual-packet-patterns.md` | Agent prompt assets |

Load only the subset the task needs.

## Cross-Skill Coordination

- `chooseable-options/SKILL.md` — use when the user needs a lower-cognitive-load explanation before selecting a lane.
- `decisions/SKILL.md` — use when option comparison exists but the user needs a condensed visual framing before choosing.
- `study/SKILL.md` — use when study findings are sound but too dense to act on quickly.
- `specs/SKILL.md` — use when a spec cluster needs a shared visual explanation before plan selection or batching.
- `plan/SKILL.md` — use after the explanation has made the execution path clear.
- `text-architecture` — use when diagram selection or format tradeoffs need deeper guidance.

## Handoff Outputs

**To `plan/SKILL.md`**
- Explanation target summary, clarified execution sequence or component map, remaining blockers or open questions.

**To `decisions/SKILL.md`**
- Clarified option framing, primary tradeoff diagram or comparison table, unresolved user choice still requiring explicit selection.

**To `study/SKILL.md`**
- Exact uncertainty that prevented a clean explanation, artifact paths that need deeper analysis.

**To `chooseable-options/SKILL.md`**
- Concise scenario summary, recommended next action after explanation, viable alternative lanes still visible.

**To downstream publication targets when explicitly requested**
- Final Mermaid or table content that should be published, any rendering or validation requirements for the target page.

## Common Pitfalls

1. **Starting without a source artifact.** The skill requires an existing plan, study, code path, or decision packet. If none exists, hand off to `planning` or `study` first.
2. **Over-visualizing.** Adding three or more diagrams to one packet slows scanning. Keep to 1–2 visuals and use tables for comparisons.
3. **Inventing file paths.** Only cite repository paths that have been verified against the actual codebase. Use symbols, not guesses.
4. **Skipping the "What To Do Next" step.** Explanation without a downstream action leaves the user stranded. Always end with the next skill or action.
5. **Using binary images instead of text diagrams.** Mermaid and ASCII diagrams are editable, searchable, and render reliably in more contexts than PNGs or screenshots.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Packet feels too long | Including too much detail from the source | Compress to 2–5 sentences of prose, 1 visual, and a file table. See `references/visual-packet-patterns.md` for scan-speed rules. |
| Unclear which visual to use | Missing classification of the explanation type | Consult `agents/diagram-selector.md` for a read-only recommendation. |
| User still confused after the packet | Explanation started with background instead of the direct answer | Lead with the shortest truthful answer sentence, then context. |
| Cannot ground claims in evidence | Source material is thin or contradictory | Stop and hand off to `study/SKILL.md` or `research-online/SKILL.md`. |
| Mermaid diagram breaks in a downstream renderer | Renderer support differs from GitHub markdown | Validate with `npm run check:mermaid -- --files <packet.md>` and simplify the diagram syntax. |

## Local Corpus Layout

The `references/` directory contains one hand-authored file and no subfolders:

- `references/visual-packet-patterns.md` — packet-shape chooser, diagram selection rules, scan-speed checks, file/contract inclusion heuristics.

The `agents/` directory contains two native Codex sub-agent prompts:

- `agents/diagram-selector.md` — read-only prompt for choosing the strongest single visual.
- `agents/clarity-auditor.md` — read-only prompt for pressure-testing scan speed and fidelity.
