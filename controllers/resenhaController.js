import { proxySecurity, limitesAbuso, finalizarResenha } from '../utils/proxy.js';
import { montarResenhaFinal } from '../utils/montarResenhaFinal.js';
import { etapasFluxo } from '../fluxo/etapasFluxo.js';
import { chatCompletions } from '../services/openai.js';
import { enviarMensagem } from '../services/zapi.js';
import { obterProgresso, salvarProgresso, limparProgresso as resetarProgresso } from '../db/progresso.js';
import { executores } from '../fluxo/executores.js';
import { salvarUsuario, buscarUsuario } from '../db/usuarios.js';

const MENU = [
  'Escolha uma opção:',
  '1️⃣ *Corrigir um histórico*',
  '2️⃣ *Fazer uma resenha*',
  '3️⃣ *Cadastrar meus dados*',
  '4️⃣ *Editar meus dados*',
  '',
  'ℹ️ *Dica*: Se quiser voltar ao menu inicial a qualquer momento, envie *#reset*.'
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
        const dadosPre = await buscarUsuario(telefone) || {};
        progresso.etapaAtual = 'grandeComando';
        progresso.dados = { ...dadosPre };
        await salvarProgresso(telefone, progresso);
        await enviarMensagem(telefone, 'Vamos começar a montar sua resenha. Informe o *GRANDE COMANDO* (ex: cpa m6, cpi 1).');
        return;
      }
      if (texto === '3' || /cadastrar/i.test(texto)) {
        progresso.etapaAtual = 'cadastro_nome';
        progresso.dadosCadastro = {};
        await salvarProgresso(telefone, progresso);
        await enviarMensagem(telefone, 'Vamos cadastrar seus dados!\nQual seu *nome* completo?');
        return;
      }
      if (texto === '4' || /editar/i.test(texto)) {
        // Busca dados atuais para editar
        const dadosAtuais = await buscarUsuario(telefone) || {};
        progresso.etapaAtual = 'editar_nome';
        progresso.dadosCadastro = { ...dadosAtuais };
        await salvarProgresso(telefone, progresso);
        await enviarMensagem(telefone, `Vamos editar seus dados!\nSeu nome atual é: *${dadosAtuais.nome || 'não cadastrado'}*\nEnvie o novo nome ou digite "manter" para não alterar.`);
        return;
      }
      // Se não reconheceu, mostra o menu de novo
      await enviarMensagem(telefone, 'Por favor, escolha uma opção válida:\n\n' + MENU);
      return;
    }

    // FLUXO DE CORREÇÃO DE HISTÓRICO
    if (progresso.etapaAtual === 'corrigirHistorico') {
      let textoParaCorrigir = texto;

      // Verifica se veio áudio (exemplo: mensagem.audioPath ou mensagem.audioUrl)
      if (!textoParaCorrigir && (mensagem.audioPath || mensagem.audioUrl)) {
        try {
          // Importe e use sua função de transcrição, ex:
          // import { audioParaTexto } from '../services/speechToText.js';
          textoParaCorrigir = await audioParaTexto(mensagem.audioPath || mensagem.audioUrl);
        } catch (err) {
          await enviarMensagem(telefone, '❌ Não foi possível transcrever o áudio. Envie novamente ou tente em texto.');
          return;
        }
      }

      if (!textoParaCorrigir) {
        await enviarMensagem(telefone, '❌ Não entendi o histórico. Por favor, envie o texto ou um áudio claro.');
        return;
      }

      const prompt = `
Corrija o português do texto. Não use emojis ou linguagem coloquial ou altere o sentido. Utilize caixa alta apenas conforme a norma. Se houver palavras proibidas, substitua por "-PALAVRA PROIBIDA-".

Texto:
${textoParaCorrigir}
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

    // Cadastro - Nome
    if (progresso.etapaAtual === 'cadastro_nome') {
      progresso.dadosCadastro.nome = texto;
      progresso.etapaAtual = 'cadastro_batalhao';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, 'Qual seu *batalhão*?');
      return;
    }

    // Cadastro - Batalhão
    if (progresso.etapaAtual === 'cadastro_batalhao') {
      progresso.dadosCadastro.batalhao = texto;
      progresso.etapaAtual = 'cadastro_grandeComando';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, 'Qual seu *grande comando*?');
      return;
    }

    // Cadastro - Grande Comando
    if (progresso.etapaAtual === 'cadastro_grandeComando') {
      progresso.dadosCadastro.grandeComando = texto;
      progresso.etapaAtual = 'cadastro_cia';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, 'Qual sua *CIA*?');
      return;
    }

    // Cadastro - CIA
    if (progresso.etapaAtual === 'cadastro_cia') {
      progresso.dadosCadastro.cia = texto;
      progresso.etapaAtual = 'cadastro_pelotao';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, 'Qual seu *Pelotão*?');
      return;
    }

    // Cadastro - Pelotão
    if (progresso.etapaAtual === 'cadastro_pelotao') {
      progresso.dadosCadastro.pelotao = texto;
      await salvarUsuario(telefone, progresso.dadosCadastro);
      await enviarMensagem(telefone, '✅ Cadastro realizado com sucesso!\nSe quiser iniciar uma resenha ou corrigir um histórico, escolha uma opção:\n\n' + MENU);
      await salvarProgresso(telefone, { etapaAtual: 'menu', dados: {} });
      return;
    }

    // Edição - Nome
    if (progresso.etapaAtual === 'editar_nome') {
      if (texto.toLowerCase() !== 'manter') {
        progresso.dadosCadastro.nome = texto;
      }
      progresso.etapaAtual = 'editar_batalhao';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, `Seu batalhão atual é: *${progresso.dadosCadastro.batalhao || 'não cadastrado'}*\nEnvie o novo batalhão ou digite "manter" para não alterar.`);
      return;
    }

    // Edição - Batalhão
    if (progresso.etapaAtual === 'editar_batalhao') {
      if (texto.toLowerCase() !== 'manter') {
        progresso.dadosCadastro.batalhao = texto;
      }
      progresso.etapaAtual = 'editar_grandeComando';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, `Seu grande comando atual é: *${progresso.dadosCadastro.grandeComando || 'não cadastrado'}*\nEnvie o novo grande comando ou digite "manter" para não alterar.`);
      return;
    }

    // Edição - Grande Comando
    if (progresso.etapaAtual === 'editar_grandeComando') {
      if (texto.toLowerCase() !== 'manter') {
        progresso.dadosCadastro.grandeComando = texto;
      }
      progresso.etapaAtual = 'editar_cia';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, `Sua CIA atual é: *${progresso.dadosCadastro.cia || 'não cadastrado'}*\nEnvie a nova CIA ou digite "manter" para não alterar.`);
      return;
    }

    // Edição - CIA
    if (progresso.etapaAtual === 'editar_cia') {
      if (texto.toLowerCase() !== 'manter') {
        progresso.dadosCadastro.cia = texto;
      }
      progresso.etapaAtual = 'editar_pelotao';
      await salvarProgresso(telefone, progresso);
      await enviarMensagem(telefone, `Seu Pelotão atual é: *${progresso.dadosCadastro.pelotao || 'não cadastrado'}*\nEnvie o novo Pelotão ou digite "manter" para não alterar.`);
      return;
    }

    // Edição - Pelotão
    if (progresso.etapaAtual === 'editar_pelotao') {
      if (texto.toLowerCase() !== 'manter') {
        progresso.dadosCadastro.pelotao = texto;
      }
      await salvarUsuario(telefone, progresso.dadosCadastro);
      await enviarMensagem(telefone, '✅ Dados editados com sucesso!\nSe quiser iniciar uma resenha ou corrigir um histórico, escolha uma opção:\n\n' + MENU);
      await salvarProgresso(telefone, { etapaAtual: 'menu', dados: {} });
      return;
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
