# 🔍 ai-scanner

A powerful CLI tool that scans your codebase to detect **LLM SDK usage**, **AI framework integrations**, and **exposed API tokens/keys** for any LLM provider.

## Features

- **LLM SDK Detection** — OpenAI, Anthropic, Google Gemini, Cohere, Mistral, Groq, Replicate, Together AI, AWS Bedrock, Azure OpenAI, Ollama, LiteLLM, DeepSeek, and more
- **AI Framework Detection** — LangChain, LlamaIndex, Haystack, AutoGen, CrewAI, Vercel AI SDK, DSPy, Semantic Kernel, LangGraph, vLLM, and more
- **Token/Key Exposure Scanning** — Detects hardcoded API keys for OpenAI (`sk-`), Anthropic (`sk-ant-`), Hugging Face (`hf_`), Google (`AIzaSy`), AWS (`AKIA`), Groq (`gsk_`), Replicate (`r8_`), LangSmith (`ls__`), and generic credential patterns
- **Model Reference Detection** — Spots references to GPT-4, Claude, Gemini, Llama, Mistral, and other models
- **API Endpoint Detection** — Finds direct API calls to LLM providers
- **Multiple Output Formats** — Rich console output, JSON, and SARIF (for CI/CD)
- **Jupyter Notebook Support** — Parses `.ipynb` files to scan code cells
- **Token Masking** — Automatically masks detected tokens in output for safety

## Installation

```bash
# Install globally
npm install -g ai-scanner

# Or run directly with npx
npx ai-scanner ./my-project
```

## Usage

```bash
# Scan current directory
ai-scanner

# Scan a specific directory
ai-scanner ./my-project

# Security-focused: only scan for exposed tokens
ai-scanner --tokens-only

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

## License

MIT
