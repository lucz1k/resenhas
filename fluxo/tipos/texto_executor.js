import { etapasFluxo } from '../etapasFluxo.js';

export async function executar(texto, dados, numero) {
  const entrada = texto?.trim();

  if (!entrada) {
    return {
      proximaEtapa: determinarProximaEtapa(dados),
      mensagemResposta: '⚠️ Por favor, envie um texto válido.',
      dadoExtraido: null,
    };
  }

  const proximaEtapa = determinarProximaEtapa(dados);
  let proximaPergunta = '';
  if (proximaEtapa !== 'FINALIZAR') {
    const etapaObj = etapasFluxo.find(et => et.chave === proximaEtapa);
    proximaPergunta = etapaObj?.pergunta ? `\n\n${etapaObj.pergunta}` : '';
  }

  const resposta = `Entendido. Informado: *${entrada}*.` + proximaPergunta;

  return {
    proximaEtapa,
    mensagemResposta: resposta,
    dadoExtraido: entrada,
  };
}

function determinarProximaEtapa(dados) {
  const etapas = [
    'grandeComando', 'batalhao', 'cia', 'pelotao', 'natureza', 'complementoNatureza',
    'bopm', 'bopc', 'delegado',
    'data', 'hora', 'endereco', 'equipe', 'apoios', 'envolvidos', 'veiculos',
    'objetos', 'armamentos', 'formaAcionamento', 'historico'
  ];

  for (const etapa of etapas) {
    if (!Object.prototype.hasOwnProperty.call(dados, etapa)) {
      return etapa;
    }
  }

  return 'FINALIZAR';
}

export default { executar };
