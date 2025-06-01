// fluxo/tipos/texto.js
import { etapasFluxo } from '../etapasFluxo.js';

export async function executarTexto(input, dados, telefone) {
  // Garante que input não é vazio
  if (!input || !input.trim()) {
    return {
      proximaEtapa: etapasFluxo[Object.keys(dados).length]?.chave || 'FINALIZAR',
      mensagemResposta: '⚠️ Por favor, envie um texto válido.',
      dadoExtraido: null
    };
  }

  // Busca a próxima etapa baseada na ordem das etapas
  const chaveAtual = Object.keys(dados).length;
  const proximaEtapa = etapasFluxo[chaveAtual + 1]?.chave || 'FINALIZAR';

  return {
    proximaEtapa,
    mensagemResposta: 'Ok, prossigamos...',
    dadoExtraido: input.trim()
  };
}
