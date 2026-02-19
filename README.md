<p align="center">
  <img src="https://img.shields.io/badge/Synapse-AI%20Workflow%20Builder-blueviolet?style=for-the-badge&logo=lightning&logoColor=white" alt="Synapse" />
</p>

<h1 align="center">⚡ Synapse</h1>

<p align="center">
  <b>AI-Powered Workflow Automation Builder</b><br/>
  <i>Describe your automation in plain language — Synapse builds, visualizes, and executes it.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/BullMQ-5-EE3A43" alt="BullMQ" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

# 🇹🇷 Türkçe

## Synapse Nedir?

**Synapse**, Make.com ve Zapier benzeri, tamamen **self-hosted** (kendi sunucunuzda barındırabileceğiniz) bir **AI destekli otomasyon ve workflow builder** platformudur.

Kullanıcılar doğal dilde (Türkçe veya İngilizce) otomasyonlarını tarif eder, **Google Gemini 2.5 Flash** yapay zekası bu açıklamayı ayrıştırarak bir **DAG (Directed Acyclic Graph)** oluşturur, **React Flow** ile görsel olarak düzenlenebilir hale getirir ve **BullMQ** motoru ile Redis-backed kuyruk sistemi üzerinden adım adım çalıştırır.

### Neden Synapse?

| Sorun | Synapse Çözümü |
|-------|---------------|
| Make.com/Zapier pahalı | Self-hosted, tamamen ücretsiz |
| Verileriniz 3. parti sunucularda | Kendi sunucunuzda, tam kontrol |
| Karmaşık arayüzler | Doğal dil ile workflow oluşturma |
| Sınırlı entegrasyonlar | Açık kaynak, istediğiniz entegrasyonu ekleyin |
| Vendor lock-in | Docker ile her yere taşınabilir |

---

## ✨ Özellikler

### 🧠 AI ile Workflow Oluşturma
- **Doğal dil girişi**: "Gmail'e gelen mesajı Telegram'a gönder ve Discord'a bildirim at" gibi cümleler yazın
- **Gemini 2.5 Flash**: Google'ın en gelişmiş AI modeli ile yapılandırılmış JSON çıktısı
- **Akıllı düzeltme**: Oluşturulan workflow'u doğal dil ile rafine edin
- **Otomatik DAG oluşturma**: AI, node'ları ve bağlantıları otomatik belirler

### 🎨 Görsel Workflow Editörü
- **React Flow** tabanlı sürükle-bırak canvas
- **12 farklı node tipi** ile zengin otomasyon senaryoları
- **Gerçek zamanlı düğüm durumu**: Çalışan, başarılı, hatalı durumlar renk kodlarıyla gösterilir
- **Koşullu dallanma**: If/Else mantığı ile akış kontrolü
- **Node konfigürasyon paneli**: Her düğümü yan panelden detaylı yapılandırın

### 🔌 5 Yerleşik Entegrasyon
| Entegrasyon | Yetenek | Kimlik Doğrulama |
|-------------|---------|-----------------|
| **Gmail** | E-posta gönderme | OAuth 2.0 |
| **Telegram** | Mesaj gönderme | Bot Token + Chat ID |
| **Discord** | Kanal mesajı | Webhook URL |
| **Slack** | Kanal mesajı | Webhook URL |
| **Custom Webhook** | HTTP endpoint | Otomatik UUID |

### ⚡ Çalıştırma Motoru
- **BullMQ** ile Redis-backed dağıtık iş kuyruğu
- **Adım adım yürütme**: Her node bağımsız olarak çalışır
- **Otomatik retry**: Hata durumunda üstel geri çekilme (exponential backoff)
- **Koşullu dallanma**: Condition node'ları ile true/false dalları
- **Gecikme node'u**: ms cinsinden bekleme
- **Veri dönüşümü**: Adımlar arası veri haritalama
- **Gemini AI node'ları**: Metin özetleme ve veri dönüştürme

### 🔒 Güvenlik
- **AES-256-GCM şifreleme**: Tüm API anahtarları ve kimlik bilgileri veritabanında şifrelenmiş olarak saklanır
- **JWT kimlik doğrulama**: HS256 imzalı, 7 gün geçerli token'lar
- **bcrypt**: 12 round ile parola hashleme
- **Middleware koruması**: Dashboard route'ları otomatik koruma altında

