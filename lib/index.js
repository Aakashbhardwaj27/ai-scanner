const { Scanner } = require('./scanner');
const { printConsoleReport, writeJsonReport, writeSarifReport } = require('./reporter');
const { LLM_SDKS, AI_FRAMEWORKS, TOKEN_PATTERNS, API_ENDPOINTS, MODEL_REFERENCES } = require('./patterns');

module.exports = {
  Scanner,
  printConsoleReport,
  writeJsonReport,
  writeSarifReport,
  patterns: { LLM_SDKS, AI_FRAMEWORKS, TOKEN_PATTERNS, API_ENDPOINTS, MODEL_REFERENCES },
};
