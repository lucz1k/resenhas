// services/openai.js
import fetch from 'node-fetch';

const OPENAI_API_PROXY = process.env.OPENAI_API_PROXY;

if (!OPENAI_API_PROXY) {
  console.warn('⚠️ OPENAI_API_PROXY não definido no ambiente!');
}

/**
 * Envia mensagens para o modelo GPT via proxy configurado.
 * @param {Array} messages - Array no formato OpenAI Chat API
 * @returns {string} - Conteúdo gerado pelo modelo (resposta textual)
 */
export async function chatCompletions(messages) {
  try {
    const resposta = await fetch(`${OPENAI_API_PROXY}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
      }),
    });

    const json = await resposta.json();

    if (!resposta.ok) {
      console.error('❌ Erro da API OpenAI (proxy):', json);
      throw new Error('Erro da API OpenAI');
    }

    const conteudo = json.choices?.[0]?.message?.content?.trim();

    if (!conteudo) {
      console.error('❌ Resposta inesperada da OpenAI:', json);
      throw new Error('Resposta inválida do modelo');
    }

    return conteudo;
  } catch (erro) {
    console.error('❌ Falha ao comunicar com a OpenAI via proxy:', erro);
    return '[ERRO NA GERAÇÃO DO HISTÓRICO]';
  }
}
