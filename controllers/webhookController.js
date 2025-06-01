// controllers/webhookController.js
import { processarMensagem } from './resenhaController.js';

export async function handleWebhook(req, res) {
  try {
    const body = req.body;

    console.log('[Webhook] Mensagem recebida:', JSON.stringify(body));

    const telefone = body?.phone;
    const mensagem = body?.text?.message;

    if (!telefone || !mensagem || !mensagem.trim()) {
      console.warn('⚠️ Webhook sem número ou mensagem');
      return res.sendStatus(400);
    }

    // Constrói o objeto esperado por processarMensagem
    const mensagemFormatada = {
      from: telefone,
      body: mensagem,
      fromMe: body.fromMe || false,
      sender: {
        ip: req.ip
      }
    };

    await processarMensagem(mensagemFormatada);

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Erro no handleWebhook:', err);
    res.sendStatus(500);
  }
}
