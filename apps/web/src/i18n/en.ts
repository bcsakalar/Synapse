export const en = {
  // ─── Common ───
  common: {
    synapse: "Synapse",
    signIn: "Sign In",
    signUp: "Sign up",
    getStarted: "Get Started",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    generate: "Generate",
    loading: "Loading...",
    active: "Active",
    inactive: "Inactive",
    logout: "Logout",
    loggedOut: "Logged out",
    runs: "runs",
    confirm: "Confirm",
    close: "Close",
    back: "Back",
    next: "Next",
    or: "or",
    yes: "Yes",
    no: "No",
    error: "Error",
    success: "Success",
    select: "Select...",
  },

  // ─── Metadata ───
  metadata: {
    title: "Synapse — AI-Powered Workflow Builder",
    description:
      "Build powerful automations using natural language. Describe what you want, and AI creates the workflow for you.",
  },

  // ─── Landing Page ───
  landing: {
    badge: "AI-Powered Automation",
    heroTitle1: "Build workflows with",
    heroTitle2: "natural language",
    heroDesc:
      "Describe what you want in plain English. Synapse's AI creates the workflow, you visualize and customize it, then it runs automatically.",
    startBuilding: "Start Building",
    featureAI: "AI Workflow Parser",
    featureAIDesc:
      "Describe automations in natural language. Gemini AI parses it into a visual workflow DAG.",
    featureEditor: "Visual Editor",
    featureEditorDesc:
      "Drag-and-drop React Flow canvas. Configure each step, add conditions and branching.",
    featureSecurity: "Self-Hosted & Secure",
    featureSecurityDesc:
      "Run on your own infrastructure. AES-256-GCM encrypted credentials. Full control.",
    footer: "Synapse — Self-hosted AI Workflow Builder",
  },

  // ─── Auth ───
  auth: {
    loginTitle: "Sign in to Synapse",
    loginDesc: "Enter your credentials to continue",
    registerTitle: "Create an account",
    registerDesc: "Start building AI-powered workflows",
    email: "Email",
    password: "Password",
    name: "Name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Your name",
    minChars: "Min 8 characters",
    createAccount: "Create Account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    welcomeBack: "Welcome back!",
    accountCreated: "Account created!",
    loginFailed: "Login failed",
    registrationFailed: "Registration failed",
  },

  // ─── Sidebar ───
  sidebar: {
    dashboard: "Dashboard",
    workflows: "Workflows",
    integrations: "Integrations",
    webhookDebugger: "Webhook Debugger",
    templates: "Templates",
  },

  // ─── Dashboard ───
  dashboard: {
    welcomeBack: "Welcome back",
    overview: "Here's an overview of your automation workspace.",
    workflows: "Workflows",
    active: "Active",
    integrations: "Integrations",
    totalRuns: "Total Runs",
    createWorkflow: "Create Workflow",
    createWorkflowDesc:
      "Describe what you want in natural language and let AI build it for you.",
    newWorkflow: "New Workflow",
    browseTemplates: "Browse Templates",
    browseTemplatesDesc:
      "Start from pre-built workflow templates and customize them.",
    viewTemplates: "View Templates",
  },

  // ─── Workflows ───
  workflows: {
    title: "Workflows",
    subtitle: "Manage your automation workflows",
    newWorkflow: "New Workflow",
    noWorkflows: "No workflows yet",
    noWorkflowsDesc:
      "Create your first workflow using natural language or start from a template.",
    createWorkflow: "Create Workflow",
    deleteConfirm: "Delete this workflow?",
    deleted: "Workflow deleted",
  },

  // ─── Integrations ───
  integrations: {
    title: "Integrations",
    subtitle: "Connect your services to use in workflows",
    addIntegration: "Add Integration",
    provider: "Provider",
    label: "Label",
    clientId: "Client ID",
    clientSecret: "Client Secret",
    botToken: "Bot Token",
    chatId: "Chat ID",
    webhookUrl: "Webhook URL",
    connectGoogle: "Connect with Google",
    saveIntegration: "Save Integration",
    added: "Integration added!",
    removeConfirm: "Remove this integration?",
    removed: "Integration removed",
    noIntegrations:
      "No integrations yet. Add one to start using it in your workflows.",
    failedSave: "Failed to save",
  },

  // ─── Webhooks ───
  webhooks: {
    title: "Webhook Debugger",
    subtitle: "Inspect incoming webhook requests in real-time",
    live: "Live",
    autoRefresh: "Auto-refresh",
    noLogs: "No webhook logs",
    noLogsDesc:
      "Webhook logs will appear here when your endpoints receive requests. Create a workflow with a webhook trigger to get started.",
    headers: "Headers",
    queryParams: "Query Params",
    body: "Body",
  },

  // ─── Templates ───
  templates: {
    title: "Workflow Templates",
    subtitle:
      "Start from a pre-built template. AI will generate the workflow for you.",
    useTemplate: "Use Template",
    generating: "Generating...",
    created: "Workflow created from template!",
    failedCreate: "Failed to create from template",
    // Template items
    tplWebhookTelegram: "Webhook → Telegram",
    tplWebhookTelegramDesc:
      "Receive a webhook and forward the data as a Telegram message.",
    tplWebhookAiEmail: "Webhook → AI Summary → Email",
    tplWebhookAiEmailDesc:
      "Receive data via webhook, summarize with AI, then email the summary.",
    tplWebhookConditionNotify: "Webhook → Condition → Discord/Slack",
    tplWebhookConditionNotifyDesc:
      "Route webhook data to Discord or Slack based on a condition.",
    tplWebhookHttpTransform: "Webhook → HTTP → Transform → Telegram",
    tplWebhookHttpTransformDesc:
      "Fetch data from an API, transform it, and send via Telegram.",
    tplAiPipeline: "AI Processing Pipeline",
    tplAiPipelineDesc:
      "Summarize input with AI, then transform it into a structured format.",
    tplMultiNotify: "Multi-Channel Notification",
    tplMultiNotifyDesc:
      "Send the same message to Telegram, Discord, and Slack simultaneously.",
  },

  // ─── Canvas / Editor ───
  canvas: {
    untitledWorkflow: "Untitled Workflow",
    promptPlaceholder:
      "Describe your workflow... (e.g., 'When webhook fires, summarize with AI, send via Telegram')",
    generated: "Workflow generated by AI!",
    describeFirst: "Please describe your workflow",
    saved: "Workflow saved!",
    saveFirst: "Save the workflow first",
    triggered: "Workflow triggered! Watching execution...",
    deactivated: "Workflow deactivated",
    activated: "Workflow activated!",
    webhookCopied: "Webhook URL copied!",
    failedGenerate: "Failed to generate workflow",
    failedSave: "Failed to save",
    failedToggle: "Failed to toggle",
    failedRun: "Failed to run workflow",
    run: "Run",
    save: "Save",
    generate: "Generate",
  },

  // ─── Node Config Panel ───
  nodeConfig: {
    title: "Node Config",
    unknownType: "Unknown node type",
    noConfig: "No configuration needed for this node.",
    variableHint: "Use {{step.<nodeId>.output.<field>}} to reference outputs",
    nodeLabel: "Node Label",
    customLabel: "Custom label...",
    selectPlaceholder: "Select...",
  },

  // ─── Node Registry (Frontend Labels) ───
  nodes: {
    trigger_webhook: "Webhook Trigger",
    trigger_webhook_desc: "Starts workflow when an HTTP request is received",
    trigger_cron: "Schedule (Cron)",
    trigger_cron_desc: "Starts workflow on a schedule",
    action_gmail_send: "Send Email (Gmail)",
    action_gmail_send_desc: "Send an email using Gmail API",
    action_telegram_msg: "Send Telegram Message",
    action_telegram_msg_desc: "Send a message to a Telegram chat",
    action_discord_msg: "Send Discord Message",
    action_discord_msg_desc: "Send a message via Discord webhook",
    action_slack_msg: "Send Slack Message",
    action_slack_msg_desc: "Send a message to a Slack channel",
    action_http_request: "HTTP Request",
    action_http_request_desc: "Make an HTTP request to any URL",
    action_gemini_summarize: "AI Summarize",
    action_gemini_summarize_desc: "Summarize input data using Gemini AI",
    action_gemini_transform: "AI Transform",
    action_gemini_transform_desc:
      "Transform/process data using Gemini AI with custom instructions",
    logic_condition: "Condition (If/Else)",
    logic_condition_desc: "Branch workflow based on a condition",
    logic_delay: "Delay",
    logic_delay_desc: "Wait for a specified duration before continuing",
    logic_transform: "Data Transform",
    logic_transform_desc: "Map and transform data fields between steps",
    // Config field labels
    httpMethod: "HTTP Method",
    cronExpression: "Cron Expression",
    cronDesc:
      "Standard cron expression (e.g., '0 9 * * 1-5' for weekdays at 9am)",
    to: "To",
    subject: "Subject",
    emailBody: "Body",
    gmailAccount: "Gmail Account",
    message: "Message",
    telegramBot: "Telegram Bot",
    discordMessage: "Message",
    botNameOptional: "Bot Name (optional)",
    discordWebhook: "Discord Webhook",
    slackMessage: "Message",
    slackWebhook: "Slack Webhook",
    url: "URL",
    method: "Method",
    headersJson: "Headers (JSON)",
    bodyJson: "Body (JSON)",
    summarizationPrompt: "Summarization Prompt",
    maxTokens: "Max Tokens",
    instruction: "Instruction",
    outputFormat: "Output Format",
    plainText: "Plain Text",
    json: "JSON",
    markdown: "Markdown",
    variable: "Variable",
    operator: "Operator",
    comparisonValue: "Comparison Value",
    equals: "Equals",
    notEquals: "Not Equals",
    greaterThan: "Greater Than",
    lessThan: "Less Than",
    contains: "Contains",
    exists: "Exists (not null)",
    delayMs: "Delay (ms)",
    fieldMappings: "Field Mappings (JSON)",
  },

  // ─── AI Parser ───
  ai: {
    systemLanguageHint: "Respond with workflow metadata (name, description, labels) in English.",
  },
} as const;

// Deep-widen all literal strings to `string` so other locales can use different values
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationSchema = DeepStringify<typeof en>;
