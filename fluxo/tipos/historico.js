// fluxo/tipos/historico.js

import { chatCompletions } from '../../services/openai.js';

export async function executarHistorico(resposta, dados, numero) {
  const historicoBruto = resposta.trim();

  // Chamar a OpenAI para corrigir e estruturar o histórico
  const prompt = `
Você é um assistente especializado em redigir ocorrências policiais da Polícia Militar do Estado de São Paulo.

Corrija e estruture o seguinte histórico com clareza, objetividade, impessoalidade e norma culta. Não use emojis nem linguagem coloquial, nao altere o sentido do texto e utilize caixa alta conforme a norma, caso haja palavras proibidas pelos termos substitua por -PALAVRA PROIBIDA-.

Texto original:
${historicoBruto}
`;

  const respostaGPT = await chatCompletions([
    { role: 'system', content: 'Você é um policial redator de ocorrências da PMESP.' },
    { role: 'user', content: prompt }
  ]);

  const historicoFinal = respostaGPT || '[ERRO NA GERAÇÃO DO HISTÓRICO]';

  dados.historico = historicoFinal;

  return {
    proximaEtapa: 'FINALIZAR',
    mensagemResposta: '✅ Todos os dados foram coletados. A resenha será gerada e enviada.',
    dadoExtraido: historicoFinal,
  };
}
