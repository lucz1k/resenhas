// services/zapi.js
import fetch from 'node-fetch';
import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN;
const ZAPI_BASE_URL = `https://api.z-api.io/instances/3E1FB31F1FB78031E87D62AF4B231A0B/token/F53020EE23BFEE21F29C837D/send-text`;

const router = express.Router();

router.post('/webhook/whatsapp', handleWebhook);

export default router;

export async function enviarMensagem(telefone, mensagem) {
  try {
    const body = {
      phone: numero,
      message: mensagem,
    };

    const response = await fetch(`${ZAPI_BASE_URL}/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro ao enviar mensagem:', data);
    }
  } catch (err) {
    console.error('❌ Falha na requisição à Z-API:', err);
  }
}

// await enviarMensagem(telefone, `📨 Recebido: "${mensagem}"`);
