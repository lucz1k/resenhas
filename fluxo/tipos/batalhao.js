export async function executarBatalhao(resposta) {
  let texto = resposta.trim().toUpperCase();

  // Substitui múltiplos espaços por um só
  texto = texto.replace(/\s+/g, ' ');
  texto = texto.replace(/BPMM$/, 'BPM/M').replace(/BPMI$/, 'BPM/I');

  // Adiciona o "º" caso esteja ausente (ex: "10 BPM/M" ou "10BPM/M" → "10º BPM/M")
  texto = texto.replace(/^(\d+)\s?BPM\/([MI])$/, (_, numero, tipo) => `${numero}º BPM/${tipo}`);

  // Padrões válidos aceitos (batalhões convencionais e unidades especializadas)
  const padraoValido = /^(\d{1,2}º BPM\/[MI]|ROTA|BPTRAN|BAEP|[1-9]º BPCHQ|[1-9]º BPR|[1-9]º BPAMB|[1-9]º BPRV)$/;

  if (!padraoValido.test(texto)) {
    return {
      proximaEtapa: 'batalhao',
      mensagemResposta: '❌ Formato inválido para Batalhão. Exemplos válidos: 10º BPM/M, 2º BPM/I, ROTA, 3º BPChq, BAEP.',
      dadoExtraido: null,
    };
  }

  return {
    proximaEtapa: 'cia',
    mensagemResposta: `✅ Batalhão registrado: *${texto}*. Agora informe a Companhia (ex: 1ª Cia).`,
    dadoExtraido: texto,
  };
}
