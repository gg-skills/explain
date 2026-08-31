---
name: explain
description: when configuring explain, summarize, or make plans, studies, specs, decisions, or code flows easier to understand. Brief in chat; thorough HTML with diagrams. Handoff explanations before decisions. MCP-compatible. Not for unexplained code.
---

# GG → Explain → Technical Narratives

> **Snapshot age:** This is a hand-authored skill with no captured corpus. Reference content is maintained manually.

## Overview

Use this skill to translate existing local evidence into two surfaces: a **brief explanation in chat**, and a **thorough standalone HTML page** with every diagram and representation needed to fully understand the subject. It does not do new research or planning; it turns a known plan, study, spec cluster, decision set, architecture path, or code flow into those two surfaces.

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

## Common Misconceptions

| # | Misconception | Correction | Key concept |
|---|---------------|------------|-------------|
| 1 | This skill performs research or planning. | It only translates and presents existing evidence. | Translation layer |
| 2 | The chat reply should contain the full explanation. | Chat is the brief answer. The thorough version is the HTML page. | Two surfaces |
| 3 | One or two visuals is a cap for the HTML page. | The HTML page includes every diagram and representation needed to fully understand. | Visual completeness |
| 4 | Code pointers are always useful. | Skip file tables when the explanation is purely conceptual. | Contextual inclusion |
| 5 | This skill can invent missing facts. | Stop and hand off to `study` or `research-online` when evidence is thin. | Evidence grounded |
| 6 | Explanations can start with background. | Lead with the shortest truthful answer sentence. | Answer-first |
| 7 | The thorough explanation can stay in markdown-only chat. | Write a minimal HTML page and return its absolute path. | HTML artifact |
| 8 | Explanations without next steps are acceptable. | Always end with the next downstream action. | Actionable handoff |

## Guidance Alignment

- Apply repository guidance consistently with `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`.
- Prefer existing local evidence, repo artifacts, and code references over fresh discovery.
- If diagram-format selection needs deeper guidance, use `text-architecture` and `references/visual-packet-patterns.md`.
- When native Codex sub-agents are available, use the skill-local prompt assets under `agents/`:
  - `diagram-selector.md` to choose the visuals the HTML page needs,
  - `clarity-auditor.md` to pressure-test chat brevity and HTML fidelity before finalizing.
- If current external facts are missing, hand off to `research-online/SKILL.md` instead of guessing.

## Explanation Quality Checklist

Use this checklist before delivering. Each required item is a gate.

| # | Checklist Item | Why It Matters | Gate |
|---|---------------|---------------|------|
| 1 | **Source artifact identified** — Explanation target has an existing source (plan/study/code/decision) | Enables evidence grounding | Pre-draft |
| 2 | **Target question clarified** — Exact question being answered is stated | Prevents scope creep | Pre-draft |
| 3 | **Visuals chosen** — Diagram types selected from `visual-packet-patterns.md` for full understanding | Ensures the HTML can teach the subject | Draft |
| 4 | **Chat is brief** — 2–5 sentences, answer-first, no thorough dump | Enables fast scanning in conversation | Draft |
| 5 | **HTML is thorough** — Full explanation with every needed diagram, table, or other representation | Enables full understanding | Draft |
| 6 | **Diagrams render in the page** — Mermaid (or SVG/tables) actually display when the HTML is opened | Prevents broken visuals | Draft |
| 7 | **File pointers contextual** — Only included when they improve actionability | Avoids noise | Draft |
| 8 | **Evidence grounded** — Every claim maps to source artifact | Prevents speculation | Draft |
| 9 | **Uncertainties called out** — Open questions explicitly stated | Honest communication | Draft |
| 10 | **What To Do Next included** — Clear downstream action or next skill | Prevents user stranded | Closeout |
| 11 | **HTML written to disk** — `.tmp/explain/YYYY-MM-DD-{subject}/explain.html` | Durable thorough artifact | Closeout |
| 12 | **Absolute path returned** — Chat reports the HTML file's absolute path | User can open the thorough version | Closeout |

