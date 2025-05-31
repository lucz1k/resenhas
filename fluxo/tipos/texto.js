// fluxo/tipos/texto.js

export async function executarTexto(input, dados, numero) {
  const chaveAtual = Object.keys(dados).length;
  const proximaEtapa = chaveAtual + 1;
  return {
    proximaEtapa: etapasFluxo[proximaEtapa]?.chave || 'FINALIZAR',
    mensagemResposta: 'Ok, prossigamos...',
    dadoExtraido: input
  };
}
