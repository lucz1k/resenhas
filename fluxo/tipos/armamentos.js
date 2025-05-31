// fluxo/tipos/armamentos.js

export async function executarArmamentos(resposta, dados) {
  if (!dados.armamentos) dados.armamentos = [];

  const texto = resposta.trim();

  if (/^(não|nao|nenhum|fim|encerrar)$/i.test(texto)) {
    return {
      proximaEtapa: 'formaAcionamento',
      mensagemResposta: 'Como a equipe foi acionada para a ocorrência? (Despachada via COPOM, deparou-se na via, populares, ligação/mensagem)',
      dadoExtraido: dados.armamentos,
    };
  }

  dados.armamentos.push(texto);

  return {
    proximaEtapa: 'armamentos',
    mensagemResposta: '✅ Armamento registrado. Deseja adicionar outro? Se não, digite "não".',
    dadoExtraido: dados.armamentos,
  };
}
