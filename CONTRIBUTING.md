# Contributing to ai-scanner

Thanks for your interest in contributing! This project is open to everyone.

## How to Contribute

### Reporting Bugs

Open an issue with:
- What you ran (command + flags)
- What you expected
- What actually happened
- Your Node.js version (`node -v`)

### Suggesting New Detections

We're always looking to expand coverage. If you know of an LLM SDK, AI framework, or token pattern we're missing, open an issue with:
- The name of the SDK/framework/provider
- Example import or usage pattern
- Example token format (redacted)

### Submitting Code

1. Fork the repo
2. Create a branch (`git checkout -b add-new-pattern`)
3. Make your changes
4. Test against a real project:
   ```bash
   node bin/cli.js /path/to/test-project
   node bin/cli.js /path/to/test-project --json
   node bin/cli.js /path/to/test-project --tokens-only
   ```
5. Commit with a clear message
6. Open a PR

### Adding a New Detection Pattern

Patterns live in `lib/patterns.js`. Each pattern follows this shape:

```js
{
  name: 'Provider Name (Language)',  // Human-readable label
  type: 'sdk',                      // sdk | framework | token | endpoint | model
  pattern: /your-regex-here/g,      // Must use the global flag
  severity: 'info',                 // critical | high | info
}
```

**Guidelines:**
- Token patterns should be `critical` severity if they have a known prefix (like `sk-ant-`)
- Token patterns should be `high` severity for generic/heuristic matches
- SDK and framework patterns should be `info` severity
- Test your regex against both true positives AND false positives
- Avoid overly broad patterns that match common English words

## Code Style

- No external dependencies — this project is zero-dependency by design
- Use `const` over `let` where possible
- Keep functions small and focused

## Questions?

Open an issue — happy to help.
