// fluxo/tipos/natureza.js

import { naturezas } from '../dados/naturezasCompletas.js';

export async function executarNatureza(resposta, dados) {
  const codigo = resposta.trim().toUpperCase();

  const descricao = naturezas[codigo];
  if (!descricao) {
    return {
      proximaEtapa: 'natureza',
      mensagemResposta: `❌ Código de natureza inválido. Por favor, envie um código válido (ex: C04, A01, B03).`,
      dadoExtraido: null
    };
  }

  return {
    proximaEtapa: 'complementoNatureza',
    mensagemResposta: `✅ Natureza registrada: ${codigo} - ${descricao}. Deseja complementar a ocorrência (ex: tentado, envolvendo policial militar)? Se sim, envie agora.`,
    dadoExtraido: { codigo, descricao }
  };
}
