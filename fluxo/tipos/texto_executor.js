export async function executar(texto, dados, numero) {
  const entrada = texto?.trim();

  if (!entrada) {
    return {
      proximaEtapa: determinarProximaEtapa(dados),
      mensagemResposta: '⚠️ Por favor, envie um texto válido.',
      dadoExtraido: null,
    };
  }

  const resposta = `Entendido. Informado: *${entrada}* digite proxima etapa.`;
  const proximaEtapa = determinarProximaEtapa(dados);

  return {
    proximaEtapa,
    mensagemResposta: resposta,
    dadoExtraido: entrada,
  };
}

function determinarProximaEtapa(dados) {
  const etapas = [
    'grandeComando', 'batalhao', 'cia', 'pelotao', 'natureza', 'complementoNatureza',
    'data', 'hora', 'endereco', 'equipe', 'apoios', 'envolvidos', 'veiculos',
    'objetos', 'armamentos', 'formaAcionamento', 'historico',
    'bopm', 'bopc', 'delegado'
  ];

  for (const etapa of etapas) {
    if (!Object.prototype.hasOwnProperty.call(dados, etapa)) {
      return etapa;
    }
  }

  return 'FINALIZAR';
}

export default { executar };