### Quality Tiers

| Tier | Criteria | Use When |
|------|----------|----------|
| **Minimal** | Items 1–4, 10–12 | Tiny conceptual subject; HTML may be short but still a page |
| **Standard** | Items 1–8, 10–12 | Typical explanation with diagrams in HTML |
| **Full** | All 12 items | Complex subject needing several representations |

### Pre-Delivery Verification

```
□ Source artifact identified and referenced
□ Target question is clear and scoped
□ Chat: 2–5 sentence answer-first brief
□ HTML: full explanation with all needed visuals
□ Diagrams render in the HTML page
□ File pointers only when actionable
□ All claims grounded in evidence
□ Uncertainties explicitly called out
□ What To Do Next included
□ HTML written under .tmp/explain/
□ Chat reports the absolute path to that HTML file
```

## Explanation Consistency Validator

Before delivering, run these consistency checks. A result that fails any check must be fixed first.

### Consistency Check Matrix

| Check | What to Verify | How to Fix |
|-------|---------------|------------|
| **Chat vs HTML** | Chat is a true brief of the HTML, not a second incomplete explanation | Align the brief to the HTML answer |
| **Prose vs Visual** | HTML visuals reflect claims made in prose | Update visual or prose |
| **Claims vs Source** | Every claim maps to source artifact | Add citation or remove claim |
| **Visual vs Understanding** | Opening the HTML is enough to fully understand | Add the missing diagram or representation |
| **Files vs Actionability** | File paths are verified and relevant | Remove unverified paths |
| **Next Step vs Downstream** | Next action routes to correct skill | Verify routing |
| **Uncertainties vs Evidence** | Gaps are acknowledged, not smoothed | Add explicit uncertainty callout |

### Red Flags (Never Present)

- [ ] Claim not grounded in source evidence
- [ ] Unverified file path cited
- [ ] Thorough explanation dumped into chat instead of HTML
- [ ] No HTML file written
- [ ] Chat missing the absolute path to the HTML page
- [ ] HTML has no visual support for a non-trivial subject
- [ ] No "What To Do Next"

## Non-Negotiable Policy

1. Use this as a translation and presentation layer, not as a research or planning workflow.
2. Start from an existing source surface: code, plan, study, spec set, decision packet, runbook, task, or explicit question context.
3. Do not invent missing facts. If source evidence is thin, contradictory, or outdated, stop and hand off to `study`, `research-online`, or the owning workflow.
4. Always deliver **both** surfaces: a brief chat explanation, and a thorough HTML page. The thorough version lives only on disk.
5. The HTML page is a **minimal standalone document** with all visual support necessary to fully understand (diagrams, tables, journeys, structure views). Include every representation that removes real ambiguity. Do not cap the HTML at one or two visuals.
6. Chat stays brief: 2–5 sentences, answer-first. Do not paste the HTML contents into chat.
7. Keep explanations grounded in repository-relative file paths, concrete symbols, or named artifacts whenever they matter.
8. End with the clearest next downstream action when one exists; explanation alone is not implementation. Present those next actions per `chooseable-options/SKILL.md` (printed tokens **and** native Ask User picker when available).

## Output Contract

Always both:

1. **Chat (brief).** 2–5 sentences answering the question. Then the absolute path to the HTML page. Then What To Do Next.
2. **HTML page (thorough).** Write `.tmp/explain/YYYY-MM-DD-{subject}/explain.html`. Report that file's **absolute path**.

### Chat shape

```text
[2–5 sentence answer. Lead with the direct answer.]

Thorough explanation: /absolute/path/to/.tmp/explain/YYYY-MM-DD-{subject}/explain.html
What to do next: [next downstream action or skill]
```

Present the path as a clickable `file://` URL when the harness supports it, still using the absolute filesystem path.

### HTML page contract

