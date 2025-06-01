// fluxo/tipos/formaAcionamento.js

export async function executarFormaAcionamento(resposta, dados) {
  const texto = resposta.trim();

  if (texto.length < 3) {
    return {
      proximaEtapa: 'formaAcionamento',
      mensagemResposta: '⚠️ Informação insuficiente. Informe como a equipe foi acionada, como por exemplo:\n\n• Despachada via COPOM\n• Deparou-se na via\n• Populares\n• Ligação/mensagem',
      dadoExtraido: null,
    };
  }

  dados.formaAcionamento = texto;

  return {
    proximaEtapa: 'historico',
    mensagemResposta: '📝 Agora, descreva os fatos da ocorrência para que possamos gerar o histórico final.',
    dadoExtraido: texto,
  };
}
