// fluxo/tipos/texto.js
import { etapasFluxo } from '../etapasFluxo.js';

// Executor genérico para etapas de texto
export async function executarTexto(resposta, dados, chave) {
  const entrada = resposta?.trim();

  if (!entrada) {
    return {
      proximaEtapa: chave,
      mensagemResposta: '⚠️ Por favor, envie um texto válido.',
      dadoExtraido: null,
    };
  }

  dados[chave] = entrada;

  // Descobre o índice da etapa atual no fluxo
  const idxAtual = etapasFluxo.findIndex(etapa => etapa.chave === chave);
  const proximaEtapa = etapasFluxo[idxAtual + 1]?.chave || 'FINALIZAR';
  const proximaPergunta = etapasFluxo[idxAtual + 1]?.pergunta;

  return {
    proximaEtapa,
    mensagemResposta: `Entendido. Informado: *${entrada}*.` + (proximaPergunta ? `\n\n${proximaPergunta}` : ''),
    dadoExtraido: entrada,
  };
}
