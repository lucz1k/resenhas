export async function executarBopm(resposta, dados) {
  const valor = resposta.trim();

  if (!valor) {
    return {
      proximaEtapa: 'bopm',
      mensagemResposta: '⚠️ Por favor, informe o número do *BOPM*.',
      dadoExtraido: null,
    };
  }

  dados.bopm = valor;

  return {
    proximaEtapa: 'bopc',
    mensagemResposta: `✅ BOPM registrado: *${valor}*.\nAgora informe o número do *BOPC*. (digite não para pular)`,
    dadoExtraido: valor,
  };
}