### 📊 İzleme ve Hata Ayıklama
- **Execution Timeline**: Her çalıştırmanın adım adım zaman çizelgesi
- **Webhook Debugger**: Gelen webhook isteklerini gerçek zamanlı izleme
- **Gerçek zamanlı durum**: Polling tabanlı çalıştırma durumu takibi
- **Detaylı loglar**: Her adımın input/output değerleri, süre, hata mesajları

### 🎯 Yaratıcı Ek Özellikler
- **Workflow Templates**: 6 hazır şablon (Email-to-Telegram, API Monitor, vb.)
- **Koşullu Dallanma**: If/Else mantığı ile akış kontrolü
- **Execution Timeline**: Her çalıştırmanın görsel zaman çizelgesi
- **Webhook Debugger**: Real-time istek izleme aracı

---

## 🏗️ Teknik Mimari

### Monorepo Yapısı (Turborepo)

```
synapse/
├── apps/
│   ├── web/                    # Next.js 16 Frontend + API
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Login & Register sayfaları
│   │   │   │   ├── api/        # 20 REST API endpoint
│   │   │   │   │   ├── auth/           # register, login, logout, me
│   │   │   │   │   ├── integrations/   # CRUD + Google OAuth
│   │   │   │   │   ├── workflows/      # CRUD, parse, refine, trigger, runs
│   │   │   │   │   └── webhooks/       # Endpoint handler + logs
│   │   │   │   └── dashboard/  # 8 Dashboard sayfası
│   │   │   ├── components/
│   │   │   │   ├── flow/       # React Flow: canvas, node, config panel
│   │   │   │   ├── dashboard/  # Sidebar
│   │   │   │   └── ui/        # 15 Shadcn UI bileşeni
│   │   │   ├── hooks/          # useExecutionStatus
│   │   │   └── lib/            # auth, ai/workflow-parser, utils
│   │   └── middleware.ts       # JWT route koruması
│   │
│   └── worker/                 # BullMQ İş İşleyici
│       └── src/
│           ├── index.ts        # Trigger + Step worker'ları
│           ├── queues.ts       # Kuyruk tanımları
│           └── executors.ts    # 10 node executor'ü
│
├── packages/
│   └── shared/                 # Paylaşılan Kütüphane
│       ├── prisma/
│       │   └── schema.prisma   # 7 model, 3 enum
│       └── src/
│           ├── crypto.ts       # AES-256-GCM şifreleme
│           ├── db.ts           # Prisma singleton
│           ├── redis.ts        # ioredis bağlantı yönetimi
│           ├── constants.ts    # Node registry (12 tip)
│           ├── schemas/        # Zod validasyon şemaları
│           ├── types/          # TypeScript arayüzleri
│           └── variables.ts    # Template interpolation motoru
│
└── docker/
    ├── docker-compose.yml      # PostgreSQL + Redis + Web + Worker
    ├── Dockerfile.web          # Multi-stage Next.js standalone
    └── Dockerfile.worker       # Multi-stage Node.js worker
```

### Teknoloji Yığını

| Katman | Teknoloji | Versiyon | Açıklama |
|--------|-----------|----------|----------|
| **Frontend** | Next.js (App Router) | 16.1.6 | React Server Components, Turbopack |
| **UI Framework** | React | 19.2.4 | Concurrent features |
| **Stil** | TailwindCSS | 4.2.0 | Utility-first CSS, dark theme |
| **UI Bileşenleri** | Shadcn/Radix UI | Latest | 15 özelleştirilmiş bileşen |
| **Görsel Editör** | @xyflow/react | Latest | React Flow DAG editörü |
| **AI Motor** | Google Gemini | 2.5 Flash | @google/genai SDK |
| **Veritabanı** | PostgreSQL | 17 Alpine | Prisma ORM 5.22 |
| **Cache/Kuyruk** | Redis | 7 Alpine | ioredis 5.x |
| **İş Kuyruğu** | BullMQ | 5.69 | Dağıtık iş işleme |
| **Auth** | jose + bcryptjs | - | JWT HS256 + bcrypt |
| **Şifreleme** | Node.js crypto | - | AES-256-GCM |
| **Monorepo** | Turborepo | 2.4 | npm workspaces |
| **Container** | Docker | - | Multi-stage alpine builds |
| **Dil** | TypeScript | 5.7 | Strict type safety |

