# 🔍 ai-scanner

[![CI](https://github.com/Aakashbhardwaj27/ai-scanner/actions/workflows/ci.yml/badge.svg)](https://github.com/Aakashbhardwaj27/ai-scanner/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ai-scanner.svg)](https://www.npmjs.com/package/ai-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg)]()

A powerful CLI tool that scans your codebase to detect **LLM SDK usage**, **AI framework integrations**, and **exposed API tokens/keys** for any LLM provider.

Zero dependencies. Works with Node.js 18+.

## Features

- **LLM SDK Detection** — OpenAI, Anthropic, Google Gemini, Cohere, Mistral, Groq, Replicate, Together AI, AWS Bedrock, Azure OpenAI, Ollama, LiteLLM, DeepSeek, and more
- **AI Framework Detection** — LangChain, LlamaIndex, Haystack, AutoGen, CrewAI, Vercel AI SDK, DSPy, Semantic Kernel, LangGraph, vLLM, and more
- **Token/Key Exposure Scanning** — Detects hardcoded API keys for OpenAI (`sk-`), Anthropic (`sk-ant-`), Hugging Face (`hf_`), Google (`AIzaSy`), AWS (`AKIA`), Groq (`gsk_`), Replicate (`r8_`), LangSmith (`ls__`), and generic credential patterns
- **Smart Filtering** — Ignores `.env` files (they're *meant* to hold secrets) and filters out SDK/framework mentions in READMEs, docs, and example files
- **Model Reference Detection** — Spots references to GPT-4, Claude, Gemini, Llama, Mistral, and other models
- **API Endpoint Detection** — Finds direct API calls to LLM providers
- **Multiple Output Formats** — Rich console output, JSON, and SARIF (for CI/CD)
- **Jupyter Notebook Support** — Parses `.ipynb` files to scan code cells
- **Token Masking** — Automatically masks detected tokens in output for safety

## Quick Start

```bash
# Run directly with npx (no install needed)
npx ai-scanner ./my-project

# Or install globally
npm install -g ai-scanner
ai-scanner ./my-project
```

## Usage

```bash
# Scan current directory
ai-scanner

# Scan a specific directory
ai-scanner ./my-project

# Security-focused: only scan for exposed tokens
ai-scanner --tokens-only

# Include .env files in scan (skipped by default)
ai-scanner --scan-env

# Output as JSON
ai-scanner --json

# Save JSON report
ai-scanner -o report.json

# Save SARIF report (GitHub Actions, VS Code, etc.)
ai-scanner --sarif results.sarif

# CI mode: exit with code 1 if critical/high findings
ai-scanner --exit-code

# Skip endpoint/model detection for faster scan
ai-scanner --no-endpoints --no-models

# Combine options
ai-scanner ./src --tokens-only --exit-code --json
```

## Smart Filtering

ai-scanner is context-aware and avoids noisy false positives:

| File type | SDK/Framework mentions | Exposed tokens |
|---|---|---|
| **Source code** (`.js`, `.py`, `.go`, etc.) | ✅ Reported | ✅ Reported |
| **README, docs, markdown** | ❌ Ignored (just documentation) | ✅ Reported |
| **`examples/`, `samples/`, `docs/` dirs** | ❌ Ignored (just examples) | ✅ Reported |
| **`.env` files** | ❌ Skipped by default | ❌ Skipped by default |
| **`.env` files with `--scan-env`** | — | ✅ Reported |

This means scanning a project like an LLM gateway — which naturally references many SDKs in its README and examples — won't flood you with 100+ informational findings.

## CI/CD Integration

### GitHub Actions

```yaml
- name: Scan for exposed AI tokens
  run: npx ai-scanner --tokens-only --exit-code --sarif results.sarif

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npx ai-scanner --tokens-only --exit-code
```

## Severity Levels

| Level | Meaning | Example |
|-------|---------|---------|
| 🚨 CRITICAL | Exposed API key with known prefix | `sk-ant-abc123...` hardcoded in source |
| ⚠️ HIGH | Likely hardcoded credential | `api_key = "some-long-string"` |
| ℹ️ INFO | SDK/framework usage (awareness) | `import openai` |

## Supported Detections

### LLM SDKs (16+)
OpenAI, Anthropic, Google Generative AI, Vertex AI, Cohere, Mistral, Hugging Face, Replicate, Together AI, Groq, AWS Bedrock, Azure OpenAI, Ollama, LiteLLM, Fireworks AI, Perplexity, DeepSeek

### AI Frameworks (20+)
LangChain, LangGraph, LangSmith, LlamaIndex, Haystack, AutoGen, CrewAI, Semantic Kernel, Vercel AI SDK, DSPy, Guidance, Instructor, Chainlit, Flowise, Embedchain, Promptflow, Spring AI, vLLM, TensorRT-LLM, MLflow, Weights & Biases, Smolagents

### Token Patterns (20+)
OpenAI keys, Anthropic keys, Google AI keys, HuggingFace tokens, Cohere keys, Replicate tokens, Groq keys, Mistral keys, AWS access keys, LangSmith keys, Fireworks keys, W&B keys, generic hardcoded API key assignments, Bearer tokens, Authorization headers

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

The easiest way to contribute is adding new detection patterns — see the guide for the pattern format.

## License

[MIT](LICENSE)
