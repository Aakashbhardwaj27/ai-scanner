#!/bin/bash
# ─────────────────────────────────────────────────────────────
# pre-commit hook
# Prevents commits that contain hardcoded AI API tokens.
#
# Setup:
#   cp examples/pre-commit-hook.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# Or with Husky:
#   npx husky add .husky/pre-commit "npx ai-scanner --tokens-only --exit-code"
# ─────────────────────────────────────────────────────────────

echo "🔍 Scanning for exposed AI tokens..."

npx ai-scanner --tokens-only --exit-code --json > /dev/null 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 1 ]; then
  echo ""
  echo "🚨 COMMIT BLOCKED: Exposed AI API tokens detected!"
  echo ""
  echo "Run 'npx ai-scanner --tokens-only' to see details."
  echo "Move secrets to environment variables or a vault before committing."
  echo ""
  exit 1
fi

echo "✅ No exposed tokens found. Proceeding with commit."
exit 0
