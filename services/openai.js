// services/openai.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_PROXY_URL = process.env.OPENAI_PROXY_URL || 'https://resenha-proxy.onrender.com/v1/chat/completions';

export async function chatCompletions(mensagens, modelo = 'gpt-3.5-turbo', temperatura = 0.7) {
  const payload = {
    model: modelo,
    messages: mensagens,
    temperature: temperatura,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(OPENAI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro ao chamar OpenAI via proxy: ${response.status} ${erro}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    throw new Error(`Erro na requisição OpenAI: ${err.message}`);
  }
}
