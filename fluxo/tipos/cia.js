export async function executarCia(resposta) {
  const entrada = resposta.trim().toLowerCase();

  // Tenta extrair o número e a palavra "Cia" ou "companhia"
  const match = entrada.match(/^(\d{1,2})(ª|a)?\s*(cia|companhia)?/i);

  // Validação de formato
  if (!match) {
    return {
      proximaEtapa: 'cia',
      mensagemResposta: '❌ Formato inválido para Companhia. Exemplos válidos: 1ª Cia, 2 Cia, 3ª Companhia.',
      dadoExtraido: null,
    };
  }

  const numero = parseInt(match[1], 10);

  // Validação de faixa numérica
  if (numero < 1 || numero > 99) {
    return {
      proximaEtapa: 'cia',
      mensagemResposta: '❌ Número inválido para Companhia. Use um número entre 1 e 99.',
      dadoExtraido: null,
    };
  }

  const ciaFormatada = `${numero}ª Cia`;

  return {
    proximaEtapa: 'pelotao',
    mensagemResposta: `✅ Companhia registrada: *${ciaFormatada}*. Agora informe o Pelotão.`,
    dadoExtraido: ciaFormatada,
  };
}
