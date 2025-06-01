import fetch from 'node-fetch';

export async function chatCompletions(mensagens) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(
      `${process.env.OPENAI_PROXY_URL}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
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
