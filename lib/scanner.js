const fs = require('fs');
const path = require('path');
const { LLM_SDKS, AI_FRAMEWORKS, TOKEN_PATTERNS, API_ENDPOINTS, MODEL_REFERENCES } = require('./patterns');

// ─── File Extensions to Scan ─────────────────────────────────────────────────
const SCANNABLE_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.py', '.pyw',
  '.java', '.kt', '.kts',
  '.cs',
  '.go',
  '.rs',
  '.rb',
  '.php',
  '.swift',
  '.scala',
  '.r', '.R',
  '.yml', '.yaml',
  '.json',
  '.toml',
  '.cfg', '.ini', '.conf',
  '.sh', '.bash', '.zsh',
  '.dockerfile', '.docker-compose.yml',
  '.tf', '.hcl',
  '.ipynb',
  '.md',
  '.txt',
]);

// ─── Documentation / non-source file extensions ─────────────────────────────
// Findings from these files are tagged as context:"docs" and treated differently
const DOC_EXTENSIONS = new Set(['.md', '.txt', '.rst', '.adoc']);

// ─── Documentation directory names (case-insensitive check) ─────────────────
const DOC_DIRS = new Set([
  'docs', 'doc', 'documentation', 'examples', 'example',
  'samples', 'sample', 'demo', 'demos', 'tutorials', 'tutorial',
  'guides', 'guide', 'wiki',
]);

// ─── Directories to Skip ────────────────────────────────────────────────────
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.svn', '.hg',
  '__pycache__', '.pytest_cache', '.mypy_cache',
  'venv', '.venv', 'env', '.env',
  'dist', 'build', 'out', 'target',
  '.next', '.nuxt', '.output',
  'vendor', 'bower_components',
  '.idea', '.vscode',
  'coverage', '.nyc_output',
  '.terraform',
  'egg-info',
]);

// ─── Filename patterns that are likely false positives ───────────────────────
const SKIP_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'Gemfile.lock',
  'Cargo.lock',
  'poetry.lock',
]);

// ─── .env and environment files — expected to hold secrets ───────────────────
// These are ignored by default (they SHOULD have secrets, and should be in
// .gitignore). Use --scan-env to explicitly include them.
const ENV_FILE_PATTERNS = [
  /^\.env$/,             // .env
  /^\.env\..+$/,         // .env.local, .env.production, etc.
  /^\.env\.example$/,    // still skip — example files shouldn't have real keys
];

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

