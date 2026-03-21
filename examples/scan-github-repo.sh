#!/bin/bash
# ─────────────────────────────────────────────────────────────
# scan-github-repo.sh
# Scan any public GitHub repo for LLM/AI usage and exposed tokens
#
# Usage:
#   ./scan-github-repo.sh https://github.com/user/repo
#   ./scan-github-repo.sh https://github.com/user/repo --tokens-only
#   ./scan-github-repo.sh https://github.com/user/repo --json
# ─────────────────────────────────────────────────────────────

set -e

REPO_URL="$1"
shift
EXTRA_FLAGS="$@"

if [ -z "$REPO_URL" ]; then
  echo "Usage: ./scan-github-repo.sh <github-repo-url> [ai-scanner flags]"
  echo ""
  echo "Examples:"
  echo "  ./scan-github-repo.sh https://github.com/langchain-ai/langchain"
  echo "  ./scan-github-repo.sh https://github.com/openai/openai-node --tokens-only"
  echo "  ./scan-github-repo.sh https://github.com/user/repo --json -o report.json"
  exit 1
fi

# Extract repo name for temp directory
REPO_NAME=$(echo "$REPO_URL" | sed 's/.*\///' | sed 's/\.git$//')
TEMP_DIR=$(mktemp -d)
CLONE_PATH="$TEMP_DIR/$REPO_NAME"

echo "📥 Cloning $REPO_URL ..."
git clone --depth 1 --quiet "$REPO_URL" "$CLONE_PATH"

echo "🔍 Scanning $REPO_NAME ..."
echo ""

# Run ai-scanner on the cloned repo
npx ai-scanner "$CLONE_PATH" $EXTRA_FLAGS

# Cleanup
rm -rf "$TEMP_DIR"
echo ""
echo "🧹 Cleaned up temporary files."
