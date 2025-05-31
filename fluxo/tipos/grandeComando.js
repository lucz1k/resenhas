export async function executargrandeComando(resposta) {
  const texto = resposta.trim().toUpperCase().replace(/\s+/g, '');

  const padraoValido = /^(CPA-M\/\d+|CPI-\d+|CPCHQ|CPC|CPM)$/;

  if (!padraoValido.test(texto)) {
    return {
      proximaEtapa: 'grandeComando',
      mensagemResposta: '❌ Formato inválido. Use exemplos como: CPA-M/6, CPI-2, CPChq, CPC ou CPM.',
      dadoExtraido: null,
    };
  }

  return {
    proximaEtapa: 'batalhao',
    mensagemResposta: `Grande Comando registrado: *${texto}*`,
    dadoExtraido: `*${texto}*`,
  };
}
