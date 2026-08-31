#!/usr/bin/env npx tsx

/**
 * @fileoverview CLI entrypoint that scores explain HTML (or legacy markdown) artifacts against the
 * 12-item Explanation Quality Checklist and prints a human-readable or JSON deliverability report.
 *
 * This file owns argv parsing, latest-artifact discovery under `.tmp/explain/`, regex-backed
 * checklist heuristics, weighted scoring, and stdout/stderr reporting (including `process.exit` on
 * usage or read errors).
 * Flow: argv -> resolve packet path (`--packet <path>` | `--latest`) -> read HTML/markdown ->
 * evaluate checklist rows -> aggregate score and tier -> print report.
 *
 * @testing CLI: npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --latest
 * @testing CLI: npx tsx .agents/skills/explain/scripts/check-explanation-completeness.ts --packet <path-to-packet.md> [--json]
 *
 * @see skills/explain/SKILL.md - Canonical explain skill that defines HTML explanation page shape and checklist semantics this scanner enforces.
 * @see skills/explain/references/visual-packet-patterns.md - Visual packet pattern catalog referenced by checklist item heuristics in this script.
 * @see docs/TYPESCRIPT_STANDARDS_DOCUMENTATION_FILE_OVERVIEWS.md - File-overview documentation standard governing this module header contract.
 * @documentation reviewed=2026-05-22 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import { argv } from "process";

// ============================================================================
// Types
// ============================================================================

/**
 * One row of the Explanation Quality Checklist with scoring weight and heuristic pass/fail.
 *
 * @remarks
 * `checked` is filled after scanning the packet markdown; `weight` contributes to the numeric score.
 */
interface ChecklistItem {
  number: number;
  name: string;
  description: string;
  required: boolean;
  checked: boolean;
  weight: number;
}

/**
 * Header fields parsed from an explanation markdown packet for the completeness report.
 *
 * @remarks
 * `path` is assigned by the caller once the on-disk packet location is known.
 */
interface ExplanationMetadata {
  title: string;
  path: string;
  question: string;
  tier: string;
}

/**
 * Aggregated scan result: metadata, per-item checklist, scores, and deliverability gate.
 *
 * @remarks
 * `canDeliver` is true only when every required checklist item passes its heuristic.
 */
interface CompletenessReport {
  metadata: ExplanationMetadata;
  checklist: ChecklistItem[];
  score: number;
  maxScore: number;
  tier: string;
  canDeliver: boolean;
}

// ============================================================================
// Checklist Definition
// ============================================================================

const CHECKLIST_ITEMS: Omit<ChecklistItem, "checked">[] = [
  { number: 1, name: "Source artifact identified", description: "Explanation target has existing source", required: true, weight: 2 },
  { number: 2, name: "Target question clarified", description: "Exact question being answered is stated", required: true, weight: 2 },
  { number: 3, name: "Visuals chosen", description: "Diagram types selected for full understanding", required: true, weight: 1 },
  { number: 4, name: "Answer-first prose", description: "HTML leads with a direct answer", required: true, weight: 2 },
  { number: 5, name: "HTML visuals present", description: "At least one diagram, table, or SVG for a thorough page", required: true, weight: 2 },
  { number: 6, name: "Diagrams wired to render", description: "Mermaid blocks use pre.mermaid and mermaid.js, or no mermaid is used", required: true, weight: 1 },
  { number: 7, name: "File pointers contextual", description: "Only included when they improve actionability", required: false, weight: 1 },
  { number: 8, name: "Evidence grounded", description: "Every claim maps to source artifact", required: true, weight: 2 },
  { number: 9, name: "Uncertainties called out", description: "Open questions explicitly stated", required: false, weight: 1 },
  { number: 10, name: "What To Do Next included", description: "Clear downstream action or next skill", required: true, weight: 2 },
  { number: 11, name: "HTML written to disk", description: "Artifact is an .html page under .tmp/explain/", required: true, weight: 2 },
  { number: 12, name: "Standalone HTML page", description: "Minimal HTML document with doctype, html, body", required: true, weight: 1 },
];

// ============================================================================
// Parser
// ============================================================================

/**
 * Extracts title, answered-question line, and inferred quality tier from raw markdown.
 *
 * @remarks
 * Uses heading and bold-line regexes; supplies defaults when expected patterns are missing.
 */
