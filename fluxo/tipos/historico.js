// fluxo/tipos/historico.js

import { chatCompletions } from '../../services/openai.js';

export async function executarHistorico(resposta, dados, numero) {
  const historicoBruto = resposta.trim();

  const prompt = `
Corrija o português do texto. Não use emojis ou linguagem coloquial ou altere o sentido. Corrija apenas a caixa alta conforme a norma gramatical. Se houver palavras proibidas, substitua por "-PALAVRA PROIBIDA-".

Texto:
${historicoBruto}
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

  return {
    proximaEtapa: 'FINALIZAR',
    mensagemResposta: '✅ Todos os dados foram coletados. A resenha será *gerada e enviada.*',
    dadoExtraido: historicoFinal,
  };
}
