// fluxo/tipos/historico.js

import { chatCompletions } from '../../services/openai.js';

export async function executarHistorico(resposta, dados, numero) {
  const historicoBruto = resposta.trim();

  const prompt = `
Você é um assistente especializado na redação de ocorrências da Polícia Militar do Estado de São Paulo.

Corrija e reestruture o texto abaixo para uso em relatórios oficiais, mantendo clareza, objetividade, impessoalidade e norma culta.

🔒 Instruções:
- Não utilize emojis.
- Não utilize linguagem coloquial.
- Mantenha o sentido original do texto.
- Corrija a caixa alta apenas conforme norma gramatical (início de frase, nomes próprios, etc).
- Caso haja palavras proibidas pelos termos de uso da plataforma, substitua-as por "-PALAVRA PROIBIDA-".

Texto original:
${historicoBruto}
`;

  let historicoFinal;

  try {
    const respostaGPT = await chatCompletions([
      { role: 'system', content: 'Você é um policial redator de ocorrências da PMESP.' },
      { role: 'user', content: prompt }
    ]);

    historicoFinal = typeof respostaGPT === 'string'
      ? respostaGPT
      : respostaGPT?.choices?.[0]?.message?.content || '[ERRO NA GERAÇÃO DO HISTÓRICO]';

  } catch (error) {
    console.error('[ERRO OPENAI]', error);
    historicoFinal = '[ERRO NA GERAÇÃO DO HISTÓRICO]';
  }

  dados.historico = historicoFinal;

  return {
    proximaEtapa: 'FINALIZAR',
    mensagemResposta: '✅ Todos os dados foram coletados. A resenha será gerada e enviada.',
    dadoExtraido: historicoFinal,
  };
}
