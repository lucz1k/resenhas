import { proxySecurity, limitesAbuso, interpretarNaturezaPrefixo, montarResenhaFinal, finalizarResenha } from '../utils/proxy.js';
import { etapasFluxo } from '../fluxo/etapasFluxo.js';
import { chatCompletions } from '../services/openai.js';
import { enviarMensagem } from '../services/zapi.js';
import { obterProgresso, salvarProgresso, limparProgresso as resetarProgresso } from '../db/progresso.js';

const resenhaController = {
  async receberMensagem(mensagem) {
    const telefone = mensagem.from;
    const texto = (mensagem.body || '').trim();
    const ip = mensagem?.sender?.ip || 'desconhecido';

    if (mensagem?.fromMe === true) {
      console.log(`[IGNORADO] Mensagem enviada por mim mesmo: ${texto}`);
      return;
    }

    if (texto.toLowerCase() === '#reset') {
      await resetarProgresso(telefone);
      await enviarMensagem(telefone, '🔄 Progresso da resenha resetado com sucesso. Vamos começar novamente.');
      return;
    }

    if (limitesAbuso.verificarAbuso(telefone)) {
      return enviarMensagem(telefone, '🚫 Limite de uso excedido. Tente novamente mais tarde.');
    }

    if (!proxySecurity.validarMensagem(mensagem)) {
      return enviarMensagem(telefone, '❌ Mensagem inválida ou não suportada.');
    }

    proxySecurity.registrarLog({ telefone, ip, prompt: texto });

    let progresso = await obterProgresso(telefone);
    if (!progresso) {
      progresso = { etapaAtual: 'grandeComando', dados: {} };
      console.log(`[INICIANDO] Novo fluxo para: ${telefone}`);
    } else {
      console.log(`[PROGRESSO] Etapa atual: ${progresso.etapaAtual} | Número: ${telefone}`);
    }

    const etapa = etapasFluxo.find(et => et.chave === progresso.etapaAtual);

    if (!etapa || typeof etapa.executar !== 'function') {
      console.error(`[ERRO] Etapa inválida ou sem executor: ${progresso.etapaAtual}`);
      return enviarMensagem(telefone, `❌ Etapa de fluxo inválida ou sem executor configurado: ${progresso.etapaAtual}`);
    }

    try {
      const { proximaEtapa, mensagemResposta, dadoExtraido } = await etapa.executar(texto, progresso.dados, telefone);

      progresso.dados[progresso.etapaAtual] = dadoExtraido;
      progresso.etapaAtual = proximaEtapa;

      await salvarProgresso(telefone, progresso);
      console.log(`[ETAPA] ${etapa.chave} concluída com:`, dadoExtraido);

      await enviarMensagem(telefone, mensagemResposta);

      if (proximaEtapa === 'FINALIZAR') {
        const resenha = await montarResenhaFinal(progresso.dados);
        await finalizarResenha(telefone, resenha, enviarMensagem, () => {});
        console.log(`[FINALIZADO] Resenha enviada para ${telefone}`);
      }
    } catch (erro) {
      console.error(`[ERRO] Ao processar etapa ${etapa.chave}:`, erro);
      await enviarMensagem(telefone, `❌ Ocorreu um erro ao processar a etapa ${etapa.chave}. Tente novamente ou envie #reset para recomeçar.`);
    }
  }
};

// 🔄 Função pública que será chamada pelo webhook
export async function processarMensagem(mensagem) {
  return resenhaController.receberMensagem(mensagem);
}

export default resenhaController;
