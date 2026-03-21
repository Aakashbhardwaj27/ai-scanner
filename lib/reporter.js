const fs = require('fs');
const path = require('path');
const c = require('./colors');

// ─── Severity Styling ────────────────────────────────────────────────────────
const severityStyle = {
  critical: { color: c.critBg, label: ' CRITICAL ' },
  high:     { color: c.highBg, label: '   HIGH   ' },
  info:     { color: c.infoBg, label: '   INFO   ' },
};

const typeLabel = {
  token:     { color: c.redBold,  label: 'Exposed Token (AI)' },
  secret:    { color: c.redBold,  label: 'Exposed Secret' },
  sdk:       { color: c.blueBold, label: 'LLM SDK' },
  framework: { color: c.magBold,  label: 'AI Framework' },
  endpoint:  { color: c.yellow,   label: 'API Endpoint' },
  model:     { color: c.green,    label: 'Model Reference' },
};

// ─── Simple table drawer ─────────────────────────────────────────────────────
function drawTable(headers, rows, colWidths) {
  const sep  = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  const hdr  = '|' + headers.map((h, i) => ` ${pad(h, colWidths[i])} `).join('|') + '|';

  const lines = [sep, hdr, sep];
  for (const row of rows) {
    lines.push('|' + row.map((cell, i) => ` ${pad(String(cell), colWidths[i])} `).join('|') + '|');
  }
  lines.push(sep);
  return lines.join('\n');
}