### Veritabanı Şeması

```
┌──────────────┐    ┌───────────────────┐    ┌──────────────────┐
│    Users     │───<│   Integrations    │    │    Workflows     │
│              │    │                   │    │                  │
│ id           │    │ id                │    │ id               │
│ email        │    │ userId       (FK) │    │ userId      (FK) │
│ name         │    │ provider          │    │ name             │
│ hashedPassword│   │ encryptedCreds    │    │ description      │
│ createdAt    │    │ iv                │    │ nlPrompt         │
│ updatedAt    │    │ authTag           │    │ nodes (JSON)     │
└──────┬───────┘    │ metadata (JSON)   │    │ edges (JSON)     │
       │            └───────────────────┘    │ dagDefinition    │
       │                                     │ isActive         │
       ├────────────────────────<─────────── │ isTemplate       │
       │                                     └────────┬─────────┘
       │                                              │
       │            ┌───────────────────┐             │
       └───────────>│  WorkflowRuns     │<────────────┘
                    │                   │
                    │ id                │    ┌──────────────────┐
                    │ workflowId   (FK) │───>│ StepExecutions   │
                    │ userId       (FK) │    │                  │
                    │ status            │    │ id               │
                    │ triggerPayload    │    │ runId       (FK) │
                    │ startedAt         │    │ nodeId           │
                    │ completedAt       │    │ nodeName         │
                    │ error             │    │ nodeType         │
                    └───────────────────┘    │ status           │
                                             │ input (JSON)     │
       ┌───────────────────┐                 │ output (JSON)    │
       │ WebhookEndpoints  │                 │ error            │
       │                   │                 │ durationMs       │
       │ id (UUID)         │                 └──────────────────┘
       │ workflowId   (FK) │
       │ userId       (FK) │    ┌──────────────────┐
       │ isActive          │───>│  WebhookLogs     │
       │ lastCalledAt      │    │                  │
       └───────────────────┘    │ endpointId  (FK) │
                                │ method           │
                                │ headers (JSON)   │
                                │ body (JSON)      │
                                │ ip               │
                                └──────────────────┘
```

### API Endpoint'leri

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| `POST` | `/api/auth/register` | Kullanıcı kaydı |
| `POST` | `/api/auth/login` | Giriş (JWT döner) |
| `POST` | `/api/auth/logout` | Çıkış (cookie temizleme) |
| `GET` | `/api/auth/me` | Mevcut kullanıcı bilgisi |
| `GET` | `/api/integrations` | Entegrasyonları listele |
| `POST` | `/api/integrations` | Yeni entegrasyon ekle |
| `DELETE` | `/api/integrations/[id]` | Entegrasyon sil |
| `POST` | `/api/integrations/google/authorize` | Gmail OAuth başlat |
| `GET` | `/api/integrations/google/callback` | Gmail OAuth callback |
| `GET` | `/api/workflows` | Workflow'ları listele |
| `POST` | `/api/workflows` | Yeni workflow oluştur |
| `GET` | `/api/workflows/[id]` | Workflow detayı |
| `PUT` | `/api/workflows/[id]` | Workflow güncelle |
| `DELETE` | `/api/workflows/[id]` | Workflow sil |
| `POST` | `/api/workflows/parse` | Doğal dili DAG'a çevir (AI) |
| `POST` | `/api/workflows/refine` | Mevcut DAG'ı düzelt (AI) |
| `POST` | `/api/workflows/[id]/trigger` | Workflow'u manuel çalıştır |
| `GET` | `/api/workflows/[id]/runs` | Çalıştırma geçmişi |
| `GET` | `/api/workflows/[id]/runs/[runId]` | Çalıştırma detayı |
| `GET` | `/api/workflows/runs/[runId]/status` | Gerçek zamanlı durum |
| `POST/GET` | `/api/webhooks/[endpointId]` | Public webhook endpoint |
| `GET` | `/api/webhooks/logs` | Webhook logları |

### Node Tipleri (12 Adet)

