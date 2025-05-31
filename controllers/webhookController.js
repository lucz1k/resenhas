// controllers/webhookController.js
import { enviarMensagem } from '../services/zapi.js';

export async function handleWebhook(req, res) {
  try {
    const body = req.body;

    console.log('[Webhook] Mensagem recebida:', JSON.stringify(body));

    const telefone = body?.phone;
    const mensagem = body?.text?.message;

    if (!telefone || !mensagem) {
      console.warn('⚠️ Webhook sem número ou mensagem');
      return res.sendStatus(400);
    }

    // Aqui é onde você pode chamar seu fluxo de resenha
    await enviarMensagem(telefone, `📨 Recebido: "${mensagem}"`);

    res.sendStatus(200);
  } catch (err) {
    console.error('Erro no handleWebhook:', err);
    res.sendStatus(500);
  }
}
