import type { TranslationSchema } from "./en";

export const tr: TranslationSchema = {
  // ─── Ortak ───
  common: {
    synapse: "Synapse",
    signIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    getStarted: "Başla",
    save: "Kaydet",
    delete: "Sil",
    cancel: "İptal",
    generate: "Oluştur",
    loading: "Yükleniyor...",
    active: "Aktif",
    inactive: "Pasif",
    logout: "Çıkış",
    loggedOut: "Çıkış yapıldı",
    runs: "çalışma",
    confirm: "Onayla",
    close: "Kapat",
    back: "Geri",
    next: "İleri",
    or: "veya",
    yes: "Evet",
    no: "Hayır",
    error: "Hata",
    success: "Başarılı",
    select: "Seçiniz...",
  },

  // ─── Meta Bilgi ───
  metadata: {
    title: "Synapse — Yapay Zeka Destekli İş Akışı Oluşturucu",
    description:
      "Doğal dil kullanarak güçlü otomasyonlar oluşturun. Ne istediğinizi tanımlayın, yapay zeka iş akışını sizin için oluştursun.",
  },

  // ─── Ana Sayfa ───
  landing: {
    badge: "Yapay Zeka Destekli Otomasyon",
    heroTitle1: "İş akışlarını oluşturun",
    heroTitle2: "doğal dille",
    heroDesc:
      "Ne istediğinizi düz metin olarak tanımlayın. Synapse'ın yapay zekası iş akışını oluşturur, siz görselleştirip özelleştirirsiniz, sonra otomatik çalışır.",
    startBuilding: "Oluşturmaya Başla",
    featureAI: "Yapay Zeka İş Akışı Ayrıştırıcı",
    featureAIDesc:
      "Otomasyonları doğal dilde tanımlayın. Gemini AI bunları görsel iş akışı DAG'ına dönüştürür.",
    featureEditor: "Görsel Editör",
    featureEditorDesc:
      "Sürükle-bırak React Flow kanvası. Her adımı yapılandırın, koşullar ve dallanmalar ekleyin.",
    featureSecurity: "Kendi Sunucunuz & Güvenli",
    featureSecurityDesc:
      "Kendi altyapınızda çalıştırın. AES-256-GCM şifreli kimlik bilgileri. Tam kontrol.",
    footer: "Synapse — Kendi Sunucunuzda Yapay Zeka İş Akışı Oluşturucu",
  },

  // ─── Kimlik Doğrulama ───
  auth: {
    loginTitle: "Synapse'a Giriş Yap",
    loginDesc: "Devam etmek için bilgilerinizi girin",
    registerTitle: "Hesap Oluştur",
    registerDesc: "Yapay zeka destekli iş akışları oluşturmaya başlayın",
    email: "E-posta",
    password: "Şifre",
    name: "Ad",
    emailPlaceholder: "ornek@email.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Adınız",
    minChars: "En az 8 karakter",
    createAccount: "Hesap Oluştur",
    noAccount: "Hesabınız yok mu?",
    hasAccount: "Zaten hesabınız var mı?",
    welcomeBack: "Tekrar hoş geldiniz!",
    accountCreated: "Hesap oluşturuldu!",
    loginFailed: "Giriş başarısız",
    registrationFailed: "Kayıt başarısız",
  },

  // ─── Kenar Çubuğu ───
  sidebar: {
    dashboard: "Gösterge Paneli",
    workflows: "İş Akışları",
    integrations: "Entegrasyonlar",
    webhookDebugger: "Webhook Hata Ayıklayıcı",
    templates: "Şablonlar",
  },

  // ─── Gösterge Paneli ───
  dashboard: {
    welcomeBack: "Tekrar hoş geldiniz",
    overview: "Otomasyon çalışma alanınızın genel görünümü.",
    workflows: "İş Akışları",
    active: "Aktif",
    integrations: "Entegrasyonlar",
    totalRuns: "Toplam Çalışma",
    createWorkflow: "İş Akışı Oluştur",
    createWorkflowDesc:
      "Ne istediğinizi doğal dilde tanımlayın ve yapay zekanın sizin için oluşturmasını sağlayın.",
    newWorkflow: "Yeni İş Akışı",
    browseTemplates: "Şablonlara Göz At",
    browseTemplatesDesc:
      "Hazır iş akışı şablonlarından başlayın ve özelleştirin.",
    viewTemplates: "Şablonları Görüntüle",
  },

  // ─── İş Akışları ───
  workflows: {
    title: "İş Akışları",
    subtitle: "Otomasyon iş akışlarınızı yönetin",
    newWorkflow: "Yeni İş Akışı",
    noWorkflows: "Henüz iş akışı yok",
    noWorkflowsDesc:
      "Doğal dil kullanarak ilk iş akışınızı oluşturun veya bir şablondan başlayın.",
    createWorkflow: "İş Akışı Oluştur",
    deleteConfirm: "Bu iş akışını silmek istediğinize emin misiniz?",
    deleted: "İş akışı silindi",
  },

  // ─── Entegrasyonlar ───
  integrations: {
    title: "Entegrasyonlar",
    subtitle: "İş akışlarında kullanmak için servislerinizi bağlayın",
    addIntegration: "Entegrasyon Ekle",
    provider: "Sağlayıcı",
    label: "Etiket",
    clientId: "İstemci Kimliği",
    clientSecret: "İstemci Gizli Anahtarı",
    botToken: "Bot Tokeni",
    chatId: "Sohbet Kimliği",
    webhookUrl: "Webhook URL",
    connectGoogle: "Google ile Bağlan",
    saveIntegration: "Entegrasyonu Kaydet",
    added: "Entegrasyon eklendi!",
    removeConfirm: "Bu entegrasyonu kaldırmak istediğinize emin misiniz?",
    removed: "Entegrasyon kaldırıldı",
    noIntegrations:
      "Henüz entegrasyon yok. İş akışlarınızda kullanmak için bir tane ekleyin.",
    failedSave: "Kaydetme başarısız",
  },

  // ─── Webhooklar ───
  webhooks: {
    title: "Webhook Hata Ayıklayıcı",
    subtitle: "Gelen webhook isteklerini gerçek zamanlı inceleyin",
    live: "Canlı",
    autoRefresh: "Otomatik yenile",
    noLogs: "Webhook kaydı yok",
    noLogsDesc:
      "Uç noktalarınız istek aldığında webhook kayıtları burada görünecektir. Başlamak için webhook tetikleyicili bir iş akışı oluşturun.",
    headers: "Başlıklar",
    queryParams: "Sorgu Parametreleri",
    body: "Gövde",
  },

  // ─── Şablonlar ───
  templates: {
    title: "İş Akışı Şablonları",
    subtitle:
      "Hazır bir şablondan başlayın. Yapay zeka iş akışını sizin için oluşturacak.",
    useTemplate: "Şablonu Kullan",
    generating: "Oluşturuluyor...",
    created: "Şablondan iş akışı oluşturuldu!",
    failedCreate: "Şablondan oluşturma başarısız",
    // Şablon öğeleri
    tplWebhookTelegram: "Webhook → Telegram",
    tplWebhookTelegramDesc:
      "Bir webhook alın ve verileri Telegram mesajı olarak iletin.",
    tplWebhookAiEmail: "Webhook → AI Özet → E-posta",
    tplWebhookAiEmailDesc:
      "Webhook ile veri alın, yapay zeka ile özetleyin, sonra özeti e-postayla gönderin.",
    tplWebhookConditionNotify: "Webhook → Koşul → Discord/Slack",
    tplWebhookConditionNotifyDesc:
      "Webhook verilerini bir koşula göre Discord veya Slack'e yönlendirin.",
    tplWebhookHttpTransform: "Webhook → HTTP → Dönüştür → Telegram",
    tplWebhookHttpTransformDesc:
      "Bir API'den veri çekin, dönüştürün ve Telegram ile gönderin.",
    tplAiPipeline: "Yapay Zeka İşlem Hattı",
    tplAiPipelineDesc:
      "Girdiyi yapay zeka ile özetleyin, sonra yapılandırılmış bir formata dönüştürün.",
    tplMultiNotify: "Çok Kanallı Bildirim",
    tplMultiNotifyDesc:
      "Aynı mesajı Telegram, Discord ve Slack'e aynı anda gönderin.",
  },

  // ─── Kanvas / Editör ───
  canvas: {
    untitledWorkflow: "İsimsiz İş Akışı",
    promptPlaceholder:
      "İş akışınızı tanımlayın... (ör. 'Webhook tetiklendiğinde, yapay zeka ile özetle, Telegram ile gönder')",
    generated: "İş akışı yapay zeka tarafından oluşturuldu!",
    describeFirst: "Lütfen iş akışınızı tanımlayın",
    saved: "İş akışı kaydedildi!",
    saveFirst: "Önce iş akışını kaydedin",
    triggered: "İş akışı tetiklendi! Çalışma izleniyor...",
    deactivated: "İş akışı devre dışı bırakıldı",
    activated: "İş akışı aktifleştirildi!",
    webhookCopied: "Webhook URL kopyalandı!",
    failedGenerate: "İş akışı oluşturma başarısız",
    failedSave: "Kaydetme başarısız",
    failedToggle: "Durum değiştirme başarısız",
    failedRun: "İş akışı çalıştırma başarısız",
    run: "Çalıştır",
    save: "Kaydet",
    generate: "Oluştur",
  },

  // ─── Node Yapılandırma Paneli ───
  nodeConfig: {
    title: "Node Yapılandırma",
    unknownType: "Bilinmeyen node tipi",
    noConfig: "Bu node için yapılandırma gerekmiyor.",
    variableHint:
      "Çıktılara referans vermek için {{step.<nodeId>.output.<field>}} kullanın",
    nodeLabel: "Node Etiketi",
    customLabel: "Özel etiket...",
    selectPlaceholder: "Seçin...",
  },

  // ─── Node Kayıt Defteri (Ön Yüz Etiketleri) ───
  nodes: {
    trigger_webhook: "Webhook Tetikleyici",
    trigger_webhook_desc: "HTTP isteği alındığında iş akışını başlatır",
    trigger_cron: "Zamanlama (Cron)",
    trigger_cron_desc: "İş akışını bir programa göre başlatır",
    action_gmail_send: "E-posta Gönder (Gmail)",
    action_gmail_send_desc: "Gmail API kullanarak e-posta gönderin",
    action_telegram_msg: "Telegram Mesajı Gönder",
    action_telegram_msg_desc: "Bir Telegram sohbetine mesaj gönderin",
    action_discord_msg: "Discord Mesajı Gönder",
    action_discord_msg_desc: "Discord webhook ile mesaj gönderin",
    action_slack_msg: "Slack Mesajı Gönder",
    action_slack_msg_desc: "Bir Slack kanalına mesaj gönderin",
    action_http_request: "HTTP İsteği",
    action_http_request_desc: "Herhangi bir URL'ye HTTP isteği yapın",
    action_gemini_summarize: "AI Özetleme",
    action_gemini_summarize_desc: "Gemini AI kullanarak girdi verilerini özetleyin",
    action_gemini_transform: "AI Dönüştürme",
    action_gemini_transform_desc:
      "Gemini AI ile özel talimatlar kullanarak verileri dönüştürün/işleyin",
    logic_condition: "Koşul (Eğer/Değilse)",
    logic_condition_desc: "Bir koşula göre iş akışını dallandırın",
    logic_delay: "Gecikme",
    logic_delay_desc: "Devam etmeden önce belirtilen süre kadar bekleyin",
    logic_transform: "Veri Dönüştürme",
    logic_transform_desc: "Adımlar arasında veri alanlarını eşleyin ve dönüştürün",
    // Yapılandırma alan etiketleri
    httpMethod: "HTTP Metodu",
    cronExpression: "Cron İfadesi",
    cronDesc:
      "Standart cron ifadesi (ör. '0 9 * * 1-5' hafta içi sabah 9'da)",
    to: "Kime",
    subject: "Konu",
    emailBody: "Gövde",
    gmailAccount: "Gmail Hesabı",
    message: "Mesaj",
    telegramBot: "Telegram Botu",
    discordMessage: "Mesaj",
    botNameOptional: "Bot Adı (isteğe bağlı)",
    discordWebhook: "Discord Webhook",
    slackMessage: "Mesaj",
    slackWebhook: "Slack Webhook",
    url: "URL",
    method: "Metod",
    headersJson: "Başlıklar (JSON)",
    bodyJson: "Gövde (JSON)",
    summarizationPrompt: "Özetleme Promptu",
    maxTokens: "Maks Token",
    instruction: "Talimat",
    outputFormat: "Çıktı Formatı",
    plainText: "Düz Metin",
    json: "JSON",
    markdown: "Markdown",
    variable: "Değişken",
    operator: "Operatör",
    comparisonValue: "Karşılaştırma Değeri",
    equals: "Eşittir",
    notEquals: "Eşit Değildir",
    greaterThan: "Büyüktür",
    lessThan: "Küçüktür",
    contains: "İçerir",
    exists: "Var (null değil)",
    delayMs: "Gecikme (ms)",
    fieldMappings: "Alan Eşlemeleri (JSON)",
  },

  // ─── Yapay Zeka Ayrıştırıcı ───
  ai: {
    systemLanguageHint:
      "İş akışı meta verilerini (ad, açıklama, etiketler) Türkçe olarak yanıtla.",
  },
} as const;
