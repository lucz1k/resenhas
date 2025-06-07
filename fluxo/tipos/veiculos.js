// fluxo/tipos/veiculos.js

export async function executarVeiculos(resposta, dados) {
  if (!dados.veiculos) {
    dados.veiculos = [];
  }

  const entrada = resposta.trim();

  // Verifica se o usuário deseja encerrar
  if (/^(não|nao|nenhum|fim|encerrar|pular)$/i.test(entrada)) {
    return {
      proximaEtapa: 'objetos',
      mensagemResposta:
        '✅ Etapa de *veículos* finalizada.\n\nDeseja registrar *objetos* relacionados à ocorrência?\n\nExemplos de *objetos*: *celulares*, *bolsas*, *drogas*, *documentos*, etc.\nExemplo de resposta: *celular Samsung*, *bolsa preta*, *carteira com documentos*.\n\nSe não houver *objetos*, responda "*não*" ou "*pular*".',
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

  let placa = (entrada.match(placaRegex)?.[1] || '').toUpperCase().trim();
  let modelo = (entrada.match(modeloRegex)?.[1] || '').trim();

  // Aceita formatos simples: "placa/modelo", "placa - modelo", "placa, modelo"
  if (!placa || !modelo) {
    const simples = entrada.match(/^([a-zA-Z0-9\-\/]{6,10})[\s,\/-]+(.+)$/i);
    if (simples) {
      placa = simples[1].toUpperCase().trim();
      modelo = simples[2].trim();
    }
  }

  const veiculo = {
    placa,
    modelo,
    cor: (entrada.match(corRegex)?.[1] || '').trim(),
    marca: (entrada.match(marcaRegex)?.[1] || '').trim(),
    ano: (entrada.match(anoRegex)?.[1] || '').trim(),
    chassi: (entrada.match(chassiRegex)?.[1] || '').trim(),
    situacao: (entrada.match(situacaoRegex)?.[1] || '').trim(),
  };

  if (!veiculo.placa || !veiculo.modelo) {
    return {
      proximaEtapa: 'veiculos',
      mensagemResposta:
        '⚠️ Por favor, informe pelo menos a *placa* e o *modelo* do veículo.\n\n' +
        'Você pode informar de forma *simples* ou *detalhada*:\n' +
        '• *Simples*: "ABC1A34, Civic"\n' +
        '• *Simples*: "EDF3D33/Civic"\n' +
        '• *Simples*: "EDF3D33 - Civic"\n' +
        '• *Detalhado*: "Placa: ABC1A34, Modelo: Civic, Cor: Prata, Marca: Honda, Ano: 2020"\n\n' +
        'Envie um *veículo* por vez. Quando terminar, responda "*não*" ou "*pular*".',
      dadoExtraido: dados.veiculos,
    };
  }

  dados.veiculos.push(veiculo);

  return {
    proximaEtapa: 'veiculos',
    mensagemResposta:
      '✅ *Veículo* registrado.\nDeseja adicionar outro *veículo*?\n\n' +
      'Exemplos:\n' +
      '• *Simples*: "ABC1A34, Civic"\n' +
      '• *Simples*: "EDF3D33/Civic"\n' +
      '• *Simples*: "EDF3D33 - Civic"\n' +
      '• *Detalhado*: "Placa: ABC1A34, Modelo: Civic, Cor: Prata, Marca: Honda, Ano: 2020"\n\n' +
      'Se não houver mais *veículos*, responda "*não*" ou "*pular*".',
    dadoExtraido: dados.veiculos,
  };
}
