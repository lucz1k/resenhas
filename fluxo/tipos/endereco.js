export async function executarEndereco(resposta, dados, numero) {
  if (typeof resposta === 'string' && resposta.trim().length >= 5) {
    const endereco = resposta.trim();
    return {
      proximaEtapa: 'equipe',
      mensagemResposta: `📍 Endereço registrado:\n*${endereco}*\n\nAgora, informe a *equipe que atendeu* (viatura + policiais).`,
      dadoExtraido: endereco,
    };
  }

  return {
    proximaEtapa: 'endereco',
    mensagemResposta: '⚠️ Endereço inválido. Por favor, envie o endereço completo em texto (ex: Rua X, nº Y, Bairro - Cidade/UF).',
    dadoExtraido: null,
  };
}
