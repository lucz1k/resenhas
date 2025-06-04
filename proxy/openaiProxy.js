import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const keys = [
  process.env.OPENAI_KEY_1,
  process.env.OPENAI_KEY_2,
  process.env.OPENAI_KEY_3,
].filter(Boolean);

function getRandomKey() {
  return keys[Math.floor(Math.random() * keys.length)];
}

router.post('/v1/chat/completions', async (req, res) => {
  try {
    const key = getRandomKey();
    if (!key) {
      return res.status(500).json({ error: 'Nenhuma OPENAI_KEY definida' });
    }

    const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(req.body),
    });

    const json = await resposta.json();
    res.status(resposta.status).json(json);
  } catch (err) {
    console.error('Erro no proxy OpenAI:', err);
    res.status(500).json({ error: 'Erro interno no proxy OpenAI' });
  }
});

export default router;
