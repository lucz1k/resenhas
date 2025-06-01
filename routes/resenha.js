import express from 'express';
import resenhaController from '../controllers/resenhaController.js';

const router = express.Router();

router.post('/webhook/whatsapp', async (req, res) => {
  try {
    const mensagem = req.body;

    if (!req.body) {
      return res.status(400).send('Corpo da requisição ausente.');
    }

    // ✅ Ignora mensagens enviadas pela própria instância
    if (mensagem?.fromMe === true) {
      return res.status(200).send('Ignorado: mensagem enviada por mim mesmo.');
    }

    // ✅ Ignora mensagens que não são de texto
    if (mensagem?.type !== 'chat') {
      return res.status(200).send('Ignorado: tipo de mensagem não suportado.');
    }

    // ✅ Chama o controlador principal
    await resenhaController.receberMensagem(mensagem);
    res.status(200).send('Mensagem recebida com sucesso.');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Erro no processamento.');
  }
});

export default router;