function pad(str, len) {
  const raw = str.replace(/\x1b\[[0-9;]*m/g, '');
  if (raw.length >= len) return str.substring(0, len + (str.length - raw.length));
  return str + ' '.repeat(len - raw.length);
}

// ─── ASCII Banner ────────────────────────────────────────────────────────────
function printBanner() {
  console.log(c.cyanBold(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║       █████╗ ██╗    ███████╗ ██████╗ █████╗ ███╗   ██╗   ║
  ║      ██╔══██╗██║    ██╔════╝██╔════╝██╔══██╗████╗  ██║   ║
  ║      ███████║██║    ███████╗██║     ███████║██╔██╗ ██║    ║
  ║      ██╔══██║██║    ╚════██║██║     ██╔══██║██║╚██╗██║    ║
  ║      ██║  ██║██║    ███████║╚██████╗██║  ██║██║ ╚████║    ║
  ║      ╚═╝  ╚═╝╚═╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ║
  ║                                                           ║
  ║    LLM SDK · AI Framework · Token Exposure Scanner  v1.0  ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
`));
}

// ─── Console Report ──────────────────────────────────────────────────────────
function printConsoleReport({ findings, stats }, options = {}) {
  printBanner();

  console.log(c.gray(`  Scanning: ${options.rootDir || process.cwd()}`));
  console.log(c.gray(`  Date:     ${new Date().toISOString()}\n`));

  // ── Summary ──
  console.log(c.whiteBold('  📊  Scan Summary\n'));

  const summaryRows = [
    ['Files Scanned', c.white(String(stats.filesScanned))],
    ['Files Skipped', c.gray(String(stats.filesSkipped))],
    ['Total Findings', c.whiteBold(String(stats.totalFindings))],
    ['Critical', stats.criticalFindings > 0 ? c.redBold(String(stats.criticalFindings)) : c.green('0')],
    ['High', stats.highFindings > 0 ? c.yellowBold(String(stats.highFindings)) : c.green('0')],
    ['Info', c.cyan(String(stats.infoFindings))],
  ];
  console.log(drawTable(['Metric', 'Count'], summaryRows, [26, 12]));
  console.log('');

  if (findings.length === 0) {
    console.log(c.greenBold('\n  ✅  No LLM/AI related findings detected. Codebase is clean!\n'));
    return;
  }

  // ── Group by type ──
  const grouped = {};
  for (const f of findings) {
    if (!grouped[f.type]) grouped[f.type] = [];
    grouped[f.type].push(f);
  }

  const typeOrder = ['token', 'secret', 'sdk', 'framework', 'endpoint', 'model'];

  for (const type of typeOrder) {
    const items = grouped[type];
    if (!items || items.length === 0) continue;

    const tl = typeLabel[type];
    console.log(tl.color(`\n  ─── ${tl.label} (${items.length} found) ${'─'.repeat(42)}\n`));

    const severityOrder = { critical: 0, high: 1, info: 2 };
    items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const rows = items.map(item => {
      const ss = severityStyle[item.severity];
      return [
        ss.color(ss.label),
        item.patternName.substring(0, 26),
        c.gray(truncPath(item.file, 36)),
        c.yellow(String(item.line)),
        c.gray(item.matchedText.substring(0, 30)),
      ];
    });

    console.log(drawTable(
      ['Severity', 'Name', 'File', 'Line', 'Match'],
      rows,
      [12, 26, 38, 6, 32],
    ));
  }

  // ── Unique technologies summary ──
  const uniqueSDKs = [...new Set(findings.filter(f => f.type === 'sdk').map(f => f.patternName))];
  const uniqueFrameworks = [...new Set(findings.filter(f => f.type === 'framework').map(f => f.patternName))];
  const uniqueTokens = [...new Set(findings.filter(f => f.type === 'token').map(f => f.patternName))];
  const uniqueSecrets = [...new Set(findings.filter(f => f.type === 'secret').map(f => f.patternName))];

  console.log(c.whiteBold('\n\n  🤖  AI Technology Stack Detected\n'));

  if (uniqueSDKs.length > 0) {
    console.log(c.blue(`    SDKs:        ${uniqueSDKs.join(', ')}`));
  }
  if (uniqueFrameworks.length > 0) {
    console.log(c.magenta(`    Frameworks:  ${uniqueFrameworks.join(', ')}`));
  }
  if (uniqueTokens.length > 0) {
    console.log(c.red(`    AI Tokens:   ${uniqueTokens.join(', ')}`));
  }
  if (uniqueSecrets.length > 0) {
    console.log(c.red(`    Secrets:     ${uniqueSecrets.join(', ')}`));
  }
  console.log('');

  // ── Verdict ──
  if (stats.criticalFindings > 0) {
    console.log(c.critBg('\n  🚨 CRITICAL: Exposed tokens/secrets detected! Rotate these keys immediately. \n'));
  } else if (stats.highFindings > 0) {
    console.log(c.highBg('\n  ⚠️  WARNING: Potential hardcoded credentials found. Review and remediate. \n'));
  } else {
    console.log(c.okBg('\n  ✅  No exposed secrets. AI SDKs and frameworks detected for awareness. \n'));
  }
}

// ─── JSON Report ─────────────────────────────────────────────────────────────
function writeJsonReport({ findings, stats }, outputPath) {
  const report = {
    scanDate: new Date().toISOString(),
    summary: stats,
    findings: findings.map(f => ({
      severity: f.severity,
      type: f.type,
      name: f.patternName,
      file: f.file,
      line: f.line,
      match: f.matchedText,
      lineContent: f.lineContent,
    })),
    technologies: {
      sdks: [...new Set(findings.filter(f => f.type === 'sdk').map(f => f.patternName))],
      frameworks: [...new Set(findings.filter(f => f.type === 'framework').map(f => f.patternName))],
      exposedTokenTypes: [...new Set(findings.filter(f => f.type === 'token').map(f => f.patternName))],
      exposedSecretTypes: [...new Set(findings.filter(f => f.type === 'secret').map(f => f.patternName))],
    },
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(c.green(`\n  📄 JSON report saved to: ${outputPath}\n`));
}

// ─── SARIF Report ────────────────────────────────────────────────────────────
function writeSarifReport({ findings }, outputPath) {
  const sarif = {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: {
        driver: {
          name: 'ai-scanner',
          version: '1.0.0',
          rules: getUniqueRules(findings),
        },
      },
      results: findings.map(f => ({
        ruleId: f.patternName.replace(/\s+/g, '-').toLowerCase(),
        level: f.severity === 'critical' ? 'error' : f.severity === 'high' ? 'warning' : 'note',
        message: { text: `${f.patternName} detected: ${f.matchedText}` },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: f.file },
            region: { startLine: f.line },
          },
        }],
      })),
    }],
  };

  fs.writeFileSync(outputPath, JSON.stringify(sarif, null, 2), 'utf-8');
  console.log(c.green(`\n  📄 SARIF report saved to: ${outputPath}\n`));
}

function getUniqueRules(findings) {
  const seen = new Set();
  return findings.filter(f => {
    const id = f.patternName.replace(/\s+/g, '-').toLowerCase();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map(f => ({
    id: f.patternName.replace(/\s+/g, '-').toLowerCase(),
    shortDescription: { text: f.patternName },
    defaultConfiguration: {
      level: f.severity === 'critical' ? 'error' : f.severity === 'high' ? 'warning' : 'note',
    },
  }));
}

function truncPath(p, maxLen) {
  if (p.length <= maxLen) return p;
  return '...' + p.substring(p.length - maxLen + 3);
}

module.exports = { printConsoleReport, writeJsonReport, writeSarifReport };