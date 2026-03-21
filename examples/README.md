# Examples

Practical examples showing different ways to use ai-scanner.

## Scan a GitHub Repo

**Shell script** — clone and scan any public repo in one command:

```bash
chmod +x examples/scan-github-repo.sh
./examples/scan-github-repo.sh https://github.com/langchain-ai/langchainjs
./examples/scan-github-repo.sh https://github.com/user/repo --tokens-only
```

**Node.js script** — scan programmatically and save a JSON report:

```bash
node examples/scan-github-repo.js https://github.com/langchain-ai/langchainjs
```

## Batch Scan Multiple Repos

Edit the `REPOS` array in the script, then run:

```bash
node examples/scan-multiple-repos.js
```

Outputs a summary table + `batch-scan-report.json`.

## CI/CD

**GitHub Actions** — copy into your repo to scan every PR:

```bash
cp examples/ai-scan-pr.yml .github/workflows/ai-scan.yml
```

**Pre-commit hook** — block commits with exposed tokens:

```bash
cp examples/pre-commit-hook.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Use as a Library

Import the scanner in your own Node.js code:

```bash
node examples/use-as-library.js ./my-project
```

See `use-as-library.js` for the full API — access findings by type, check severity counts, generate custom reports.
