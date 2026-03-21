// ─── LLM SDK Patterns ────────────────────────────────────────────────────────
const LLM_SDKS = [
  // OpenAI
  { name: 'OpenAI (Python)', type: 'sdk', pattern: /(?:from\s+openai\s+import|import\s+openai)/g, severity: 'info' },
  { name: 'OpenAI (Node)', type: 'sdk', pattern: /require\s*\(\s*['"]openai['"]\s*\)|from\s+['"]openai['"]/g, severity: 'info' },
  { name: 'OpenAI Client Init', type: 'sdk', pattern: /(?:new\s+)?OpenAI\s*\(/g, severity: 'info' },

  // Anthropic
  { name: 'Anthropic (Python)', type: 'sdk', pattern: /(?:from\s+anthropic\s+import|import\s+anthropic)/g, severity: 'info' },
  { name: 'Anthropic (Node)', type: 'sdk', pattern: /require\s*\(\s*['"]@anthropic-ai\/sdk['"]\s*\)|from\s+['"]@anthropic-ai\/sdk['"]/g, severity: 'info' },
  { name: 'Anthropic Client Init', type: 'sdk', pattern: /(?:new\s+)?Anthropic\s*\(/g, severity: 'info' },

  // Google AI / Gemini
  { name: 'Google Generative AI', type: 'sdk', pattern: /(?:from\s+google\.generativeai|import\s+google\.generativeai|@google\/generative-ai)/g, severity: 'info' },
  { name: 'Google Vertex AI', type: 'sdk', pattern: /(?:from\s+google\.cloud\s+import\s+aiplatform|@google-cloud\/vertexai|vertexai)/g, severity: 'info' },

  // Cohere
  { name: 'Cohere SDK', type: 'sdk', pattern: /(?:from\s+cohere\s+import|import\s+cohere|require\s*\(\s*['"]cohere-ai['"]\s*\)|from\s+['"]cohere-ai['"]\s*import)/g, severity: 'info' },

  // Mistral
  { name: 'Mistral SDK', type: 'sdk', pattern: /(?:from\s+mistralai|import\s+mistralai|@mistralai\/client)/g, severity: 'info' },

  // Hugging Face
  { name: 'Hugging Face Transformers', type: 'sdk', pattern: /(?:from\s+transformers\s+import|import\s+transformers)/g, severity: 'info' },
  { name: 'Hugging Face Hub', type: 'sdk', pattern: /(?:from\s+huggingface_hub|import\s+huggingface_hub|@huggingface\/hub)/g, severity: 'info' },
  { name: 'Hugging Face Inference', type: 'sdk', pattern: /(?:@huggingface\/inference|HfInference)/g, severity: 'info' },

  // Replicate
  { name: 'Replicate SDK', type: 'sdk', pattern: /(?:import\s+replicate|from\s+['"]replicate['"]\s*import|require\s*\(\s*['"]replicate['"]\s*\))/g, severity: 'info' },

  // Together AI
  { name: 'Together AI SDK', type: 'sdk', pattern: /(?:from\s+together\s+import|import\s+together|require\s*\(\s*['"]together-ai['"]\s*\))/g, severity: 'info' },

  // Groq
  { name: 'Groq SDK', type: 'sdk', pattern: /(?:from\s+groq\s+import|import\s+groq|require\s*\(\s*['"]groq-sdk['"]\s*\)|from\s+['"]groq-sdk['"]\s*import)/g, severity: 'info' },

  // AWS Bedrock
  { name: 'AWS Bedrock', type: 'sdk', pattern: /(?:bedrock-runtime|BedrockRuntimeClient|invoke_model|bedrock\.runtime)/g, severity: 'info' },

  // Azure OpenAI
  { name: 'Azure OpenAI', type: 'sdk', pattern: /(?:AzureOpenAI|azure_endpoint|openai\.azure|azure-openai)/g, severity: 'info' },

  // Ollama
  { name: 'Ollama', type: 'sdk', pattern: /(?:import\s+ollama|from\s+['"]ollama['"]\s*import|require\s*\(\s*['"]ollama['"]\s*\)|localhost:11434)/g, severity: 'info' },

  // LiteLLM
  { name: 'LiteLLM', type: 'sdk', pattern: /(?:from\s+litellm|import\s+litellm|litellm\.completion)/g, severity: 'info' },

  // Fireworks AI
  { name: 'Fireworks AI', type: 'sdk', pattern: /(?:fireworks-ai|fireworks\.client|api\.fireworks\.ai)/g, severity: 'info' },

  // Perplexity
  { name: 'Perplexity AI', type: 'sdk', pattern: /(?:api\.perplexity\.ai|perplexity-ai)/g, severity: 'info' },

  // DeepSeek
  { name: 'DeepSeek', type: 'sdk', pattern: /(?:api\.deepseek\.com|deepseek-ai|deepseek-chat|deepseek-coder)/g, severity: 'info' },
];

// ─── AI Framework Patterns ───────────────────────────────────────────────────
const AI_FRAMEWORKS = [
  // LangChain
  { name: 'LangChain (Python)', type: 'framework', pattern: /(?:from\s+langchain[._]|import\s+langchain)/g, severity: 'info' },
  { name: 'LangChain (JS/TS)', type: 'framework', pattern: /(?:from\s+['"]langchain\/|require\s*\(\s*['"]langchain\/|@langchain\/)/g, severity: 'info' },
  { name: 'LangSmith', type: 'framework', pattern: /(?:langsmith|LANGCHAIN_TRACING|LANGCHAIN_API_KEY)/g, severity: 'info' },

  // LlamaIndex
  { name: 'LlamaIndex', type: 'framework', pattern: /(?:from\s+llama_index|import\s+llama_index|llamaindex)/g, severity: 'info' },

  // Haystack
  { name: 'Haystack', type: 'framework', pattern: /(?:from\s+haystack|import\s+haystack|deepset-ai\/haystack)/g, severity: 'info' },

  // AutoGen
  { name: 'AutoGen', type: 'framework', pattern: /(?:from\s+autogen|import\s+autogen|pyautogen)/g, severity: 'info' },

  // CrewAI
  { name: 'CrewAI', type: 'framework', pattern: /(?:from\s+crewai|import\s+crewai|crewai)/g, severity: 'info' },

  // Semantic Kernel
  { name: 'Semantic Kernel', type: 'framework', pattern: /(?:semantic.kernel|semantic_kernel|Microsoft\.SemanticKernel)/g, severity: 'info' },

  // Vercel AI SDK
  { name: 'Vercel AI SDK', type: 'framework', pattern: /(?:from\s+['"]ai['"]\s*import|require\s*\(\s*['"]ai['"]\s*\)|@ai-sdk\/)/g, severity: 'info' },

  // DSPy
  { name: 'DSPy', type: 'framework', pattern: /(?:from\s+dspy|import\s+dspy)/g, severity: 'info' },

  // Guidance
  { name: 'Guidance (Microsoft)', type: 'framework', pattern: /(?:from\s+guidance|import\s+guidance|guidance\.models)/g, severity: 'info' },

  // Instructor
  { name: 'Instructor', type: 'framework', pattern: /(?:import\s+instructor|from\s+instructor|instructor\.patch|instructor\.from_)/g, severity: 'info' },

  // Phidata
  { name: 'Phidata', type: 'framework', pattern: /(?:from\s+phi\.|import\s+phi\.|phidata)/g, severity: 'info' },

  // Chainlit
  { name: 'Chainlit', type: 'framework', pattern: /(?:import\s+chainlit|from\s+chainlit|@chainlit)/g, severity: 'info' },

  // Flowise
  { name: 'Flowise', type: 'framework', pattern: /(?:flowise|FlowiseAI)/g, severity: 'info' },

  // Embedchain
  { name: 'Embedchain', type: 'framework', pattern: /(?:from\s+embedchain|import\s+embedchain)/g, severity: 'info' },

  // Promptflow
  { name: 'Promptflow (Azure)', type: 'framework', pattern: /(?:from\s+promptflow|import\s+promptflow|promptflow)/g, severity: 'info' },

  // Spring AI
  { name: 'Spring AI', type: 'framework', pattern: /(?:spring-ai|org\.springframework\.ai)/g, severity: 'info' },

  // LangGraph
  { name: 'LangGraph', type: 'framework', pattern: /(?:from\s+langgraph|import\s+langgraph|@langchain\/langgraph)/g, severity: 'info' },

  // Smolagents
  { name: 'Smolagents (HF)', type: 'framework', pattern: /(?:from\s+smolagents|import\s+smolagents)/g, severity: 'info' },

  // vLLM
  { name: 'vLLM', type: 'framework', pattern: /(?:from\s+vllm|import\s+vllm)/g, severity: 'info' },

  // TensorRT-LLM
  { name: 'TensorRT-LLM', type: 'framework', pattern: /(?:tensorrt_llm|tensorrt-llm)/g, severity: 'info' },

  // MLflow
  { name: 'MLflow', type: 'framework', pattern: /(?:import\s+mlflow|from\s+mlflow|mlflow\.)/g, severity: 'info' },

  // Weights & Biases
  { name: 'Weights & Biases', type: 'framework', pattern: /(?:import\s+wandb|from\s+wandb|wandb\.init)/g, severity: 'info' },
];

// ─── Exposed Token / API Key Patterns ────────────────────────────────────────
const TOKEN_PATTERNS = [
  // OpenAI
  { name: 'OpenAI API Key', type: 'token', pattern: /sk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{20,}/g, severity: 'critical' },
  { name: 'OpenAI API Key (proj)', type: 'token', pattern: /sk-proj-[A-Za-z0-9_-]{30,}/g, severity: 'critical' },
  { name: 'OpenAI API Key (legacy)', type: 'token', pattern: /(?<=['"`\s=:])sk-[A-Za-z0-9]{32,}(?=['"`\s,;\n\r])/g, severity: 'critical' },

  // Anthropic
  { name: 'Anthropic API Key', type: 'token', pattern: /sk-ant-[A-Za-z0-9_-]{30,}/g, severity: 'critical' },

  // Google AI
  { name: 'Google AI API Key', type: 'token', pattern: /AIzaSy[A-Za-z0-9_-]{33}/g, severity: 'critical' },

  // Hugging Face
  { name: 'Hugging Face Token', type: 'token', pattern: /hf_[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // Cohere
  { name: 'Cohere API Key', type: 'token', pattern: /(?<=['"`\s=:])co-[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // Replicate
  { name: 'Replicate API Token', type: 'token', pattern: /r8_[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // Pinecone
  { name: 'Pinecone API Key', type: 'token', pattern: /(?<=['"`\s=:])pc-[A-Za-z0-9]{30,}/g, severity: 'high' },

  // Together AI
  { name: 'Together AI Key', type: 'token', pattern: /(?<=['"`\s=:])tog-[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // Groq
  { name: 'Groq API Key', type: 'token', pattern: /gsk_[A-Za-z0-9]{40,}/g, severity: 'critical' },

  // Mistral
  { name: 'Mistral API Key', type: 'token', pattern: /(?<=['"`\s=:])msrl-[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // AWS Keys
  { name: 'AWS Access Key ID', type: 'token', pattern: /AKIA[0-9A-Z]{16}/g, severity: 'critical' },
  { name: 'AWS Secret Access Key', type: 'token', pattern: /(?<=['"`\s=:])[A-Za-z0-9/+=]{40}(?=['"`\s,;\n\r])/g, severity: 'high' },

  // Azure
  { name: 'Azure API Key', type: 'token', pattern: /(?<=['"`\s=:])[0-9a-f]{32}(?=['"`\s,;\n\r])/g, severity: 'high' },

  // Generic patterns for hardcoded assignments
  { name: 'Hardcoded API Key Assignment', type: 'token', pattern: /(?:api_key|apikey|api_token|apiToken|secret_key|secretKey|access_token|accessToken)\s*[=:]\s*['"][A-Za-z0-9_\-/.+=]{20,}['"]/gi, severity: 'high' },
  { name: 'Bearer Token Hardcoded', type: 'token', pattern: /['"]Bearer\s+[A-Za-z0-9_\-/.+=]{20,}['"]/g, severity: 'high' },
  { name: 'Authorization Header Hardcoded', type: 'token', pattern: /['"](Basic|Token|Api-Key)\s+[A-Za-z0-9_\-/.+=]{20,}['"]/g, severity: 'high' },

  // Weights & Biases
  { name: 'Weights & Biases API Key', type: 'token', pattern: /(?<=['"`\s=:])wandb-[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // LangChain / LangSmith
  { name: 'LangSmith API Key', type: 'token', pattern: /ls__[A-Za-z0-9]{30,}/g, severity: 'critical' },

  // Fireworks AI
  { name: 'Fireworks AI Key', type: 'token', pattern: /fw_[A-Za-z0-9]{30,}/g, severity: 'critical' },
];

// ─── LLM API Endpoint Patterns ───────────────────────────────────────────────
const API_ENDPOINTS = [
  { name: 'OpenAI API Endpoint', type: 'endpoint', pattern: /api\.openai\.com/g, severity: 'info' },
  { name: 'Anthropic API Endpoint', type: 'endpoint', pattern: /api\.anthropic\.com/g, severity: 'info' },
  { name: 'Cohere API Endpoint', type: 'endpoint', pattern: /api\.cohere\.ai/g, severity: 'info' },
  { name: 'Hugging Face API', type: 'endpoint', pattern: /api-inference\.huggingface\.co/g, severity: 'info' },
  { name: 'Replicate API', type: 'endpoint', pattern: /api\.replicate\.com/g, severity: 'info' },
  { name: 'Together API', type: 'endpoint', pattern: /api\.together\.xyz/g, severity: 'info' },
  { name: 'Groq API', type: 'endpoint', pattern: /api\.groq\.com/g, severity: 'info' },
  { name: 'Mistral API', type: 'endpoint', pattern: /api\.mistral\.ai/g, severity: 'info' },
  { name: 'Fireworks API', type: 'endpoint', pattern: /api\.fireworks\.ai/g, severity: 'info' },
  { name: 'Perplexity API', type: 'endpoint', pattern: /api\.perplexity\.ai/g, severity: 'info' },
  { name: 'DeepSeek API', type: 'endpoint', pattern: /api\.deepseek\.com/g, severity: 'info' },
];

// ─── Model Name References ───────────────────────────────────────────────────
const MODEL_REFERENCES = [
  { name: 'GPT-4 / GPT-4o', type: 'model', pattern: /['"]gpt-4[a-z0-9-]*['"]/g, severity: 'info' },
  { name: 'GPT-3.5', type: 'model', pattern: /['"]gpt-3\.5[a-z0-9-]*['"]/g, severity: 'info' },
  { name: 'Claude Models', type: 'model', pattern: /['"]claude-[a-z0-9.-]+['"]/g, severity: 'info' },
  { name: 'Gemini Models', type: 'model', pattern: /['"]gemini-[a-z0-9.-]+['"]/g, severity: 'info' },
  { name: 'Llama Models', type: 'model', pattern: /['"](?:meta-)?llama[a-z0-9.-]*['"]/gi, severity: 'info' },
  { name: 'Mistral Models', type: 'model', pattern: /['"]mistral-[a-z0-9.-]+['"]/g, severity: 'info' },
  { name: 'Command R Models', type: 'model', pattern: /['"]command-r[a-z0-9.-]*['"]/g, severity: 'info' },
];

// ─── Generic Secret / Credential Patterns (non-AI) ──────────────────────────
const GENERIC_SECRETS = [
  // ── Payment & Fintech ──
  { name: 'Stripe Secret Key', type: 'secret', pattern: /sk_live_[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Stripe Restricted Key', type: 'secret', pattern: /rk_live_[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Stripe Publishable Key', type: 'secret', pattern: /pk_live_[A-Za-z0-9]{24,}/g, severity: 'high' },
  { name: 'Stripe Webhook Secret', type: 'secret', pattern: /whsec_[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Square Access Token', type: 'secret', pattern: /sq0atp-[A-Za-z0-9_-]{22,}/g, severity: 'critical' },
  { name: 'Square OAuth Secret', type: 'secret', pattern: /sq0csp-[A-Za-z0-9_-]{40,}/g, severity: 'critical' },
  { name: 'PayPal Braintree Token', type: 'secret', pattern: /access_token\$production\$[A-Za-z0-9]{16,}/g, severity: 'critical' },

  // ── Communication ──
  { name: 'Twilio API Key', type: 'secret', pattern: /SK[0-9a-fA-F]{32}/g, severity: 'critical' },
  { name: 'Twilio Account SID', type: 'secret', pattern: /AC[0-9a-fA-F]{32}/g, severity: 'high' },
  { name: 'SendGrid API Key', type: 'secret', pattern: /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/g, severity: 'critical' },
  { name: 'Mailgun API Key', type: 'secret', pattern: /key-[A-Za-z0-9]{32}/g, severity: 'critical' },
  { name: 'Mailchimp API Key', type: 'secret', pattern: /[a-f0-9]{32}-us[0-9]{1,2}/g, severity: 'critical' },
  { name: 'Postmark Server Token', type: 'secret', pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, severity: 'high' },

  // ── Source Control & CI/CD ──
  { name: 'GitHub Token', type: 'secret', pattern: /ghp_[A-Za-z0-9]{36}/g, severity: 'critical' },
  { name: 'GitHub Fine-Grained Token', type: 'secret', pattern: /github_pat_[A-Za-z0-9_]{30,}/g, severity: 'critical' },
  { name: 'GitHub OAuth', type: 'secret', pattern: /gho_[A-Za-z0-9]{36}/g, severity: 'critical' },
  { name: 'GitHub App Token', type: 'secret', pattern: /(?:ghu|ghs)_[A-Za-z0-9]{36}/g, severity: 'critical' },
  { name: 'GitLab Token', type: 'secret', pattern: /glpat-[A-Za-z0-9_-]{20,}/g, severity: 'critical' },
  { name: 'Bitbucket App Password', type: 'secret', pattern: /ATBB[A-Za-z0-9]{32,}/g, severity: 'critical' },
  { name: 'CircleCI Token', type: 'secret', pattern: /circleci_[A-Za-z0-9]{40}/g, severity: 'critical' },
  { name: 'Travis CI Token', type: 'secret', pattern: /travis-ci\.(?:com|org)\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\.svg\?.*token=[A-Za-z0-9]+/g, severity: 'high' },

  // ── Cloud Providers ──
  { name: 'GCP Service Account Key', type: 'secret', pattern: /"type"\s*:\s*"service_account"/g, severity: 'critical' },
  { name: 'GCP OAuth Client Secret', type: 'secret', pattern: /[0-9]+-[A-Za-z0-9_]{32}\.apps\.googleusercontent\.com/g, severity: 'high' },
  { name: 'DigitalOcean Token', type: 'secret', pattern: /dop_v1_[a-f0-9]{64}/g, severity: 'critical' },
  { name: 'DigitalOcean OAuth Token', type: 'secret', pattern: /doo_v1_[a-f0-9]{64}/g, severity: 'critical' },
  { name: 'Heroku API Key', type: 'secret', pattern: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, severity: 'high' },
  { name: 'Vercel Token', type: 'secret', pattern: /vercel_[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Netlify Token', type: 'secret', pattern: /nfp_[A-Za-z0-9]{40,}/g, severity: 'critical' },
  { name: 'Cloudflare API Token', type: 'secret', pattern: /(?<=['"`\s=:])v1\.[A-Za-z0-9_-]{40,}/g, severity: 'high' },

  // ── Messaging & Chat ──
  { name: 'Slack Bot Token', type: 'secret', pattern: /xoxb-[0-9]{10,}-[0-9]{10,}-[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Slack User Token', type: 'secret', pattern: /xoxp-[0-9]{10,}-[0-9]{10,}-[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Slack Webhook URL', type: 'secret', pattern: /hooks\.slack\.com\/services\/T[A-Z0-9]{8,}\/B[A-Z0-9]{8,}\/[A-Za-z0-9]{24,}/g, severity: 'critical' },
  { name: 'Discord Bot Token', type: 'secret', pattern: /[MN][A-Za-z0-9]{23,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}/g, severity: 'critical' },
  { name: 'Discord Webhook URL', type: 'secret', pattern: /discord(?:app)?\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/g, severity: 'critical' },
  { name: 'Telegram Bot Token', type: 'secret', pattern: /[0-9]{8,10}:[A-Za-z0-9_-]{35}/g, severity: 'critical' },

  // ── Database ──
  { name: 'Database Connection String', type: 'secret', pattern: /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp|mssql):\/\/[^\s'"]{10,}/g, severity: 'critical' },
  { name: 'Supabase API Key', type: 'secret', pattern: /sbp_[A-Za-z0-9]{40,}/g, severity: 'critical' },
  { name: 'Firebase API Key', type: 'secret', pattern: /AIzaSy[A-Za-z0-9_-]{33}/g, severity: 'high' },
  { name: 'PlanetScale Token', type: 'secret', pattern: /pscale_tkn_[A-Za-z0-9_-]{40,}/g, severity: 'critical' },

  // ── Auth & Identity ──
  { name: 'Auth0 Client Secret', type: 'secret', pattern: /(?:auth0_client_secret|AUTH0_CLIENT_SECRET)\s*[=:]\s*['"][A-Za-z0-9_-]{30,}['"]/g, severity: 'critical' },
  { name: 'Okta API Token', type: 'secret', pattern: /00[A-Za-z0-9_-]{40,}/g, severity: 'high' },
  { name: 'Clerk Secret Key', type: 'secret', pattern: /sk_live_[A-Za-z0-9]{40,}/g, severity: 'critical' },

  // ── Monitoring & Analytics ──
  { name: 'Datadog API Key', type: 'secret', pattern: /(?:dd_api_key|DD_API_KEY|datadog_api_key)\s*[=:]\s*['"][a-f0-9]{32}['"]/g, severity: 'critical' },
  { name: 'Sentry DSN', type: 'secret', pattern: /https:\/\/[a-f0-9]{32}@[a-z0-9.]+\.ingest\.sentry\.io\/[0-9]+/g, severity: 'high' },
  { name: 'New Relic License Key', type: 'secret', pattern: /(?:NEW_RELIC_LICENSE_KEY|new_relic_license_key)\s*[=:]\s*['"][A-Za-z0-9]{40}['"]/g, severity: 'critical' },
  { name: 'Segment Write Key', type: 'secret', pattern: /(?:SEGMENT_WRITE_KEY|segment_write_key)\s*[=:]\s*['"][A-Za-z0-9]{24,}['"]/g, severity: 'high' },
  { name: 'Mixpanel Token', type: 'secret', pattern: /(?:MIXPANEL_TOKEN|mixpanel_token)\s*[=:]\s*['"][a-f0-9]{32}['"]/g, severity: 'high' },

  // ── Storage & CDN ──
  { name: 'Cloudinary URL', type: 'secret', pattern: /cloudinary:\/\/[0-9]+:[A-Za-z0-9_-]+@[A-Za-z0-9_-]+/g, severity: 'critical' },
  { name: 'Algolia Admin API Key', type: 'secret', pattern: /(?:ALGOLIA_ADMIN_KEY|algolia_admin_key)\s*[=:]\s*['"][a-f0-9]{32}['"]/g, severity: 'critical' },

  // ── Cryptographic Material ──
  { name: 'RSA Private Key', type: 'secret', pattern: /-----BEGIN RSA PRIVATE KEY-----/g, severity: 'critical' },
  { name: 'EC Private Key', type: 'secret', pattern: /-----BEGIN EC PRIVATE KEY-----/g, severity: 'critical' },
  { name: 'DSA Private Key', type: 'secret', pattern: /-----BEGIN DSA PRIVATE KEY-----/g, severity: 'critical' },
  { name: 'Private Key (Generic)', type: 'secret', pattern: /-----BEGIN PRIVATE KEY-----/g, severity: 'critical' },
  { name: 'PGP Private Key', type: 'secret', pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/g, severity: 'critical' },
  { name: 'SSH Private Key (OpenSSH)', type: 'secret', pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g, severity: 'critical' },

  // ── Generic Credential Patterns ──
  { name: 'Password Assignment', type: 'secret', pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"][^\s'"]{8,}['"]/gi, severity: 'high' },
  { name: 'Secret Assignment', type: 'secret', pattern: /(?:client_secret|CLIENT_SECRET|app_secret|APP_SECRET)\s*[=:]\s*['"][A-Za-z0-9_\-/.+=]{16,}['"]/g, severity: 'high' },
  { name: 'Connection String Assignment', type: 'secret', pattern: /(?:connection_string|CONNECTION_STRING|database_url|DATABASE_URL)\s*[=:]\s*['"][^\s'"]{20,}['"]/g, severity: 'high' },
  { name: 'JWT / Encoded Token', type: 'secret', pattern: /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g, severity: 'high' },
];

module.exports = {
  LLM_SDKS,
  AI_FRAMEWORKS,
  TOKEN_PATTERNS,
  API_ENDPOINTS,
  MODEL_REFERENCES,
  GENERIC_SECRETS,
};