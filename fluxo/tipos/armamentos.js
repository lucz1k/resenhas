export async function executarArmamentos(resposta, dados) {
  if (!dados.armamentos) dados.armamentos = [];

  const texto = resposta.trim();

  const encerrar = /^(não|nao|nenhum|fim|encerrar)$/i.test(texto);
  if (encerrar) {
    return {
      proximaEtapa: 'formaAcionamento',
      mensagemResposta: '🗣️ Como a equipe foi acionada para a ocorrência? (Despachada via COPOM, deparou-se na via, populares, ligação/mensagem)',
      dadoExtraido: dados.armamentos,
    };
  }

  const linhas = texto.split('\n').map(l => l.trim());
  const armamento = {};

  for (const linha of linhas) {
    if (/^tipo:/i.test(linha)) armamento.tipo = linha.replace(/^tipo:/i, '').trim();
    else if (/^calibre:/i.test(linha)) armamento.calibre = linha.replace(/^calibre:/i, '').trim();
    else if (/^numeração:/i.test(linha)) armamento.numeracao = linha.replace(/^numeração:/i, '').trim();
    else if (/^disparos:/i.test(linha)) armamento.disparos = linha.replace(/^disparos:/i, '').trim();
    else if (/^cápsulas:/i.test(linha)) armamento.capsulas = linha.replace(/^cápsulas:/i, '').trim();
    else if (/^munições:/i.test(linha)) armamento.municoes = linha.replace(/^munições:/i, '').trim();
  }

  if (!armamento.tipo || !armamento.calibre || !armamento.numeracao) {
    return {
      proximaEtapa: 'armamentos',
      mensagemResposta:
        '⚠️ Faltam campos obrigatórios. Envie no formato:\n\nTIPO: Pistola\nCALIBRE: .40\nNUMERAÇÃO: ABC12345\nDISPAROS: 3\nCÁPSULAS: 3\nMUNIÇÕES: 9',
      dadoExtraido: dados.armamentos,
    };
  }

  dados.armamentos.push(armamento);

  return {
    proximaEtapa: 'armamentos',
    mensagemResposta:
      '✅ Armamento registrado com sucesso.\nDeseja adicionar outro? Caso contrário, responda "não".',
    dadoExtraido: dados.armamentos,
  };
}
