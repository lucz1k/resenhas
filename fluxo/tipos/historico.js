// fluxo/tipos/historico.js

import { chatCompletions } from '../../services/openai.js';
import { audioParaTexto } from '../../services/speechToText.js';

export async function executarHistorico(resposta, dados, numero) {
  let historicoBruto = '';

  if (typeof resposta === 'string' && resposta.trim()) {
    historicoBruto = resposta.trim();
  } else if (resposta.audioPath) {
    historicoBruto = await audioParaTexto(resposta.audioPath);
  } else {
    return {
      proximaEtapa: 'historico',
      mensagemResposta: '❌ Não entendi o histórico. Por favor, envie o texto ou um áudio claro.',
      dadoExtraido: null,
    };
  }

  // Inclui a forma de acionamento no início do texto
  let textoParaCorrigir = historicoBruto;
  if (dados.formaAcionamento && typeof dados.formaAcionamento === 'string' && dados.formaAcionamento.trim()) {
    textoParaCorrigir = `Equipe ${dados.formaAcionamento.trim().toLowerCase()}.\n\n${historicoBruto}`;
  }

  const prompt = `
Corrija o português do texto. Não use emojis ou linguagem coloquial ou altere o sentido. Corrija apenas a caixa alta conforme a norma gramatical. Se houver palavras proibidas, substitua por "-PALAVRA PROIBIDA-".

Texto:
${textoParaCorrigir}
`;

  let historicoFinal;

  try {
    const respostaGPT = await chatCompletions([
      { role: 'system', content: 'Você é um policial redator de ocorrências da PMESP.' },
      { role: 'user', content: prompt }
    ]);

    console.log('[HISTÓRICO][OPENAI][RESPOSTA]', JSON.stringify(respostaGPT, null, 2));

    historicoFinal = (typeof respostaGPT === 'string'
      ? respostaGPT
      : respostaGPT?.choices?.[0]?.message?.content || '[ERRO NA GERAÇÃO DO HISTÓRICO]'
    ).trim();

    if (historicoFinal === '[ERRO NA GERAÇÃO DO HISTÓRICO]') {
      console.error('[HISTÓRICO][ERRO] Resposta inesperada da OpenAI:', JSON.stringify(respostaGPT, null, 2));
    }

  } catch (error) {
    console.error('[ERRO OPENAI]', error);
    historicoFinal = '[ERRO NA GERAÇÃO DO HISTÓRICO]';
  }

  dados.historico = historicoFinal;

  console.log('[RESENHA FINAL] Historico:', JSON.stringify(historicoFinal));

  return {
    proximaEtapa: 'FINALIZAR',
    mensagemResposta: '✅ Todos os dados foram coletados. A resenha será *gerada e enviada.*',
    dadoExtraido: historicoFinal,
  };
}
