import { etapasFluxo } from '../etapasFluxo.js';

export async function executarDelegado(resposta, dados) {
  const valor = resposta.trim();

  // Se o usuário digitar "pular", "não", etc., deixa em branco
  if (/^(não|nao|nenhum|n|pular)$/i.test(valor) || !valor)
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