Write a **minimal** HTML document. Not an app: no navigation chrome, no framework, no extra pages.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Explain: [question]</title>
  <style>
    body { max-width: 52rem; margin: 2rem auto; padding: 0 1rem; font: 16px/1.5 system-ui, sans-serif; }
    pre.mermaid { background: #f6f8fa; padding: 1rem; overflow: auto; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 0.4rem 0.6rem; text-align: left; }
    code { font-family: ui-monospace, monospace; }
  </style>
</head>
<body>
  <!-- full explanation + all diagrams/tables/other representations -->
  <script type="module">
    import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    mermaid.initialize({ startOnLoad: true, theme: "neutral" });
  </script>
</body>
</html>
```

HTML content requirements:

- Title and the question answered.
- Full explanation: what this is, how it works, important edge cases, key files/contracts when they matter, open questions, next step.
- **All visual support necessary to fully understand.** Use as many of these as the subject needs: Mermaid flow/sequence/state/class diagrams (`<pre class="mermaid">…</pre>`), comparison tables, ASCII or inline SVG when they communicate better. One visual is not a cap.
- Evidence-grounded. Cite source artifacts. Do not invent nodes, files, or behavior.
- Prefer Mermaid that renders in the page over binary images. PNG/screenshots only when no text diagram can show the thing.

Choose visual types from `references/visual-packet-patterns.md`. Put several on the page when each answers a different part of the explanation.

## Quick Commands

```bash
# Check explanation completeness (12-item checklist; prefers latest HTML under .tmp/explain/)
npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --latest
npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --packet <path.html>
npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --latest --json

# Choose visual formats for the HTML page
npx tsx .agents/skills/explain/scripts/choose-visual-format.ts --question <question>
```

## Workflow

1. **Normalize the explanation target.**
   - Identify the source artifact, the exact question being answered, and the likely downstream lane.
2. **Choose the visuals the HTML needs.**
   - Use `references/visual-packet-patterns.md`. Include every representation required for full understanding.
3. **Write the thorough HTML page** under `.tmp/explain/YYYY-MM-DD-{subject}/explain.html`.
   - Full prose plus all diagrams/tables/other representations.
   - Follow the HTML page contract above.
4. **Validate against the source.**
   - Every node, state, or table row maps to known evidence.
   - Call out open uncertainties instead of smoothing them over.
5. **Deliver the brief in chat** plus the HTML file's **absolute path** plus What To Do Next.
   - If the user is ready to act, point to the owning downstream skill.
   - If the explanation surfaced new unknowns, escalate to `study` or `research-online`.

## Explanation Generation Template

### Chat

```text
[2–5 sentences. Lead with the answer.]

Thorough explanation: /absolute/path/to/.tmp/explain/YYYY-MM-DD-{subject}/explain.html
What to do next: [next skill or action]
```

### HTML page sections

```html
<h1>Explain: [Concise title answering the question]</h1>
<p><strong>Source:</strong> [path] · <strong>Question:</strong> [exact question]</p>

<h2>What This Is</h2>
<p>[Direct answer, then enough context to orient.]</p>

<h2>How It Works</h2>
<p>[Thorough narrative.]</p>
<pre class="mermaid">…</pre>
<!-- more diagrams/tables/SVG as needed -->

<h2>Key Files / Contracts</h2>
<!-- omit when purely conceptual -->

<h2>Open Questions</h2>
<!-- omit when none -->

<h2>What To Do Next</h2>
```

### Visual selection (for the HTML page)

| Explanation Type | Recommended visual | Add more when |
|------------------|-------------------|----------------|
| Architecture flow | Flowchart (graph TD/LR) | Branching paths, layers, error paths |
| Component hierarchy | Tree (graph TD) | Nested ownership or module bounds |
| State transitions | State diagram (stateDiagram-v2) | Guards, side effects, illegal transitions |
| Data / request flow | Sequence (sequenceDiagram) | Extra actors, retries, async |
| Comparison | Table | Extra dimensions or options |
| Timeline | Gantt or timeline | Parallel tracks |
| User journey | ASCII or flowchart | Failure and recovery paths |
| Data model | classDiagram / erDiagram | When structure is the question |

### Reference Loading by Task Type

| Task type | Load these files | Skip |
|-----------|-----------------|------|
| Choosing visuals for the HTML page | `references/visual-packet-patterns.md` | Agent prompt assets |
| Need a second opinion on a draft | `agents/clarity-auditor.md` | `visual-packet-patterns.md` |
| Uncertain which visuals the page needs | `agents/diagram-selector.md` | `visual-packet-patterns.md` |

Load only the subset the task needs.

## Cross-Skill Coordination

- `chooseable-options/SKILL.md` — present What To Do Next as printed tokens plus the harness Ask User picker when that tool is available.
- `decisions/SKILL.md` — use when option comparison exists but the user needs a condensed visual framing before choosing.
- `study/SKILL.md` — use when study findings are sound but too dense to act on quickly.
- `specs/SKILL.md` — use when a spec cluster needs a shared visual explanation before plan selection or batching.
- `plan/SKILL.md` — use after the explanation has made the execution path clear.
- `text-architecture` — use when diagram selection or format tradeoffs need deeper guidance.

## Handoff Outputs

**To `plan/SKILL.md`**
- Brief summary, absolute path to the HTML page, remaining blockers or open questions.

**To `decisions/SKILL.md`**
- Clarified option framing, absolute path to the HTML page (diagrams live there), unresolved user choice still requiring explicit selection.

**To `study/SKILL.md`**
- Exact uncertainty that prevented a clean explanation, artifact paths that need deeper analysis.

**To `chooseable-options/SKILL.md`**
- Concise scenario summary, recommended next action after explanation, viable alternative lanes still visible.

## Common Pitfalls

1. **Starting without a source artifact.** The skill requires an existing plan, study, code path, or decision packet. If none exists, hand off to `planning` or `study` first.
2. **Dumping the thorough explanation into chat.** Chat is the brief. The HTML page is the thorough version.
3. **Skipping diagrams on a non-trivial subject.** If a flow, state machine, or comparison is the thing being explained, the HTML page must show it.
4. **Inventing file paths.** Only cite repository paths that have been verified against the actual codebase.
5. **Skipping the "What To Do Next" step.** Always end with the next skill or action.
6. **Forgetting to return the absolute path.** The user cannot open the thorough version without it.
7. **Building an app instead of a page.** No routers, component frameworks, or extra assets. One HTML file.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| User still confused after the chat brief | They have not opened the HTML page, or the page is missing a needed diagram | Confirm the absolute path; add the missing visual to the HTML |
| Chat is a wall of prose | Thorough content was inlined | Move it into the HTML page; leave 2–5 sentences in chat |
| Diagrams blank in the browser | Mermaid not in `<pre class="mermaid">` or mermaid.js missing | Follow the HTML page contract |
| Cannot ground claims in evidence | Source material is thin or contradictory | Stop and hand off to `study/SKILL.md` or `research-online/SKILL.md`. |
| Unclear which visuals to include | Missing classification of the explanation type | Consult `agents/diagram-selector.md` and `references/visual-packet-patterns.md`. |

## Temporary Files

Write the HTML page under `.tmp/explain/YYYY-MM-DD-{subject}/explain.html`. The root `.tmp/` directory is already gitignored. Do not create top-level dotfile temp directories. Do not save inside the skill folder.

## Local Corpus Layout

The `references/` directory contains one hand-authored file and no subfolders:

- `references/visual-packet-patterns.md` — visual-type chooser and when to include files/contracts.

The `agents/` directory contains two native Codex sub-agent prompts:

- `agents/diagram-selector.md` — read-only prompt for choosing the visuals the HTML page needs.
- `agents/clarity-auditor.md` — read-only prompt for pressure-testing chat brevity and HTML fidelity.
