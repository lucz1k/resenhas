import fetch from 'node-fetch';

export async function chatCompletions(mensagens) {
  const response = await fetch(`${process.env.OPENAI_PROXY_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: mensagens
    })
  });

  const json = await response.json();
  return json.choices[0].message.content.trim();
}
