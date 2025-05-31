export async function executarBatalhao(resposta) {
  let texto = resposta.trim().toUpperCase();

  // Corrigir pequenos erros de digitação comuns
  texto = texto.replace(/\s+/g, ''); // Remove espaços
  texto = texto.replace(/BPMM$/, 'BPM/M').replace(/BPMI$/, 'BPM/I');

  // Corrigir casos sem o º
  texto = texto.replace(/^(\d+)(BPM\/[MI])$/, (_, numero, tipo) => `${numero}º ${tipo}`);

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
    mensagemResposta: `Batalhão registrado: *${texto}*`,
    dadoExtraido: `*${texto}*`,
  };
}
