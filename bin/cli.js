#!/usr/bin/env node

const path = require('path');
const { Scanner } = require('../lib/scanner');
const { printConsoleReport, writeJsonReport, writeSarifReport } = require('../lib/reporter');
const c = require('../lib/colors');

// ─── Argument Parsing ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {};
const positional = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else if (arg === '--version' || arg === '-v') {
    console.log('ai-scanner v1.0.0');
    process.exit(0);
  } else if (arg === '-o' || arg === '--output') {
    flags.output = args[++i];
  } else if (arg === '--sarif') {
    flags.sarif = args[++i];
  } else if (arg === '--no-endpoints') {
    flags.noEndpoints = true;
  } else if (arg === '--no-models') {
    flags.noModels = true;
  } else if (arg === '--tokens-only') {
    flags.tokensOnly = true;
  } else if (arg === '--json') {
    flags.json = true;
  } else if (arg === '--exit-code') {
    flags.exitCode = true;
  } else if (arg === '--scan-env') {
    flags.scanEnv = true;
  } else if (!arg.startsWith('-')) {
    positional.push(arg);
  } else {
    console.error(c.red(`  Unknown option: ${arg}\n`));
    printHelp();
    process.exit(1);
  }
}

const directory = positional[0] || '.';
const rootDir = path.resolve(directory);

// ─── Run Scan ────────────────────────────────────────────────────────────────
if (!flags.json) {
  process.stdout.write(c.cyan('  ⏳ Scanning codebase for AI/LLM patterns...\r'));
}

try {
  const scanner = new Scanner({
    rootDir,
    includeEndpoints: !flags.noEndpoints,
    includeModels: !flags.noModels,
    scanEnv: flags.scanEnv,
  });

  let result = scanner.scan();

  if (flags.tokensOnly) {
    result.findings = result.findings.filter(f => f.type === 'token');
    result.stats.totalFindings = result.findings.length;
    result.stats.infoFindings = 0;
  }

  // Clear spinner line
  if (!flags.json) {
    process.stdout.write('                                                          \r');
  }

  // Output
  if (flags.json) {
    const jsonOutput = {
      scanDate: new Date().toISOString(),
      directory: rootDir,
      summary: result.stats,
      findings: result.findings.map(f => ({
        severity: f.severity,
        type: f.type,
        name: f.patternName,
        file: f.file,
        line: f.line,
        match: f.matchedText,
      })),
    };
    process.stdout.write(JSON.stringify(jsonOutput, null, 2) + '\n');
  } else {
    printConsoleReport(result, { rootDir });
  }

  if (flags.output) {
    writeJsonReport(result, path.resolve(flags.output));
  }

  if (flags.sarif) {
    writeSarifReport(result, path.resolve(flags.sarif));
  }

  if (flags.exitCode) {
    if (result.stats.criticalFindings > 0 || result.stats.highFindings > 0) {
      process.exit(1);
    }
  }
} catch (err) {
  console.error(c.red(`\n  ❌ Scan failed: ${err.message}\n`));
  process.exit(2);
}

// ─── Help ────────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
  ${c.cyanBold('ai-scanner')} — Scan codebases for LLM SDK usage, AI frameworks & exposed tokens

  ${c.whiteBold('USAGE')}
    ai-scanner [directory] [options]

  ${c.whiteBold('ARGUMENTS')}
    directory              Directory to scan (default: current directory)

  ${c.whiteBold('OPTIONS')}
    -o, --output <file>    Write JSON report to file
    --sarif <file>         Write SARIF report (for CI/CD integration)
    --no-endpoints         Skip API endpoint detection
    --no-models            Skip model name reference detection
    --tokens-only          Only scan for exposed tokens (security mode)
    --scan-env             Include .env files (skipped by default)
    --json                 Output results as JSON to stdout
    --exit-code            Exit with code 1 if critical/high findings
    -h, --help             Show this help message
    -v, --version          Show version number

  ${c.whiteBold('SMART FILTERING')}
    ${c.gray('•')} .env files are ${c.yellow('skipped by default')} — they're meant to hold secrets
      and should be in .gitignore. Use --scan-env to include them.
    ${c.gray('•')} README, docs/, examples/ — SDK/framework mentions are ignored
      (just documentation). Exposed tokens in docs are still flagged.

  ${c.whiteBold('EXAMPLES')}
    ${c.gray('# Scan current directory')}
    ai-scanner

    ${c.gray('# Scan a project folder')}
    ai-scanner ./my-project

    ${c.gray('# Security-only scan with CI exit code')}
    ai-scanner --tokens-only --exit-code

    ${c.gray('# Include .env files in scan')}
    ai-scanner --scan-env

    ${c.gray('# JSON output for piping')}
    ai-scanner ./src --json | jq '.findings[]'

    ${c.gray('# Generate SARIF for GitHub Actions')}
    ai-scanner --sarif results.sarif
`);
}