function extractMetadata(content: string): ExplanationMetadata {
  const titleMatch =
    content.match(/<title>\s*([^<]+?)\s*<\/title>/i) ||
    content.match(/<h1[^>]*>\s*(?:Explain:\s*)?([^<]+?)\s*<\/h1>/i) ||
    content.match(/^#\s*Explain:\s*(.+)/m);
  const questionMatch =
    content.match(/<strong>Question:<\/strong>\s*([^<]+)/i) ||
    content.match(/\*\*Question Answered:\*\*\s*(.+)/mi);
  
  return {
    title: titleMatch?.[1]?.trim() || "Untitled Explanation",
    path: "unknown",
    question: questionMatch?.[1]?.trim() || "Unknown question",
    tier: guessTier(content),
  };
}

/**
 * Estimates packet depth tier (Minimal, Standard, or Full) from length and structural cues.
 *
 * @remarks
 * Heuristic only: word count plus presence of visuals and next-step sections.
 */
function guessTier(content: string): string {
  const wordCount = content.split(/\s+/).length;
  const hasVisual = hasVisualSupport(content);
  const hasNextStep = /What To Do Next|NEXT STEPS/i.test(content);
  
  if (wordCount > 500 && hasVisual && hasNextStep) return "Full";
  if (wordCount > 200 && hasVisual) return "Standard";
  return "Minimal";
}

/**
 * Whether the artifact includes at least one diagram, table, or SVG representation.
 */
function hasVisualSupport(content: string): boolean {
  return /class=["']mermaid["']|```mermaid|<svg[\s>]|<table\b|\n\|.+\|.+\|/i.test(content);
}

/**
 * Whether the packet content satisfies the checklist criterion for `item.number`.
 *
 * @remarks
 * Each branch applies lightweight regex heuristics aligned with the explain checklist.
 */
function checkItem(content: string, item: Omit<ChecklistItem, "checked">): boolean {
  switch (item.number) {
    case 1: return /\.plans\/|\.studies\/|plan-|study-|decision-|spec-|source.*artifact/i.test(content);
    case 2: return /question|answered|what this is/i.test(content);
    case 3: return hasVisualSupport(content) || /visual.*packet|shape|pattern|references\//i.test(content);
    case 4: return /<h1\b|^#\s+/m.test(content);
    case 5: return hasVisualSupport(content);
    case 6: {
      const hasMermaidBlock = /```mermaid|<pre[^>]*class=["']mermaid["']/.test(content);
      if (!hasMermaidBlock) return true;
      return /mermaid\.esm\.min\.mjs|mermaid\.initialize/.test(content);
    }
    case 7: return true; // Optional - pass if not checked, it's conditional
    case 8: return /\/\/|\.ts|\.md|\.json|path|file/i.test(content);
    case 9: return /uncertainty|open.*question|unknown|gap/i.test(content) || item.required === false;
    case 10: return /What To Do Next|NEXT STEPS|next.*action/i.test(content);
    case 11: return false; // filled by checkItemWithPath
    case 12: return /<!DOCTYPE html>/i.test(content) && /<html[\s>]/.test(content) && /<body[\s>]/.test(content);
    default: return false;
  }
}

// ============================================================================
// Main
// ============================================================================

/**
 * Resolves the newest explanation HTML (preferred) or markdown under `.tmp/explain/`.
 *
 * @remarks
 * I/O: reads directories under `.tmp/explain`, picks the last sorted subfolder, then
 * `explain.html`, any `.html`, or a non-README `.md`.
 */
function findLatestExplanation(): string | null {
  try {
    const tmpDir = ".tmp/explain";
    if (!existsSync(tmpDir)) return null;
    
    const dirs = readdirSync(tmpDir)
      .filter(d => statSync(join(tmpDir, d)).isDirectory())
      .sort()
      .reverse();
    
    for (const dir of dirs) {
      const files = readdirSync(join(tmpDir, dir));
      if (files.includes("explain.html")) {
        return join(tmpDir, dir, "explain.html");
      }
      const html = files.find(f => f.endsWith(".html"));
      if (html) {
        return join(tmpDir, dir, html);
      }
      const markdown = files.find(f => f.endsWith(".md") && !f.includes("README"));
      if (markdown) {
        return join(tmpDir, dir, markdown);
      }
    }
  } catch {
    return null;
  }
  return null;
}

function checkItemWithPath(
  content: string,
  packetPath: string,
  item: Omit<ChecklistItem, "checked">,
): boolean {
  if (item.number === 11) {
    return packetPath.endsWith(".html");
  }
  return checkItem(content, item);
}

/**
 * Loads a packet, scores checklist coverage, and prints JSON or a human-readable report.
 *
 * @remarks
 * I/O: synchronous read of `packetPath`; writes to stdout/stderr and may `process.exit(1)` on failure.
 */
function checkExplanation(packetPath: string, json: boolean = false): void {
  try {
    const content = readFileSync(packetPath, "utf-8");
    const metadata = extractMetadata(content);
    metadata.path = packetPath;
    
    const checklist = CHECKLIST_ITEMS.map(item => ({
      ...item,
      checked: checkItemWithPath(content, packetPath, item),
    }));
    
    const score = checklist.reduce((sum, item) => 
      item.checked ? sum + item.weight : sum, 0);
    const maxScore = checklist.reduce((sum, item) => sum + item.weight, 0);
    
    const requiredItems = checklist.filter(i => i.required);
    const requiredScore = requiredItems.reduce((sum, item) => 
      item.checked ? sum + item.weight : sum, 0);
    const requiredMax = requiredItems.reduce((sum, item) => sum + item.weight, 0);
    
    const canDeliver = requiredScore === requiredMax;
    
    const tier = score >= 16 ? "Full" : score >= 10 ? "Standard" : "Minimal";

    const report: CompletenessReport = {
      metadata,
      checklist,
      score,
      maxScore,
      tier,
      canDeliver,
    };

    if (json) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    // Human-readable output
    console.log("\n📋 Explanation Completeness Report");
    console.log("═".repeat(60));
    console.log(`\n📄 ${metadata.title}`);
    console.log(`   Question: ${metadata.question}`);
    console.log(`   Path: ${packetPath}`);
    
    console.log(`\n📊 Score: ${score}/${maxScore} (${((score/maxScore)*100).toFixed(0)}%)`);
    console.log(`   Required items: ${requiredScore}/${requiredMax}`);
    console.log(`   Quality tier: ${tier}`);
    
    console.log(`\n${canDeliver ? "✅" : "⚠️"} Deliverable: ${canDeliver ? "YES" : "NEEDS WORK"}`);
    
    console.log("\n📝 Checklist:");
    for (const item of checklist) {
      const icon = item.checked ? "✅" : item.required ? "❌" : "⚠️";
      console.log(`   ${icon} [${item.number}] ${item.name}`);
    }
    
    console.log("\n" + "═".repeat(60));
    
    if (!canDeliver) {
      console.log("\n⚠️ Explanation needs work before delivery.");
      const failedItems = checklist.filter(i => !i.checked && i.required);
      if (failedItems.length > 0) {
        console.log("\nMissing required items:");
        failedItems.forEach(i => console.log(`   - ${i.name}`));
      }
    } else {
      console.log("\n✅ Explanation is complete and ready to deliver.");
    }
    
  } catch (error) {
    console.error(`\n❌ Error reading explanation packet: ${packetPath}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// CLI
const args = argv.slice(2);
const packetArg = args.find(a => a === "--packet" || a === "-p");
const latestArg = args.includes("--latest");
const jsonArg = args.includes("--json");

if (!packetArg && !latestArg) {
  console.log("Usage: check-explanation-completeness.ts --packet <path> | --latest [--json]");
  console.log("\nExamples:");
  console.log("  npx tsx check-explanation-completeness.ts --packet .tmp/explain/2026-05-19-test/explain.html");
  console.log("  npx tsx check-explanation-completeness.ts --latest");
  console.log("  npx tsx check-explanation-completeness.ts --latest --json");
  process.exit(1);
}

let packetPath: string | null = null;

if (latestArg) {
  packetPath = findLatestExplanation();
  if (!packetPath) {
    console.error("❌ No explanation packet found in .tmp/explain/ directory.");
    process.exit(1);
  }
  console.log(`📍 Using latest explanation: ${packetPath}`);
} else if (packetArg) {
  const packetIndex = args.indexOf(packetArg);
  packetPath = args[packetIndex + 1];
  if (!packetPath) {
    console.error("❌ Missing packet path after --packet");
    process.exit(1);
  }
}

checkExplanation(packetPath!, jsonArg);
