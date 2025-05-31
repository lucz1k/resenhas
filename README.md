
# 📱 ResenhaApp - Assistente Operacional via WhatsApp

O **ResenhaApp** é um assistente automatizado para elaboração de ocorrências policiais via WhatsApp. Ele coleta os dados operacionais por etapas e, ao final, gera uma resenha estruturada, formatada e salva no Google Drive, além de reenviar o conteúdo final ao usuário no próprio WhatsApp.

---

## 🚀 Funcionalidades

- Coleta guiada por etapas (fluxo conversacional)
- Reconhecimento inteligente de datas, horários e endereços
- Integração com OpenAI para formatação do histórico final
- Integração com a Z-API para envio e recebimento de mensagens WhatsApp
- Salvamento automático da resenha no Google Drive
- Proteção contra abuso e controle por número

---

## ⚙️ Tecnologias Utilizadas

- Node.js + Express
- MongoDB (via Mongoose)
- OpenAI API (via proxy protegido)
- Z-API (WhatsApp Gateway)
- Google Drive API
- Render (deploy backend)

---

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/resenhaapp.git
cd resenhaapp
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env`

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@seubanco.mongodb.net/resenhaapp

ZAPI_INSTANCE_ID=xxxxxxxxxxxxxxxxxxxxxx
ZAPI_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

OPENAI_PROXY_URL=https://seu-proxy-render.com/v1/chat/completions
OPENAI_MODEL=gpt-3.5-turbo

GOOGLE_CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ Atenção ao formato da `GOOGLE_PRIVATE_KEY`, mantenha o `\n` nas quebras de linha.

---

## ▶️ Execução local

```bash
npm start
```

---

## 🌐 Webhook

Configure seu provedor de Z-API com o endpoint do seu backend:

```
https://SEU_BACKEND.onrender.com/api/resenha/webhook/whatsapp
```

---

## 📁 Estrutura de Pastas

```text
.
├── controllers
│   └── resenhaController.js
├── fluxo
│   ├── etapasFluxo.js
│   ├── executores.js
│   └── tipos/
├── services
│   ├── zapi.js
│   ├── openai.js
│   └── drive.js
├── db
│   └── progresso.js
├── utils
│   └── proxy.js
├── routes
│   └── resenha.js
├── models.js
├── formatadorResenha.js
├── montarResenhaFinal.js
├── index.js
└── .env
```

---

## 📌 To Do

- [x] Fluxo completo de coleta
- [x] Integração com OpenAI
- [x] Envio da resenha final no WhatsApp
- [x] Salvamento no Google Drive
- [ ] Exportar como PDF direto
- [ ] Painel web para visualização das resenhas

---

## 🙌 Desenvolvido por

Lucas Artigiani | PMESP | 2025
