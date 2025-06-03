export async function executarCia(resposta) {
  const entrada = resposta.trim().toLowerCase();

  // Verifica se é uma entrada para Estado Maior
  const entradasEstadoMaior = ['estado maior', 'em', 'est', 'estado-maior', 'estado_maior'];
  if (entradasEstadoMaior.includes(entrada)) {
    const ciaFormatada = 'Estado Maior';
    return {
      proximaEtapa: 'pelotao',
      mensagemResposta: `✅ Companhia registrada: *${ciaFormatada}*. Agora informe o *Pelotão* (Ex. 1, 2, 3 ou pular se não houver).`,
      dadoExtraido: ciaFormatada,
    };
  }

  // Aceita: "1ª", "2ª", "1ª cia", "2ª companhia", "1 cia", "2 companhia"
  const match = entrada.match(/^(\d{1,2})(ª|a)?(\s*(cia|companhia))?$/i);

  // Validação de formato
  if (!match) {
    return {
      proximaEtapa: 'cia',
      mensagemResposta: '❌ Formato inválido para Companhia. Exemplos válidos: 1ª, 2ª, 1ª Cia, 2 Cia, 3ª Companhia ou Estado Maior.',
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
    mensagemResposta: `✅ Companhia registrada: *${ciaFormatada}*. Agora informe o *Pelotão* (Ex. 1, 2, 3 ou pular se não houver).`,
    dadoExtraido: ciaFormatada,
  };
}
