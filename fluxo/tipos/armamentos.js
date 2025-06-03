export async function executarArmamentos(resposta, dados) {
  if (!dados.armamentos) dados.armamentos = [];

  const texto = resposta.trim();

  const encerrar = /^(não|nao|nenhum|fim|encerrar|pular)$/i.test(texto);
  if (encerrar) {
    return {
      proximaEtapa: 'formaAcionamento',
      mensagemResposta: '🗣️ Como a equipe *foi acionada para a ocorrência?* (Despachada via COPOM, deparou-se na via, populares, ligação/mensagem)',
      dadoExtraido: dados.armamentos,
    };
  }

  const linhas = texto.split('\n').map(l => l.trim());
  let armamento = {};

  // Tenta extrair campos nomeados
  for (const linha of linhas) {
    if (/^tipo:/i.test(linha)) armamento.tipo = linha.replace(/^tipo:/i, '').trim();
    else if (/^calibre:/i.test(linha)) armamento.calibre = linha.replace(/^calibre:/i, '').trim();
    else if (/^numera[çc][aã]o:/i.test(linha)) armamento.numeracao = linha.replace(/^numera[çc][aã]o:/i, '').trim();
    else if (/^disparos?:/i.test(linha)) armamento.disparos = linha.replace(/^disparos?:/i, '').trim();
    else if (/^c[aá]psulas?:/i.test(linha)) armamento.capsulas = linha.replace(/^c[aá]psulas?:/i, '').trim();
    else if (/^muni[cç][aã]o[eé]s?:/i.test(linha)) armamento.municoes = linha.replace(/^muni[cç][aã]o[eé]s?:/i, '').trim();
  }

  // Se não encontrou campos nomeados, tenta formato simples: "pistola, 32131, 02, 01, 05"
  if (!armamento.tipo || !armamento.numeracao) {
    const simples = texto.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    if (simples.length >= 3) {
      armamento = {
        tipo: simples[0] || '',
        numeracao: simples[1] || '',
        disparos: simples[2] || '',
        capsulas: simples[3] || '',
        municoes: simples[4] || '',
      };
    }
  }

  if (!armamento.tipo || !armamento.numeracao) {
    return {
      proximaEtapa: 'armamentos',
      mensagemResposta:
        '⚠️ Faltam campos obrigatórios. Envie no formato:\n\nTIPO: Pistola\nCALIBRE: .40\nNUMERAÇÃO: ABC12345\nDISPAROS: 3\nCÁPSULAS: 3\nMUNIÇÕES: 9\nOu: pistola, 32131, 02, 01, 05',
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
