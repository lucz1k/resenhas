export async function executarEndereco(resposta, dados, numero) {
  const texto = typeof resposta === 'string' ? resposta.trim() : '';

  if (texto.length >= 5) {
    const enderecoFormatado = texto
      .replace(/\s{2,}/g, ' ') // remove múltiplos espaços
      .replace(/\s*,\s*/g, ', ') // normaliza vírgulas
      .replace(/\s*-\s*/g, ' - '); // normaliza traços

    return {
      proximaEtapa: 'equipe',
      mensagemResposta: `📍 Endereço registrado:\n*${enderecoFormatado}*\n\nAgora, informe a *equipe que atendeu* (viatura + policiais).`,
      dadoExtraido: enderecoFormatado,
    };
  }

  return {
    proximaEtapa: 'endereco',
    mensagemResposta: '⚠️ Endereço inválido. Por favor, envie o endereço completo no formato: *Rua X, nº Y, Bairro - Cidade/UF*.',
    dadoExtraido: null,
  };
}