class Scanner {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.includeEndpoints = options.includeEndpoints !== false;
    this.includeModels = options.includeModels !== false;
    this.scanEnv = options.scanEnv === true; // opt-in: scan .env files
    this.findings = [];
    this.stats = {
      filesScanned: 0,
      filesSkipped: 0,
      totalFindings: 0,
      criticalFindings: 0,
      highFindings: 0,
      infoFindings: 0,
    };
  }

  /**
   * Check if a file path is inside a documentation directory
   */
  isDocPath(filePath) {
    const rel = path.relative(this.rootDir, filePath);
    const parts = rel.split(path.sep);
    // Check if any parent directory is a doc directory
    for (const part of parts.slice(0, -1)) {
      if (DOC_DIRS.has(part.toLowerCase())) return true;
    }
    return false;
  }

  /**
   * Check if a file is a documentation file (by extension or name)
   */
  isDocFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath).toLowerCase();
    if (DOC_EXTENSIONS.has(ext)) return true;
    if (basename === 'readme' || basename.startsWith('readme.')) return true;
    if (basename === 'changelog' || basename.startsWith('changelog.')) return true;
    if (basename === 'contributing' || basename.startsWith('contributing.')) return true;
    if (basename === 'license' || basename.startsWith('license.')) return true;
    return false;
  }

  /**
   * Check if a file is an .env file
   */
  isEnvFile(basename) {
    return ENV_FILE_PATTERNS.some(p => p.test(basename));
  }

  /**
   * Walk the directory tree and collect all scannable files
   */
  collectFiles(dir) {
    const files = [];
    let entries;

    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      return files;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        files.push(...this.collectFiles(fullPath));
      } else if (entry.isFile()) {
        if (SKIP_FILES.has(entry.name)) {
          this.stats.filesSkipped++;
          continue;
        }

        const basename = entry.name.toLowerCase();

        // Skip .env files unless --scan-env is set
        if (this.isEnvFile(entry.name)) {
          if (!this.scanEnv) {
            this.stats.filesSkipped++;
            continue;
          }
        }

        const ext = path.extname(entry.name).toLowerCase();

        // Include Dockerfiles, Makefiles, and .env files (when opted in)
        const isSpecial = basename === 'dockerfile' ||
                          basename === 'docker-compose.yml' ||
                          basename === 'docker-compose.yaml' ||
                          basename === 'makefile' ||
                          (this.scanEnv && this.isEnvFile(entry.name));

        if (SCANNABLE_EXTENSIONS.has(ext) || isSpecial) {
          try {
            const stat = fs.statSync(fullPath);
            if (stat.size <= MAX_FILE_SIZE) {
              files.push(fullPath);
            } else {
              this.stats.filesSkipped++;
            }
          } catch {
            this.stats.filesSkipped++;
          }
        } else {
          this.stats.filesSkipped++;
        }
      }
    }

    return files;
  }

  /**
   * Scan a single file against all patterns
   */
  scanFile(filePath, patterns) {
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch {
      return [];
    }

    // Determine if this is a documentation/example file
    const isDoc = this.isDocFile(filePath) || this.isDocPath(filePath);

    // For .ipynb files, extract source code cells
    if (filePath.endsWith('.ipynb')) {
      try {
        const notebook = JSON.parse(content);
        const cells = notebook.cells || [];
        content = cells
          .filter(c => c.cell_type === 'code' || c.cell_type === 'markdown')
          .map(c => (Array.isArray(c.source) ? c.source.join('') : c.source))
          .join('\n');
      } catch {
        return [];
      }
    }

    const lines = content.split('\n');
    const results = [];

    for (const patternDef of patterns) {
      // Reset regex lastIndex
      patternDef.pattern.lastIndex = 0;
      let match;

      while ((match = patternDef.pattern.exec(content)) !== null) {
        // Find line number
        const beforeMatch = content.substring(0, match.index);
        const lineNum = beforeMatch.split('\n').length;
        const lineContent = lines[lineNum - 1] || '';

        // Skip commented lines (basic heuristic)
        const trimmedLine = lineContent.trim();
        if (trimmedLine.startsWith('//') || trimmedLine.startsWith('#') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
          // Still report tokens in comments — they're still exposed!
          if (patternDef.type !== 'token') continue;
        }

        // For tokens, mask the actual value
        let matchedText = match[0];
        if (patternDef.type === 'token') {
          matchedText = maskToken(matchedText);
        }

        results.push({
          file: path.relative(this.rootDir, filePath),
          line: lineNum,
          lineContent: lineContent.trim().substring(0, 120),
          matchedText,
          ...patternDef,
          patternName: patternDef.name,
          context: isDoc ? 'docs' : 'source',
        });
      }
    }

    return results;
  }

  /**
   * Run the full scan
   */
  scan() {
    const allPatterns = [
      ...LLM_SDKS,
      ...AI_FRAMEWORKS,
      ...TOKEN_PATTERNS,
    ];

    if (this.includeEndpoints) {
      allPatterns.push(...API_ENDPOINTS);
    }
    if (this.includeModels) {
      allPatterns.push(...MODEL_REFERENCES);
    }

    const files = this.collectFiles(this.rootDir);

    for (const file of files) {
      this.stats.filesScanned++;
      const results = this.scanFile(file, allPatterns);
      this.findings.push(...results);
    }

    // Deduplicate findings (same file + line + pattern)
    const seen = new Set();
    this.findings = this.findings.filter(f => {
      const key = `${f.file}:${f.line}:${f.patternName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // ── Filter out documentation noise ──
    // For docs/README/examples: only keep token findings (real security risk)
    // and drop sdk/framework/endpoint/model findings (just talking about them)
    this.findings = this.findings.filter(f => {
      if (f.context === 'docs') {
        // Only keep exposed tokens — those are dangerous even in docs
        return f.type === 'token';
      }
      return true;
    });

    // Update stats
    this.stats.totalFindings = this.findings.length;
    this.stats.criticalFindings = this.findings.filter(f => f.severity === 'critical').length;
    this.stats.highFindings = this.findings.filter(f => f.severity === 'high').length;
    this.stats.infoFindings = this.findings.filter(f => f.severity === 'info').length;

    return {
      findings: this.findings,
      stats: this.stats,
    };
  }
}

/**
 * Mask sensitive token values for display
 */
function maskToken(token) {
  if (token.length <= 12) return token.substring(0, 4) + '****';
  const prefix = token.substring(0, 8);
  const suffix = token.substring(token.length - 4);
  return `${prefix}...${suffix}`;
}

module.exports = { Scanner };
