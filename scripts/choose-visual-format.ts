#!/usr/bin/env npx tsx

/**
 * @fileoverview CLI entrypoint that recommends Mermaid diagram starters and ASCII fallbacks for
 * explain explanation packets from `--question` keyword heuristics or an explicit `--type` slug.
 *
 * This file owns the static visual-format matrix, coarse `detectType` routing, argv parsing, and
 * stdout-only guidance (including `--help` with `process.exit(0)`).
 * Flow: argv -> (`--question` -> detectType | `--type` value) -> getRecommendedFormats -> print
 * labeled rows with when/avoid heuristics and copy/paste examples.
 *
 * @testing CLI: npx tsx .agents/skills/explain/scripts/choose-visual-format.ts --help
 * @testing CLI: npx tsx .agents/skills/explain/scripts/choose-visual-format.ts --type flow
 * @testing CLI: npx tsx .agents/skills/explain/scripts/choose-visual-format.ts --question "How does the auth flow work?"
 *
 * @see skills/explain/SKILL.md - Canonical explain skill that documents this helper when authors need a quick visual-format pick before drafting packet diagrams.
 * @see skills/explain/references/visual-packet-patterns.md - Pattern reference whose packet-shape heuristics align with the Mermaid and ASCII options listed in this script's matrix.
 * @see docs/TYPESCRIPT_STANDARDS_DOCUMENTATION_FILE_OVERVIEWS.md - File-overview documentation standard governing this module header contract.
 * @documentation reviewed=2026-05-22 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */

import { argv } from "process";

// ============================================================================
// Visual Format Matrix
// ============================================================================

/**
 * One row in the visual-format recommendation matrix.
 *
 * @remarks
 * Each entry pairs a human label with Mermaid starter syntax (when applicable), usage heuristics,
 * and a minimal example body for copy/paste.
 */
interface VisualFormat {
  name: string;
  mermaid: string;
  when: string;
  avoid: string;
  example: string;
}

const VISUAL_FORMATS: VisualFormat[] = [
  {
    name: "Flowchart (LR)",
    mermaid: "graph LR",
    when: "Linear or branching processes, decision trees",
    avoid: "Complex hierarchies, state transitions",
    example: "graph LR\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Do X]\n    B -->|No| D[Do Y]"
  },
  {
    name: "Flowchart (TD)",
    mermaid: "graph TD",
    when: "Top-down processes, layered architectures",
    avoid: "Wide branching paths",
    example: "graph TD\n    A[Top Layer] --> B[Middle Layer]\n    B --> C[Bottom Layer]\n    B --> D[Alt Bottom]"
  },
  {
    name: "State Diagram",
    mermaid: "stateDiagram-v2",
    when: "State machines, mode transitions, lifecycle stages",
    avoid: "Simple linear flows",
    example: "stateDiagram-v2\n    [*] --> Idle\n    Idle --> Active: doAction\n    Active --> Idle: complete"
  },
  {
    name: "Sequence Diagram",
    mermaid: "sequenceDiagram",
    when: "Request/response flows, API calls, message passing",
    avoid: "Static relationships",
    example: "sequenceDiagram\n    A->>B: Request\n    B-->>A: Response"
  },
  {
    name: "Class/Entity Diagram",
    mermaid: "classDiagram",
    when: "Class hierarchies, data models, entity relationships",
    avoid: "Behavioral flows",
    example: "classDiagram\n    class Animal\n    class Dog\n    Dog --|> Animal"
  },
  {
    name: "ER Diagram",
    mermaid: "erDiagram",
    when: "Database schemas, entity relationships with cardinality",
    avoid: "Behavioral processes",
    example: "erDiagram\n    CUSTOMER ||--o{ ORDER : places"
  },
  {
    name: "Pie/Bar Chart",
    mermaid: "pie",
    when: "Proportional distributions, composition breakdowns",
    avoid: "Time series, relationships",
    example: "pie \"Dogs\" : 30\n    pie \"Cats\" : 20"
  },
  {
    name: "Gantt Chart",
    mermaid: "gantt",
    when: "Project timelines, phase durations, scheduling",
    avoid: "Static relationships",
    example: "gantt\n    title Project\n    section Phase 1\n    Task1: 2024-01, 30d"
  },
  {
    name: "ASCII Table",
    mermaid: "",
    when: "Comparisons, option comparisons, feature matrices",
    avoid: "Relationships, flows",
    example: "| Feature | Option A | Option B |\n|----------|----------|----------|\n| Cost | Low | High |"
  },
  {
    name: "ASCII Diagram",
    mermaid: "",
    when: "Box diagrams, simple layouts, fallback when Mermaid unavailable",
    avoid: "Complex relationships",
    example: "+---+\n| A +---+\n+---+    |\n         v\n       +---+\n       | B |\n       +---+"
  },
];

// ============================================================================
// Detection Logic
// ============================================================================

