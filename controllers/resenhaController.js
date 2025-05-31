import { proxySecurity, limitesAbuso, interpretarNaturezaPrefixo, montarResenhaFinal, finalizarResenha } from '../utils/proxy.js';
import { etapasFluxo } from '../fluxo/etapasFluxo.js';
import { chatCompletions } from '../services/openai.js';
import { enviarMensagem } from '../services/zapi.js';
import { obterProgresso, salvarProgresso, resetarProgresso } from '../db/progresso.js';

const resenhaController = {
  async receberMensagem(mensagem) {
    const numero = mensagem.from;
    const texto = (mensagem.body || '').trim();
    const ip = mensagem?.sender?.ip || 'desconhecido';

    // Ignorar mensagens enviadas pelo próprio bot
    if (mensagem?.fromMe === true) {
      console.log(`[IGNORADO] Mensagem enviada por mim mesmo: ${texto}`);
      return;
    }

    // Comando especial para resetar progresso
    if (texto.toLowerCase() === '#reset') {
      await resetarProgresso(numero);
      await enviarMensagem(numero, '🔄 Progresso da resenha resetado com sucesso. Vamos começar novamente.');
      return;
    }

    // 1. Proteções
    if (limitesAbuso.verificarAbuso(numero)) {
      return enviarMensagem(numero, '🚫 Limite de uso excedido. Tente novamente mais tarde.');
    }

    if (!proxySecurity.validarMensagem(mensagem)) {
      return enviarMensagem(numero, '❌ Mensagem inválida ou não suportada.');
    }

    // 2. Registrar log
    proxySecurity.registrarLog({ numero, ip, prompt: texto });

    // 3. Obter ou iniciar progresso
    let progresso = await obterProgresso(numero);
    if (!progresso) {
      progresso = { etapaAtual: 'grandeComando', dados: {} };
      console.log(`[INICIANDO] Novo fluxo para: ${numero}`);
    } else {
      console.log(`[PROGRESSO] Etapa atual: ${progresso.etapaAtual} | Número: ${numero}`);
    }

    const etapa = etapasFluxo.find(et => et.chave === progresso.etapaAtual);

    if (!etapa || typeof etapa.executar !== 'function') {
      console.error(`[ERRO] Etapa inválida ou sem executor: ${progresso.etapaAtual}`);
      return enviarMensagem(numero, `❌ Etapa de fluxo inválida ou sem executor configurado: ${progresso.etapaAtual}`);
    }

    try {
      // 4. Executar etapa
      const { proximaEtapa, mensagemResposta, dadoExtraido } = await etapa.executar(texto, progresso.dados, numero);

      // 5. Atualizar progresso
      progresso.dados[progresso.etapaAtual] = dadoExtraido;
      progresso.etapaAtual = proximaEtapa;

      await salvarProgresso(numero, progresso);
      console.log(`[ETAPA] ${etapa.chave} concluída com:`, dadoExtraido);

      // 6. Responder
      await enviarMensagem(numero, mensagemResposta);

      // 7. Finalizar, se necessário
      if (proximaEtapa === 'FINALIZAR') {
        const resenha = await montarResenhaFinal(progresso.dados);
        await finalizarResenha(numero, resenha, enviarMensagem, () => {});
        console.log(`[FINALIZADO] Resenha enviada para ${numero}`);
      }
    } catch (erro) {
      console.error(`[ERRO] Ao processar etapa ${etapa.chave}:`, erro);
      await enviarMensagem(numero, `❌ Ocorreu um erro ao processar a etapa ${etapa.chave}. Tente novamente ou envie #reset para recomeçar.`);
    }
  }
};

export default resenhaController;
