export async function executarBatalhao(resposta) {
  let texto = resposta.trim().toUpperCase();

  // Remove espaços extras e corrige abreviações comuns
  texto = texto.replace(/\s+/g, '');
  texto = texto.replace(/BPMM$/, 'BPM/M').replace(/BPMI$/, 'BPM/I');

  // Adiciona o "º" caso esteja ausente (ex: "10BPM/M" → "10º BPM/M")
  texto = texto.replace(/^(\d+)(BPM\/[MI])$/, (_, numero, tipo) => `${numero}º ${tipo}`);

  // Padrões válidos aceitos (batalhões convencionais e unidades especializadas)
  const padraoValido = /^(\d{1,2}º\sBPM\/[MI]|ROTA|BPTRAN|BAEP|[1-9]º\sBPCHQ|[1-9]º\sBPR|[1-9]º\sBPAMB|[1-9]º\sBPRV)$/;

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