| Kategori | Tip | Açıklama |
|----------|-----|----------|
| **Trigger** | `trigger_webhook` | Gelen HTTP isteği ile tetikleme |
| **Trigger** | `trigger_schedule` | Zamanlanmış tetikleme |
| **Action** | `action_gmail_send` | Gmail ile e-posta gönderme |
| **Action** | `action_telegram_msg` | Telegram bot ile mesaj gönderme |
| **Action** | `action_discord_msg` | Discord webhook ile mesaj gönderme |
| **Action** | `action_slack_msg` | Slack webhook ile mesaj gönderme |
| **Action** | `action_http_request` | Herhangi bir HTTP API çağrısı |
| **AI** | `action_gemini_summarize` | Gemini ile metin özetleme |
| **AI** | `action_gemini_transform` | Gemini ile veri dönüştürme |
| **Logic** | `logic_condition` | If/Else koşul dallanması |
| **Logic** | `logic_delay` | Gecikme (ms cinsinden) |
| **Logic** | `logic_transform` | Veri haritalama ve dönüştürme |

### Güvenlik Mimarisi

```
Kullanıcı Girişi
       │
       ▼
  [bcrypt 12-round]  →  hashedPassword  →  PostgreSQL
       │
       ▼
  [JWT HS256 Sign]   →  HTTP-Only Cookie  →  Tarayıcı
       │
       ▼
  [Middleware]        →  Route Koruması   →  /dashboard/*

API Anahtarları / Kimlik Bilgileri
       │
       ▼
  [AES-256-GCM]      →  ciphertext + iv + authTag  →  PostgreSQL
       │                          │
       ▼                          ▼
  Worker Çalıştırma   →  [Decrypt in-memory]  →  API Çağrısı  →  Sil
```

### Workflow Çalıştırma Akışı

```
1. Kullanıcı "Run" butonuna tıklar veya Webhook tetiklenir
                    │
2. API → WorkflowRun kaydı oluştur (status: PENDING)
                    │
3. BullMQ'ya "synapse-triggers" kuyruğuna iş ekle
                    │
4. Trigger Worker iş alır:
   ├── Run status → RUNNING
   ├── DAG'ı parse et
   ├── Tüm node'lar için StepExecution kaydı oluştur
   ├── Trigger node → SUCCESS (output = triggerData)
   └── Downstream node'ları "synapse-steps" kuyruğuna ekle
                    │
5. Step Worker her adımı işler:
   ├── StepExecution status → RUNNING
   ├── Önceki adımların çıktılarını birleştir
   ├── Executor'ü çalıştır (Gmail/Telegram/HTTP/AI/...)
   ├── Condition ise → true/false dalını belirle, diğerini SKIP
   ├── StepExecution status → SUCCESS/FAILED
   └── Downstream node'ları kuyruğa ekle
                    │
6. Tüm adımlar tamamlanınca:
   └── WorkflowRun status → COMPLETED/PARTIAL/FAILED
```

---

## 📸 Ekran Görüntüleri

> _Ekran görüntüleri eklenecek._

---

## 🚀 Hızlı Başlangıç

Detaylı kurulum ve çalıştırma talimatları için [SERVER.md](SERVER.md) dosyasına bakın.

