import { proxySecurity, limitesAbuso, interpretarNaturezaPrefixo, finalizarResenha } from '../utils/proxy.js';
import { montarResenhaFinal } from '../utils/montarResenhaFinal.js';
import { etapasFluxo } from '../fluxo/etapasFluxo.js';
import { chatCompletions } from '../services/openai.js';
import { enviarMensagem } from '../services/zapi.js';
import { obterProgresso, salvarProgresso, limparProgresso as resetarProgresso } from '../db/progresso.js';
import { executores } from '../fluxo/executores.js'; // <-- Adicione esta linha

const resenhaController = {
  async receberMensagem(mensagem) {
    const telefone = mensagem.from;
    const texto = (mensagem.body || '').trim();
    const ip = mensagem?.sender?.ip || 'desconhecido';

    // Ignora mensagens da própria instância
    if (mensagem?.fromMe === true) {
      console.log(`[IGNORADO] Mensagem enviada por mim mesmo: ${texto}`);
      return;
    }

    // Comando de reset
    if (texto.toLowerCase() === '#reset') {
      await resetarProgresso(telefone);
      await enviarMensagem(telefone, '🔄 Progresso da resenha resetado com sucesso. Vamos começar novamente.');
      return;
    }

    // Verifica limites e segurança
    if (limitesAbuso(telefone)) {
      return enviarMensagem(telefone, '🚫 Limite de uso excedido. Tente novamente mais tarde.');
    }

    if (!proxySecurity(telefone, texto)) {
      return enviarMensagem(telefone, '❌ Mensagem inválida ou não suportada.');
    }

    // ✅ NOVO: detectar saudação e iniciar fluxo
    const saudacoes = ['oi', 'teste', 'resenha','.', 'Oi', 'eae','eai', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'começar', 'iniciar'];
    if (saudacoes.includes(texto.toLowerCase())) {
      await resetarProgresso(telefone);
      await salvarProgresso(telefone, {
        etapaAtual: 'grandeComando',
        dados: {},
      });
      await enviarMensagem(telefone, '👮‍♂️ Bem-vindo ao ResenhaZap! Vamos começar a montar a a sua resenha de ocorrência. Informe o *GRANDE COMANDO* (ex: cpa m6, cpi 1).');
      return;
    }

    console.log(`[RECEBIDO] Mensagem de ${telefone} (${ip}): ${texto}`);

    // Carrega progresso atual do usuário
    let progresso = await obterProgresso(telefone);
    if (!progresso) {
      progresso = { etapaAtual: 'grandeComando', dados: {} };
      console.log(`[INICIANDO] Novo fluxo para: ${telefone}`);
    } else {
      console.log(`[PROGRESSO] Etapa atual: ${progresso.etapaAtual} | Número: ${telefone}`);
    }

    const etapa = etapasFluxo.find(et => et.chave === progresso.etapaAtual);

    if (!etapa) {
      return enviarMensagem(telefone, `❌ Etapa de fluxo inválida: ${progresso.etapaAtual}`);
    }

    const executor = executores[etapa.tipo];

    if (!executor || typeof executor !== 'function') {
      return enviarMensagem(telefone, `❌ Executor não encontrado para o tipo: ${etapa.tipo}`);
    }

    try {
      const { proximaEtapa, mensagemResposta, dadoExtraido } = await executor(texto, progresso.dados, etapa.chave);

      progresso.dados[progresso.etapaAtual] = dadoExtraido;
      progresso.etapaAtual = proximaEtapa;

      await salvarProgresso(telefone, progresso);
      console.log(`[ETAPA] ${etapa.chave} concluída com:`, dadoExtraido);

      await enviarMensagem(telefone, mensagemResposta);

      if (proximaEtapa === 'FINALIZAR') {
        const resenha = await montarResenhaFinal(progresso.dados);
        await finalizarResenha(telefone, resenha, enviarMensagem, () => {});
        console.log(`[FINALIZADO] Resenha enviada para ${telefone}`);
        // Envia mensagem orientando sobre o #reset
        await enviarMensagem(telefone, '🔄 Caso deseje iniciar uma nova resenha, envie #reset ou uma saudação como "oi".');
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

function registrarLog({ telefone, ip, prompt }) {
  // Implementar a lógica de registro de log aqui
  console.log(`Log registrado: ${telefone}, ${ip}, ${prompt}`);
}
