export async function executarBatalhao(resposta) {
  let texto = resposta.trim().toUpperCase();

  // Substitui múltiplos espaços por um só
  texto = texto.replace(/\s+/g, ' ');

  // Aceita e converte formatos como "10M" ou "10I" para "10º BPM/M" ou "10º BPM/I"
  texto = texto.replace(/^(\d{1,2})\s*([MI])$/, (_, numero, tipo) => `${numero}º BPM/${tipo}`);

  // Corrige BPMM e BPMI para BPM/M e BPM/I
  texto = texto.replace(/BPMM$/, 'BPM/M').replace(/BPMI$/, 'BPM/I');

  // Adiciona o "º" caso esteja ausente (ex: "10 BPM/M" ou "10BPM/M" → "10º BPM/M")
  texto = texto.replace(/^(\d+)\s?BPM\/([MI])$/, (_, numero, tipo) => `${numero}º BPM/${tipo}`);

  // Aceita também formato já correto: "10º BPM/M" ou "10º BPM/I"
  // (não altera nada, apenas deixa passar)

  // Padrões válidos aceitos (batalhões convencionais e unidades especializadas)
  const padraoValido = /^(\d{1,2}º BPM\/[MI]|ROTA|BPTRAN|BAEP|[1-9]º BPCHQ|[1-9]º BPR|[1-9]º BPAMB|[1-9]º BPRV)$/;

  if (!padraoValido.test(texto)) {
    return {
      proximaEtapa: 'batalhao',
      mensagemResposta: '❌ Formato inválido para Batalhão. Exemplos válidos: 10M, 10I, 10º BPM/M, 10º BPM/I, ROTA, 3º BPChq, BAEP.',
      dadoExtraido: null,
    };
  }

  return {
    proximaEtapa: 'cia',
    mensagemResposta: `✅ Batalhão registrado: *${texto}*. Agora informe a *Companhia* (ex: 1, 2, 3).`,
    dadoExtraido: texto,
  };
}
