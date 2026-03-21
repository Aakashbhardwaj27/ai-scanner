#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// use-as-library.js
// Use ai-scanner programmatically in your own Node.js scripts
//
// Usage:
//   node use-as-library.js /path/to/project
// ─────────────────────────────────────────────────────────────

const { Scanner } = require("../lib/scanner");

const targetDir = process.argv[2] || ".";

// ── Basic scan ───────────────────────────────────────────────
const scanner = new Scanner({
  rootDir: targetDir,
  includeEndpoints: true,
  includeModels: true,
  scanEnv: false, // skip .env by default
});

const result = scanner.scan();

// ── Access structured results ────────────────────────────────

// 1. Check if any critical tokens were found
if (result.stats.criticalFindings > 0) {
  console.log("🚨 CRITICAL: Found exposed tokens!\n");

  const tokens = result.findings.filter((f) => f.type === "token");
  for (const t of tokens) {
    console.log(`  ${t.severity.toUpperCase()} | ${t.patternName}`);
    console.log(`    File: ${t.file}:${t.line}`);
    console.log(`    Match: ${t.matchedText}\n`);
  }
}

// 2. List all detected SDKs
const sdks = [
  ...new Set(
    result.findings.filter((f) => f.type === "sdk").map((f) => f.patternName)
  ),
];

if (sdks.length > 0) {
  console.log(`📦 LLM SDKs used: ${sdks.join(", ")}`);
}

// 3. List all detected frameworks
const frameworks = [
  ...new Set(
    result.findings
      .filter((f) => f.type === "framework")
      .map((f) => f.patternName)
  ),
];

if (frameworks.length > 0) {
  console.log(`🧠 AI Frameworks: ${frameworks.join(", ")}`);
}

// 4. Get findings as JSON for further processing
const jsonReport = {
  scanDate: new Date().toISOString(),
  directory: targetDir,
  stats: result.stats,
  findings: result.findings.map((f) => ({
    severity: f.severity,
    type: f.type,
    name: f.patternName,
    file: f.file,
    line: f.line,
  })),
};

// Pipe to another tool, save to DB, send to Slack, etc.
// console.log(JSON.stringify(jsonReport, null, 2));
