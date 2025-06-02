// fluxo/tipos/natureza.js

import { naturezasCompletas } from '../dados/naturezasCompletas.js';

export async function executarNatureza(resposta, dados) {
  const codigo = resposta.trim().toUpperCase();

  // Se o usuário digitar "pular", deixa em branco e avança
  if (/^pular$/i.test(codigo)) {
    dados.natureza = '';
    dados.descricaoNatureza = '';
    return {
      proximaEtapa: 'complementoNatureza',
      mensagemResposta: 'Natureza deixada em branco. Deseja *complementar a ocorrência?* (Se não, digite *pular*, *não* ou *nao*.)',
      dadoExtraido: { codigo: '', descricao: '' },
    };
  }

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
    mensagemResposta: `✅ Natureza registrada: *${codigo} – ${descricao}*.\nDeseja *complementar a ocorrência?*\n(Ex: tentado, envolvendo policial militar). Se não, digite *pular*, *não* ou *nao*.`,
    dadoExtraido: { codigo, descricao },
  };
}
