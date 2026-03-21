#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// scan-github-repo.js
// Scan any public GitHub repo programmatically using ai-scanner as a library
//
// Usage:
//   node scan-github-repo.js https://github.com/user/repo
// ─────────────────────────────────────────────────────────────

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Import ai-scanner as a library
const { Scanner } = require("../lib/scanner");

const repoUrl = process.argv[2];

if (!repoUrl) {
  console.log("Usage: node scan-github-repo.js <github-repo-url>");
  console.log("");
  console.log("Example:");
  console.log(
    "  node scan-github-repo.js https://github.com/langchain-ai/langchain"
  );
  process.exit(1);
}

// Extract repo name
const repoName = repoUrl.split("/").pop().replace(/\.git$/, "");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-scanner-"));
const clonePath = path.join(tempDir, repoName);

try {
  // Shallow clone
  console.log(`📥 Cloning ${repoUrl} ...`);
  execSync(`git clone --depth 1 --quiet "${repoUrl}" "${clonePath}"`, {
    stdio: "inherit",
  });

  // Scan using the library API
  console.log(`\n🔍 Scanning ${repoName} ...\n`);
  const scanner = new Scanner({ rootDir: clonePath });
  const result = scanner.scan();

  // Print summary
  console.log(`\n📊 Results for ${repoName}:`);
  console.log(`   Files scanned:  ${result.stats.filesScanned}`);
  console.log(`   Total findings: ${result.stats.totalFindings}`);
  console.log(`   Critical:       ${result.stats.criticalFindings}`);
  console.log(`   High:           ${result.stats.highFindings}`);
  console.log(`   Info:           ${result.stats.infoFindings}`);

  // Group by type
  const byType = {};
  for (const f of result.findings) {
    if (!byType[f.type]) byType[f.type] = [];
    byType[f.type].push(f);
  }

  // Show unique detections per type
  console.log("\n🤖 AI Stack Detected:");
  if (byType.sdk) {
    const unique = [...new Set(byType.sdk.map((f) => f.patternName))];
    console.log(`   SDKs:       ${unique.join(", ")}`);
  }
  if (byType.framework) {
    const unique = [...new Set(byType.framework.map((f) => f.patternName))];
    console.log(`   Frameworks: ${unique.join(", ")}`);
  }
  if (byType.token) {
    const unique = [...new Set(byType.token.map((f) => f.patternName))];
    console.log(`   ⚠️  Tokens:  ${unique.join(", ")}`);
  }

  // Save JSON report
  const reportPath = path.join(process.cwd(), `${repoName}-report.json`);
  const report = {
    repo: repoUrl,
    scanDate: new Date().toISOString(),
    summary: result.stats,
    findings: result.findings.map((f) => ({
      severity: f.severity,
      type: f.type,
      name: f.patternName,
      file: f.file,
      line: f.line,
      match: f.matchedText,
    })),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to ${reportPath}`);
} finally {
  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("🧹 Cleaned up temporary files.");
}
