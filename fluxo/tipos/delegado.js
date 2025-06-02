import { etapasFluxo } from '../etapasFluxo.js';

export async function executarDelegado(resposta, dados) {
  const valor = resposta.trim();


  // Campo opcional: permite seguir mesmo se vazio
  if (!valor) {
    dados.delegado = '';
    return {
      proximaEtapa,
      mensagemResposta: 'Nenhum delegado informado.' + (proximaPergunta ? `\n\n${proximaPergunta}` : ''),
      dadoExtraido: '',
    };
  }

  dados.delegado = valor;

  return {
    proximaEtapa: 'data',
    mensagemResposta: `✅ Delegado registrado: *${valor}*.\nAgora informe a data da ocorrência (hoje, amanhã, 13mai25, 13/05/25)`,
    dadoExtraido: valor,
  };
}