```bash
# 1. Repo'yu klonla
git clone https://github.com/YOUR_USERNAME/synapse.git
cd synapse

# 2. Bağımlılıkları yükle
npm install

# 3. .env dosyasını düzenle
cp .env.example .env
# GEMINI_API_KEY, JWT_SECRET, ENCRYPTION_KEY ayarla

# 4. Docker ile veritabanlarını başlat
docker compose -f docker/docker-compose.yml up -d postgres redis

# 5. Veritabanı tablolarını oluştur
npx prisma generate --schema=packages/shared/prisma/schema.prisma
npx prisma db push --schema=packages/shared/prisma/schema.prisma

# 6. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda **http://localhost:3099** adresine gidin.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

---

# 🇬🇧 English

## What is Synapse?

**Synapse** is a fully **self-hosted**, **AI-powered workflow automation builder** — an open-source alternative to Make.com and Zapier.

Users describe their automations in **plain natural language** (English or Turkish), **Google Gemini 2.5 Flash** AI parses the description into a **DAG (Directed Acyclic Graph)**, **React Flow** provides a visual drag-and-drop editor, and **BullMQ** executes each step through a Redis-backed distributed job queue.

### Why Synapse?

| Problem | Synapse Solution |
|---------|-----------------|
| Make.com/Zapier is expensive | Self-hosted, completely free |
| Your data on 3rd-party servers | Your server, full control |
| Complex interfaces | Create workflows with natural language |
| Limited integrations | Open source — add any integration |
| Vendor lock-in | Docker-portable anywhere |

---

## ✨ Features

### 🧠 AI-Powered Workflow Creation
- **Natural language input**: Write sentences like "Forward Gmail messages to Telegram and notify Discord"
- **Gemini 2.5 Flash**: Google's advanced AI model with structured JSON output
- **Smart refinement**: Refine generated workflows with natural language
- **Automatic DAG generation**: AI determines nodes and connections automatically

### 🎨 Visual Workflow Editor
- **React Flow** based drag-and-drop canvas
- **12 different node types** for rich automation scenarios
- **Real-time node status**: Running, success, error states shown with color codes
- **Conditional branching**: Flow control with If/Else logic
- **Node configuration panel**: Configure each node from a side panel

### 🔌 5 Built-in Integrations
| Integration | Capability | Authentication |
|-------------|-----------|---------------|
| **Gmail** | Send emails | OAuth 2.0 |
| **Telegram** | Send messages | Bot Token + Chat ID |
| **Discord** | Channel messages | Webhook URL |
| **Slack** | Channel messages | Webhook URL |
| **Custom Webhook** | HTTP endpoint | Automatic UUID |

### ⚡ Execution Engine
- **BullMQ** with Redis-backed distributed job queue
- **Step-by-step execution**: Each node runs independently
- **Automatic retry**: Exponential backoff on failures
- **Conditional branching**: True/false branches with condition nodes
- **Delay node**: Wait for a specified duration (ms)
- **Data transformation**: Inter-step data mapping
- **Gemini AI nodes**: Text summarization and data transformation

### 🔒 Security
- **AES-256-GCM encryption**: All API keys and credentials stored encrypted in the database
- **JWT authentication**: HS256-signed tokens, 7-day validity
- **bcrypt**: 12-round password hashing
- **Middleware protection**: Dashboard routes automatically protected

### 📊 Monitoring & Debugging
- **Execution Timeline**: Step-by-step timeline for each run
- **Webhook Debugger**: Real-time incoming webhook request monitoring
- **Real-time status**: Polling-based execution status tracking
- **Detailed logs**: Input/output values, duration, error messages for each step

### 🎯 Creative Add-ons
- **Workflow Templates**: 6 ready-made templates (Email-to-Telegram, API Monitor, etc.)
- **Conditional Branching**: If/Else logic for flow control
- **Execution Timeline**: Visual timeline for each run
- **Webhook Debugger**: Real-time request inspection tool

---

## 🏗️ Technical Architecture

### Monorepo Structure (Turborepo)

```
synapse/
├── apps/
│   ├── web/                    # Next.js 16 Frontend + API
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Login & Register pages
│   │   │   │   ├── api/        # 20 REST API endpoints
│   │   │   │   │   ├── auth/           # register, login, logout, me
│   │   │   │   │   ├── integrations/   # CRUD + Google OAuth
│   │   │   │   │   ├── workflows/      # CRUD, parse, refine, trigger, runs
│   │   │   │   │   └── webhooks/       # Endpoint handler + logs
│   │   │   │   └── dashboard/  # 8 Dashboard pages
│   │   │   ├── components/
│   │   │   │   ├── flow/       # React Flow: canvas, node, config panel
│   │   │   │   ├── dashboard/  # Sidebar
│   │   │   │   └── ui/        # 15 Shadcn UI components
│   │   │   ├── hooks/          # useExecutionStatus
│   │   │   └── lib/            # auth, ai/workflow-parser, utils
│   │   └── middleware.ts       # JWT route protection
│   │
│   └── worker/                 # BullMQ Job Processor
│       └── src/
│           ├── index.ts        # Trigger + Step workers
│           ├── queues.ts       # Queue definitions
│           └── executors.ts    # 10 node executors
│
├── packages/
│   └── shared/                 # Shared Library
│       ├── prisma/
│       │   └── schema.prisma   # 7 models, 3 enums
│       └── src/
│           ├── crypto.ts       # AES-256-GCM encryption
│           ├── db.ts           # Prisma singleton
│           ├── redis.ts        # ioredis connection manager
│           ├── constants.ts    # Node registry (12 types)
│           ├── schemas/        # Zod validation schemas
│           ├── types/          # TypeScript interfaces
│           └── variables.ts    # Template interpolation engine
│
└── docker/
    ├── docker-compose.yml      # PostgreSQL + Redis + Web + Worker
    ├── Dockerfile.web          # Multi-stage Next.js standalone
    └── Dockerfile.worker       # Multi-stage Node.js worker
