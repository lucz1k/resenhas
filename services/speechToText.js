import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const OPENAI_KEYS = [
  process.env.OPENAI_API_KEY1,
  process.env.OPENAI_API_KEY2,
  process.env.OPENAI_API_KEY3,
];

function getRandomKey() {
  return OPENAI_KEYS[Math.floor(Math.random() * OPENAI_KEYS.length)];
}

export async function audioParaTexto(audioPath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(audioPath));
  form.append('model', 'whisper-1');

  const response = await axios.post(
    'https://api.openai.com/v1/audio/transcriptions',
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${getRandomKey()}`,
      },
    }
  );
  return response.data.text;
}