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

module.exports = {
  LLM_SDKS,
  AI_FRAMEWORKS,
  TOKEN_PATTERNS,
  API_ENDPOINTS,
  MODEL_REFERENCES,
};
