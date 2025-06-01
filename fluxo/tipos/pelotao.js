export async function executarPelotao(resposta) {
  const entrada = resposta.trim().toLowerCase();
  const match = entrada.match(/^(\d{1,2})\s*(º|o|a)?\s*(pel|pelotao|pelotão)?/);

  if (!match) {
    return {
      proximaEtapa: 'natureza',
      mensagemResposta: '❌ Formato inválido para Pelotão. Exemplos válidos: 1º Pel, 2 Pelotão.',
      dadoExtraido: null,
    };
  }

  const numero = parseInt(match[1]);
  if (numero < 1 || numero > 99) {
    return {
      proximaEtapa: 'natureza',
      mensagemResposta: '❌ Número de Pelotão inválido. Use um número entre 1 e 99.',
      dadoExtraido: null,
    };
  }

  const pelotaoFormatado = `*${numero}º Pel*`;

  return {
    proximaEtapa: 'natureza',
    mensagemResposta: `Pelotão registrado: ${pelotaoFormatado}`,
    dadoExtraido: pelotaoFormatado,
  };
}
