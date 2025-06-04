import { etapasFluxo } from '../etapasFluxo.js';

export async function executarDelegado(resposta, dados) {
  const valor = resposta.trim();

  if (/^(pular|não|nao|nenhum|n)$/i.test(valor) || !valor) {
    dados.delegado = '';
    return {
      proximaEtapa: 'data',
      mensagemResposta: 'Nenhum delegado informado.\nAgora informe a *data da ocorrência* (hoje, amanhã, 13mai25, 13/05/25)',
      dadoExtraido: '',
    };
  }

  dados.delegado = valor;

  return {
    proximaEtapa: 'data',
    mensagemResposta: `✅ Delegado registrado: *${valor}*.\nAgora informe a *data da ocorrência* (hoje, amanhã, 13mai25, 13/05/25)`,
    dadoExtraido: valor,
  };
}
