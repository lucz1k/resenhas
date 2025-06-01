export async function executar(texto, dados, numero) {
  if (!texto || !texto.trim()) {
    return {
      proximaEtapa: determinarProximaEtapa(dados),
      mensagemResposta: '⚠️ Por favor, envie um texto válido.',
      dadoExtraido: null,
    };
  }

  const resposta = `Entendido. Informado: *${texto.trim()}*`;
  const proximaEtapa = determinarProximaEtapa(dados);

  return {
    proximaEtapa,
    mensagemResposta: resposta,
    dadoExtraido: texto.trim(),
  };
}

function determinarProximaEtapa(dados) {
  const chaves = Object.keys(dados);
  const etapas = [
    'grandeComando', 'batalhao', 'cia', 'pelotao', 'natureza', 'complementoNatureza',
    'data', 'hora', 'endereco', 'equipe', 'apoios', 'envolvidos', 'veiculos',
    'objetos', 'armamentos', 'formaAcionamento', 'historico'
  ];
  for (const etapa of etapas) {
    if (!chaves.includes(etapa)) return etapa;
  }
  return 'FINALIZAR';
}

export default { executar };
