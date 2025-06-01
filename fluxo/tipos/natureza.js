// fluxo/tipos/natureza.js

import { naturezasCompletas } from '../dados/naturezasCompletas.js';

export async function executarNatureza(resposta, dados) {
  const codigo = resposta.trim().toUpperCase();

  // Verifica se o código existe no dicionário de naturezas
  const descricao = naturezasCompletas[codigo];
  if (!descricao) {
    return {
      proximaEtapa: 'natureza',
      mensagemResposta: '❌ Código de natureza inválido. Por favor, envie um código válido como *C04*, *A01* ou *B03*.',
      dadoExtraido: null,
    };
  }

  // Armazena a natureza no formato separado
  dados.natureza = codigo;
  dados.descricaoNatureza = descricao;

  return {
    proximaEtapa: 'complementoNatureza',
    mensagemResposta: `✅ Natureza registrada: *${codigo} – ${descricao}*.\nDeseja complementar a ocorrência?\n(Ex: tentado, envolvendo policial militar). Se sim, envie agora.`,
    dadoExtraido: { codigo, descricao },
  };
}
