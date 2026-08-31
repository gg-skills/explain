# Visual Packet Patterns

Chat vs HTML placement is owned by `SKILL.md` (Output Contract). This file owns **which visual types to use**. Put those visuals on the HTML page. Include every type that the subject needs for full understanding.

## Visual Type Selection

| Question Shape | Primary Visual | Use When | Avoid When |
| --- | --- | --- | --- |
| What happens step by step? | Mermaid `flowchart TD` | the explanation is about process flow, staged orchestration, or handoffs | the real question is timing between actors rather than step order |
| Who talks to whom and in what order? | Mermaid `sequenceDiagram` | actor-to-actor exchanges or request/response order matters | the explanation is mostly branching logic or state |
| How does this thing change over time? | Mermaid `stateDiagram-v2` | the subject is lifecycle, mode changes, or transition guards | the explanation is linear and does not involve true state |
| How do options differ? | comparison matrix table | the question is tradeoff-heavy and the user must compare paths quickly | the question is causal flow rather than side-by-side comparison |
| What does the user experience? | ASCII user journey | terminal readability matters more than rendered diagrams | system internals are the real focus |
| Which files or contracts matter? | key-files table plus optional mini-flowchart | the user needs concrete starting points in the repo | the explanation is conceptual and not yet tied to code |
| How are types or records related? | Mermaid `classDiagram` or `erDiagram` | structure, ownership, or cardinality is the question | the question is runtime behavior |
| When do phases happen? | Mermaid `gantt` or timeline | order plus duration matters | the question is a single instant |

Use more than one of these on the HTML page when each answers a different part of the question (for example a flowchart plus a sequence diagram plus a file table).

## Diagram Craft

1. Quote Mermaid labels when they contain punctuation or multiple words: `A["Question or label"]`.
2. Default to vertical diagrams (`TD`) unless horizontal causality is materially clearer.
3. Split wide diagrams into stacked subgraphs or additional diagrams instead of shrinking one large diagram.
4. Prefer tables when the user is choosing among options, responsibilities, or phases.
5. Every node, edge, and table row must map to source evidence.

## File and Contract Inclusion Heuristics

Include `Key Files / Contracts` on the HTML page when any of these are true:

- the user is likely to act on the explanation immediately,
- the explanation depends on a specific source file, route, or contract boundary,
- the next downstream skill needs exact starting points.

Skip file tables when the explanation is purely conceptual and code pointers would distract from the
main idea.