/**
 * Maps a free-text question to a coarse explanation-type label for format routing.
 *
 * @remarks
 * PURITY: keyword heuristics only; the first matching branch wins.
 *
 * @param question - Natural-language prompt scanned case-insensitively for domain cues.
 * @returns Type slug passed to `getRecommendedFormats` (`concept` when no cue matches).
 */
function detectType(question: string): string {
  const q = question.toLowerCase();
  
  if (q.match(/state|mode|lifecycle|transition|status|stage/)) {
    return "state";
  }
  if (q.match(/flow|process|pipeline|step|sequence|order/)) {
    return "flow";
  }
  if (q.match(/component|module|service|class|entity|model|schema/)) {
    return "component";
  }
  if (q.match(/compare|versus|vs|tradeoff|pros? ?cons?|difference|option/)) {
    return "comparison";
  }
  if (q.match(/timeline|schedule|phase|duration|when|start|end/)) {
    return "timeline";
  }
  if (q.match(/api|call|request|response|message|event/)) {
    return "sequence";
  }
  
  return "concept";
}

/**
 * Selects matrix rows to surface for a given explanation type.
 *
 * @remarks
 * Filters `VISUAL_FORMATS` by substring matches on display names (for example Flowchart vs State).
 *
 * @param type - Explicit `--type` value or output of `detectType`; unrecognized values use the default branch.
 * @returns Ordered subset of the full matrix appropriate to the type.
 */
function getRecommendedFormats(type: string): VisualFormat[] {
  switch (type) {
    case "state":
      return VISUAL_FORMATS.filter(f => f.name.includes("State"));
    case "flow":
      return VISUAL_FORMATS.filter(f => f.name.includes("Flowchart"));
    case "component":
      return VISUAL_FORMATS.filter(f => 
        f.name.includes("Class") || f.name.includes("ER"));
    case "sequence":
      return VISUAL_FORMATS.filter(f => f.name.includes("Sequence"));
    case "comparison":
      return VISUAL_FORMATS.filter(f => 
        f.name.includes("Table") || f.name.includes("Pie"));
    case "timeline":
      return VISUAL_FORMATS.filter(f => f.name.includes("Gantt"));
    default:
      return VISUAL_FORMATS.filter(f => f.name.includes("ASCII Diagram"));
  }
}

// ============================================================================
// Main
// ============================================================================

/**
 * Parses CLI flags, optionally infers type from `--question`, and prints recommendations.
 *
 * @remarks
 * I/O: reads `process.argv`, writes help or formatted guidance to stdout, and may `process.exit(0)` after help.
 */
function main() {
  const args = argv.slice(2);
  const questionArg = args.find(a => a === "--question" || a === "-q");
  const typeArg = args.find(a => a === "--type" || a === "-t");
  const helpArg = args.includes("--help");
  
  if (helpArg || (!questionArg && !typeArg)) {
    console.log(`
📊 Visual Format Selector

Choose the optimal visual format for an explanation packet.

Usage:
  npx tsx choose-visual-format.ts --question <question>
  npx tsx choose-visual-format.ts --type <type>

Examples:
  npx tsx choose-visual-format.ts --question "How does the auth flow work?"
  npx tsx choose-visual-format.ts --type flow

Types:
  flow       - Linear or branching processes
  state      - State machines or transitions
  component  - Class hierarchies or entities
  sequence   - Request/response flows
  comparison - Option comparisons
  timeline   - Project timelines
  concept    - Simple concepts (ASCII fallback)
`);
    process.exit(0);
  }
  
  let type: string;
  
  if (questionArg) {
    const questionIndex = args.indexOf(questionArg);
    const question = args[questionIndex + 1] || "";
    type = detectType(question);
    console.log(`\n🔍 Detected type: ${type}`);
    console.log(`   Question: "${question}"`);
  } else {
    const typeIndex = args.indexOf(typeArg);
    type = args[typeIndex + 1] || "concept";
  }
  
  const recommended = getRecommendedFormats(type);
  
  console.log(`\n📊 Recommended Visual Formats for ${type}:`);
  console.log("═".repeat(60));
  
  for (const format of recommended) {
    console.log(`\n**${format.name}**`);
    console.log(`   Mermaid: \`\`\`${format.mermaid}\`\`\``);
    console.log(`   Use when: ${format.when}`);
    console.log(`   Avoid when: ${format.avoid}`);
    if (format.mermaid) {
      console.log(`\n   Example:\n   \`\`\`${format.mermaid}`);
      console.log(`   ${format.example.split('\n').slice(1).join('\n   ')}`);
      console.log(`   \`\`\``);
    } else {
      console.log(`\n   Example:\n   ${format.example}`);
    }
  }
  
  console.log("\n" + "═".repeat(60));
  console.log("\n💡 Tip: Use 'graph LR' or 'graph TD' for most flows.");
  console.log("💡 Use ASCII diagrams as fallback when Mermaid renders poorly.");
}

main();
