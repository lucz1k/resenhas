// fluxo/tipos/veiculos.js

export async function executarVeiculos(resposta, dados) {
  if (!dados.veiculos) {
    dados.veiculos = [];
  }

  const entrada = resposta.trim();

  // Verifica se o usuário deseja encerrar
  if (/^(não|nao|nenhum|fim|encerrar)$/i.test(entrada)) {
    return {
      proximaEtapa: 'objetos',
      mensagemResposta: '✅ Entendido. Deseja registrar objetos relacionados à ocorrência?',
      dadoExtraido: dados.veiculos,
    };
  }

  // Expressões regulares para extração de dados
  const placaRegex = /placa\s*[:\-]?\s*([A-Z]{3}\d{1}[A-Z0-9]{1}\d{2}|\w{7})/i;
  const modeloRegex = /modelo\s*[:\-]?\s*([^\n,]+)/i;
  const corRegex = /cor\s*[:\-]?\s*([^\n,]+)/i;
  const marcaRegex = /marca\s*[:\-]?\s*([^\n,]+)/i;
  const anoRegex = /ano\s*[:\-]?\s*(\d{4})/i;
  const chassiRegex = /chassi\s*[:\-]?\s*([\w\d]+)/i;
  const situacaoRegex = /situa[çc]ão\s*[:\-]?\s*([^\n,]+)/i;

  const veiculo = {
    placa: (entrada.match(placaRegex)?.[1] || '').toUpperCase().trim(),
    modelo: (entrada.match(modeloRegex)?.[1] || '').trim(),
    cor: (entrada.match(corRegex)?.[1] || '').trim(),
    marca: (entrada.match(marcaRegex)?.[1] || '').trim(),
    ano: (entrada.match(anoRegex)?.[1] || '').trim(),
    chassi: (entrada.match(chassiRegex)?.[1] || '').trim(),
    situacao: (entrada.match(situacaoRegex)?.[1] || '').trim(),
  };

  if (!veiculo.placa || !veiculo.modelo) {
    return {
      proximaEtapa: 'veiculos',
      mensagemResposta: '⚠️ Por favor, informe pelo menos a *placa* e o *modelo* do veículo.',
      dadoExtraido: dados.veiculos,
    };
  }

  dados.veiculos.push(veiculo);

  return {
    proximaEtapa: 'veiculos',
    mensagemResposta: '✅ Veículo registrado. Deseja adicionar outro? Se não, responda "não".',
    dadoExtraido: dados.veiculos,
  };
}
