export async function executarCia(resposta) {
  const entrada = resposta.trim().toLowerCase();

  // Extrair o número da Cia
  const match = entrada.match(/^(\d{1,2})/);
  if (!match) {
    return {
      proximaEtapa: 'cia',
      mensagemResposta: '❌ Formato inválido para Cia. Exemplos válidos: 1ª Cia, 2 Cia, 3ª companhia.',
      dadoExtraido: null,
    };
  }

  const numero = parseInt(match[1]);
  if (numero < 1 || numero > 99) {
    return {
      proximaEtapa: 'cia',
      mensagemResposta: '❌ Número de Cia inválido. Use um número entre 1 e 99.',
      dadoExtraido: null,
    };
  }

  const ciaFormatada = `*${numero}ª Cia*`;

  return {
    proximaEtapa: 'pelotao',
    mensagemResposta: `Cia registrada: ${ciaFormatada}`,
    dadoExtraido: ciaFormatada,
  };
}