```

### Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js (App Router) | 16.1.6 | React Server Components, Turbopack |
| **UI Framework** | React | 19.2.4 | Concurrent features |
| **Styling** | TailwindCSS | 4.2.0 | Utility-first CSS, dark theme |
| **UI Components** | Shadcn/Radix UI | Latest | 15 customized components |
| **Visual Editor** | @xyflow/react | Latest | React Flow DAG editor |
| **AI Engine** | Google Gemini | 2.5 Flash | @google/genai SDK |
| **Database** | PostgreSQL | 17 Alpine | Prisma ORM 5.22 |
| **Cache/Queue** | Redis | 7 Alpine | ioredis 5.x |
| **Job Queue** | BullMQ | 5.69 | Distributed job processing |
| **Auth** | jose + bcryptjs | - | JWT HS256 + bcrypt |
| **Encryption** | Node.js crypto | - | AES-256-GCM |
| **Monorepo** | Turborepo | 2.4 | npm workspaces |
| **Container** | Docker | - | Multi-stage alpine builds |
| **Language** | TypeScript | 5.7 | Strict type safety |

### Database Schema

```
┌──────────────┐    ┌───────────────────┐    ┌──────────────────┐
│    Users     │───<│   Integrations    │    │    Workflows     │
│              │    │                   │    │                  │
│ id           │    │ id                │    │ id               │
│ email        │    │ userId       (FK) │    │ userId      (FK) │
│ name         │    │ provider          │    │ name             │
│ hashedPassword│   │ encryptedCreds    │    │ description      │
│ createdAt    │    │ iv                │    │ nlPrompt         │
│ updatedAt    │    │ authTag           │    │ nodes (JSON)     │
└──────┬───────┘    │ metadata (JSON)   │    │ edges (JSON)     │
       │            └───────────────────┘    │ dagDefinition    │
       │                                     │ isActive         │
       ├────────────────────────<─────────── │ isTemplate       │
       │                                     └────────┬─────────┘
       │                                              │
       │            ┌───────────────────┐             │
       └───────────>│  WorkflowRuns     │<────────────┘
                    │                   │
                    │ id                │    ┌──────────────────┐
                    │ workflowId   (FK) │───>│ StepExecutions   │
                    │ userId       (FK) │    │                  │
                    │ status            │    │ id               │
                    │ triggerPayload    │    │ runId       (FK) │
                    │ startedAt         │    │ nodeId           │
                    │ completedAt       │    │ nodeName         │
                    │ error             │    │ nodeType         │
                    └───────────────────┘    │ status           │
                                             │ input (JSON)     │
       ┌───────────────────┐                 │ output (JSON)    │
       │ WebhookEndpoints  │                 │ error            │
       │                   │                 │ durationMs       │
       │ id (UUID)         │                 └──────────────────┘
       │ workflowId   (FK) │
       │ userId       (FK) │    ┌──────────────────┐
       │ isActive          │───>│  WebhookLogs     │
       │ lastCalledAt      │    │                  │
       └───────────────────┘    │ endpointId  (FK) │
                                │ method           │
                                │ headers (JSON)   │
                                │ body (JSON)      │
                                │ ip               │
                                └──────────────────┘
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | Login (returns JWT) |
| `POST` | `/api/auth/logout` | Logout (clears cookie) |
| `GET` | `/api/auth/me` | Current user info |
| `GET` | `/api/integrations` | List integrations |
| `POST` | `/api/integrations` | Add new integration |
| `DELETE` | `/api/integrations/[id]` | Delete integration |
| `POST` | `/api/integrations/google/authorize` | Start Gmail OAuth |
| `GET` | `/api/integrations/google/callback` | Gmail OAuth callback |
| `GET` | `/api/workflows` | List workflows |
| `POST` | `/api/workflows` | Create new workflow |
| `GET` | `/api/workflows/[id]` | Workflow detail |
| `PUT` | `/api/workflows/[id]` | Update workflow |
| `DELETE` | `/api/workflows/[id]` | Delete workflow |
| `POST` | `/api/workflows/parse` | Convert natural language to DAG (AI) |
| `POST` | `/api/workflows/refine` | Refine existing DAG (AI) |
| `POST` | `/api/workflows/[id]/trigger` | Trigger workflow manually |
| `GET` | `/api/workflows/[id]/runs` | Run history |
| `GET` | `/api/workflows/[id]/runs/[runId]` | Run detail |
| `GET` | `/api/workflows/runs/[runId]/status` | Real-time status |
| `POST/GET` | `/api/webhooks/[endpointId]` | Public webhook endpoint |
| `GET` | `/api/webhooks/logs` | Webhook logs |

