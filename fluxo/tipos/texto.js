// fluxo/tipos/texto.js
import { etapasFluxo } from '../etapasFluxo.js';

// Executor genérico para etapas de texto
export async function executarTexto(resposta, dados, chave) {
  dados[chave] = resposta.trim();

  // Descobre o índice da etapa atual no fluxo
  const idxAtual = etapasFluxo.findIndex(etapa => etapa.chave === chave);
  const proximaEtapa = etapasFluxo[idxAtual + 1]?.chave || 'FINALIZAR';

  return {
    proximaEtapa,
    mensagemResposta: `Entendido. Informado: *${resposta.trim()}*`,
    dadoExtraido: resposta.trim(),
  };
}
