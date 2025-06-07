import { proxySecurity, limitesAbuso, finalizarResenha } from '../utils/proxy.js';
import { montarResenhaFinal } from '../utils/montarResenhaFinal.js';
import { etapasFluxo } from '../fluxo/etapasFluxo.js';
import { chatCompletions } from '../services/openai.js';
import { enviarMensagem } from '../services/zapi.js';
import { obterProgresso, salvarProgresso, limparProgresso as resetarProgresso } from '../db/progresso.js';
import { executores } from '../fluxo/executores.js';

const MENU = [
  'Escolha uma opção:',
  '1️⃣ *Corrigir um histórico*',
  '2️⃣ *Fazer uma resenha*'
].join('\n');

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
      await enviarMensagem(telefone, '🔄 Progresso resetado. ' + MENU);
      return;
    }

    // Verifica limites e segurança
    if (limitesAbuso(telefone)) {
      return enviarMensagem(telefone, '🚫 Limite de uso excedido. Tente novamente mais tarde.');
    }

    const grupoId = mensagem.groupId || mensagem.chatId || mensagem.to || null; // ajuste conforme sua plataforma

    if (!proxySecurity(telefone, texto, grupoId)) {
      return enviarMensagem(telefone, '❌ Mensagem inválida ou não suportada.');
    }

    // Carrega progresso atual do usuário
    let progresso = await obterProgresso(telefone);

    // Se não há progresso, apresenta o menu inicial
    if (!progresso) {
      await salvarProgresso(telefone, { etapaAtual: 'menu', dados: {} });
      await enviarMensagem(telefone, '👮‍♂️ Bem-vindo ao ResenhaZap!\n\n' + MENU);
      return;
    }

    // MENU INICIAL
    if (progresso.etapaAtual === 'menu') {
      if (texto === '1' || /corrigir/i.test(texto)) {
        progresso.etapaAtual = 'corrigirHistorico';
        await salvarProgresso(telefone, progresso);
        await enviarMensagem(telefone, 'Digite o *histórico* que deseja corrigir:');
        return;
      }
      if (texto === '2' || /resenha/i.test(texto)) {
        progresso.etapaAtual = 'grandeComando';
        progresso.dados = {};
        await salvarProgresso(telefone, progresso);
        await enviarMensagem(telefone, 'Vamos começar a montar sua resenha. Informe o *GRANDE COMANDO* (ex: cpa m6, cpi 1).');
        return;
      }
      // Se não reconheceu, mostra o menu de novo
      await enviarMensagem(telefone, 'Por favor, escolha uma opção válida:\n\n' + MENU);
      return;
    }

    // FLUXO DE CORREÇÃO DE HISTÓRICO
    if (progresso.etapaAtual === 'corrigirHistorico') {
      const prompt = `
Corrija o português do texto. Não use emojis ou linguagem coloquial ou altere o sentido. Corrija apenas a caixa alta conforme a norma gramatical. Se houver palavras proibidas, substitua por "-PALAVRA PROIBIDA-".

Texto:
${texto}
      `;
      try {
        const respostaGPT = await chatCompletions([
          { role: 'system', content: 'Você é um policial redator de ocorrências da PMESP.' },
          { role: 'user', content: prompt }
        ]);
        const historicoCorrigido = (typeof respostaGPT === 'string'
          ? respostaGPT
          : respostaGPT?.choices?.[0]?.message?.content || '[ERRO NA GERAÇÃO DO HISTÓRICO]'
        ).trim();

        await enviarMensagem(telefone, `✅ Histórico corrigido:\n\n${historicoCorrigido}`);
        await resetarProgresso(telefone);
        await enviarMensagem(telefone, 'Se desejar corrigir outro histórico ou fazer uma resenha, envie qualquer mensagem.');
      } catch (error) {
        await enviarMensagem(telefone, '❌ Ocorreu um erro ao corrigir o histórico.');
      }
      return;
    }

    // FLUXO NORMAL DE RESENHA
    const saudacoes = ['oi', 'teste', 'resenha','.', 'Oi', 'eae','eai', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'começar', 'iniciar'];
    if (saudacoes.includes(texto.toLowerCase())) {
      await resetarProgresso(telefone);
      await salvarProgresso(telefone, { etapaAtual: 'menu', dados: {} });
      await enviarMensagem(telefone, '👮‍♂️ Bem-vindo ao ResenhaZap!\n\n' + MENU);
      return;
    }

    let etapa = etapasFluxo.find(et => et.chave === progresso.etapaAtual);
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
      await enviarMensagem(telefone, mensagemResposta);

      if (proximaEtapa === 'FINALIZAR') {
        const resenha = await montarResenhaFinal(progresso.dados);
        await finalizarResenha(telefone, resenha, enviarMensagem, () => {});
        await enviarMensagem(telefone, '🔄 Caso deseje iniciar uma nova resenha ou corrigir um histórico, envie qualquer mensagem.');
      }
    } catch (erro) {
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
