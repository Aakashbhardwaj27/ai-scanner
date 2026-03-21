#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// scan-multiple-repos.js
// Batch scan multiple GitHub repos and generate a summary report
//
// Usage:
//   node scan-multiple-repos.js
//   (edit the REPOS array below to add your repos)
// ─────────────────────────────────────────────────────────────

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { Scanner } = require("../lib/scanner");

// ── Add your repos here ──────────────────────────────────────
const REPOS = [
  "https://github.com/langchain-ai/langchainjs",
  "https://github.com/openai/openai-node",
  "https://github.com/anthropics/anthropic-sdk-python",
  // Add more repos...
];

const results = [];

for (const repoUrl of REPOS) {
  const repoName = repoUrl.split("/").pop().replace(/\.git$/, "");
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-scan-"));
  const clonePath = path.join(tempDir, repoName);

  try {
    console.log(`\n📥 [${repoName}] Cloning...`);
    execSync(`git clone --depth 1 --quiet "${repoUrl}" "${clonePath}"`);

    const scanner = new Scanner({ rootDir: clonePath });
    const result = scanner.scan();

    const sdks = [
      ...new Set(
        result.findings
          .filter((f) => f.type === "sdk")
          .map((f) => f.patternName)
      ),
    ];
    const frameworks = [
      ...new Set(
        result.findings
          .filter((f) => f.type === "framework")
          .map((f) => f.patternName)
      ),
    ];
    const tokenCount = result.findings.filter((f) => f.type === "token").length;

    const summary = {
      repo: repoName,
      url: repoUrl,
      files: result.stats.filesScanned,
      findings: result.stats.totalFindings,
      critical: result.stats.criticalFindings,
      high: result.stats.highFindings,
      sdks,
      frameworks,
      exposedTokens: tokenCount,
    };

    results.push(summary);

    const status =
      tokenCount > 0 ? "🚨" : result.stats.totalFindings > 0 ? "ℹ️ " : "✅";
    console.log(
      `${status} [${repoName}] ${result.stats.totalFindings} findings (${tokenCount} tokens, ${sdks.length} SDKs, ${frameworks.length} frameworks)`
    );
  } catch (err) {
    console.log(`❌ [${repoName}] Failed: ${err.message}`);
    results.push({ repo: repoName, url: repoUrl, error: err.message });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

// ── Summary table ────────────────────────────────────────────
console.log("\n\n═══════════════════════════════════════════════════");
console.log("  BATCH SCAN SUMMARY");
console.log("═══════════════════════════════════════════════════\n");

for (const r of results) {
  if (r.error) {
    console.log(`  ❌ ${r.repo}: ${r.error}`);
    continue;
  }
  const flag =
    r.exposedTokens > 0 ? "🚨" : r.findings > 0 ? "📦" : "✅";
  console.log(
    `  ${flag} ${r.repo.padEnd(30)} ${String(r.findings).padStart(4)} findings  ${String(r.critical).padStart(2)} critical  ${r.sdks.length} SDKs  ${r.frameworks.length} frameworks`
  );
}

// Save report
const reportPath = path.join(process.cwd(), "batch-scan-report.json");
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📄 Full report saved to ${reportPath}\n`);