### Node Types (12)

| Category | Type | Description |
|----------|------|-------------|
| **Trigger** | `trigger_webhook` | Trigger via incoming HTTP request |
| **Trigger** | `trigger_schedule` | Scheduled trigger |
| **Action** | `action_gmail_send` | Send email via Gmail |
| **Action** | `action_telegram_msg` | Send message via Telegram bot |
| **Action** | `action_discord_msg` | Send message via Discord webhook |
| **Action** | `action_slack_msg` | Send message via Slack webhook |
| **Action** | `action_http_request` | Call any HTTP API |
| **AI** | `action_gemini_summarize` | Summarize text with Gemini |
| **AI** | `action_gemini_transform` | Transform data with Gemini |
| **Logic** | `logic_condition` | If/Else conditional branching |
| **Logic** | `logic_delay` | Wait for specified duration (ms) |
| **Logic** | `logic_transform` | Data mapping and transformation |

### Security Architecture

```
User Login
       │
       ▼
  [bcrypt 12-round]  →  hashedPassword  →  PostgreSQL
       │
       ▼
  [JWT HS256 Sign]   →  HTTP-Only Cookie  →  Browser
       │
       ▼
  [Middleware]        →  Route Protection  →  /dashboard/*

API Keys / Credentials
       │
       ▼
  [AES-256-GCM]      →  ciphertext + iv + authTag  →  PostgreSQL
       │                          │
       ▼                          ▼
  Worker Execution    →  [Decrypt in-memory]  →  API Call  →  Discard
```

### Workflow Execution Flow

```
1. User clicks "Run" or Webhook is triggered
                    │
2. API → Create WorkflowRun record (status: PENDING)
                    │
3. Add job to BullMQ "synapse-triggers" queue
                    │
4. Trigger Worker processes job:
   ├── Run status → RUNNING
   ├── Parse the DAG
   ├── Create StepExecution records for ALL nodes
   ├── Trigger node → SUCCESS (output = triggerData)
   └── Enqueue downstream nodes to "synapse-steps" queue
                    │
5. Step Worker processes each step:
   ├── StepExecution status → RUNNING
   ├── Accumulate outputs from previous steps
   ├── Execute the node (Gmail/Telegram/HTTP/AI/...)
   ├── If Condition → determine true/false branch, SKIP the other
   ├── StepExecution status → SUCCESS/FAILED
   └── Enqueue downstream nodes
                    │
6. When all steps complete:
   └── WorkflowRun status → COMPLETED/PARTIAL/FAILED
```

---

## 📸 Screenshots

> _Screenshots will be added._

---

## 🚀 Quick Start

For detailed setup and deployment instructions, see [SERVER.md](SERVER.md).

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/synapse.git
cd synapse

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Set GEMINI_API_KEY, JWT_SECRET, ENCRYPTION_KEY

# 4. Start databases with Docker
docker compose -f docker/docker-compose.yml up -d postgres redis

# 5. Create database tables
npx prisma generate --schema=packages/shared/prisma/schema.prisma
npx prisma db push --schema=packages/shared/prisma/schema.prisma

# 6. Start development server
npm run dev
```

Open **http://localhost:3099** in your browser.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with ⚡ by Synapse</b><br/>
  <i>Self-hosted AI workflow automation for everyone.</i>
</p>
