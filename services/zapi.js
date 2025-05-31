import fetch from 'node-fetch';
import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;

if (!ZAPI_INSTANCE_ID || !ZAPI_TOKEN) {
  console.warn('⚠️ ZAPI_INSTANCE_ID ou ZAPI_TOKEN não definidos nas variáveis de ambiente!');
}

const ZAPI_BASE_URL = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}`;

const router = express.Router();

// Rota do webhook de entrada (Z-API)
router.post('/whatsapp', handleWebhook);

export default router;

/**
 * Envia mensagem de texto para número WhatsApp via Z-API
 * @param {string} telefone - número no formato 55 + DDD + número (ex: 5511999999999)
 * @param {string} mensagem - mensagem a ser enviada
 */
export async function enviarMensagem(telefone, mensagem) {
  try {
    const body = {
      phone: telefone,
      message: mensagem,
    };

    console.log('📨 Enviando para Z-API:', body);

    const response = await fetch(`${ZAPI_BASE_URL}/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro da Z-API:', data);
    } else {
      console.log('✅ Mensagem enviada com sucesso:', data);
    }
  } catch (err) {
    console.error('❌ Falha ao enviar requisição à Z-API:', err);
  }
}
