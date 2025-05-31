// fluxo/tipos/formaAcionamento.js

export async function executarFormaAcionamento(resposta, dados) {
  const texto = resposta.trim();

  dados.formaAcionamento = texto;

  return {
    proximaEtapa: 'historico',
    mensagemResposta: 'Descreva os fatos da ocorrência para que possamos gerar o histórico final.',
    dadoExtraido: texto,
  };
}
