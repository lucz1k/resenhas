import fetch from 'node-fetch';

// Função para sortear uma das três keys
function getRandomOpenAIKey() {
  const keys = [
    process.env.OPENAI_KEY_1,
    process.env.OPENAI_KEY_2,
    process.env.OPENAI_KEY_3
  ].filter(Boolean); // Remove undefined caso alguma não esteja setada
  // Sorteia uma key aleatória
  return keys[Math.floor(Math.random() * keys.length)];
}

export async function chatCompletions(mensagens) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  // Seleciona uma key aleatória
  const openaiKey = getRandomOpenAIKey();
  if (!openaiKey) throw new Error('Nenhuma OPENAI_KEY disponível nas variáveis de ambiente.');

  try {
    const response = await fetch(
      `${process.env.OPENAI_PROXY_URL}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: mensagens
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro OpenAI Proxy: ${response.status} - ${erro}`);
    }

    const json = await response.json();
    return json.choices?.[0]?.message?.content?.trim() || '';
  } catch (err) {
    throw new Error(`Erro na requisição OpenAI Proxy: ${err.message}`);
  }
}
