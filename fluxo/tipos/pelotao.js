import { etapasFluxo } from '../etapasFluxo.js';

export async function executarPelotao(resposta) {
  const entrada = resposta.trim().toLowerCase();

  // Se o usuário digitar "pular", registra em branco e avança
  if (entrada === 'pular') {
    const idxAtual = etapasFluxo.findIndex(et => et.chave === 'pelotao');
    const proximaPergunta = etapasFluxo[idxAtual + 1]?.pergunta;

    return {
      proximaEtapa: 'natureza',
      mensagemResposta: `ℹ️ Etapa do *Pelotão* ignorada.` + (proximaPergunta ? `\n\n${proximaPergunta}` : ''),
      dadoExtraido: '',
    };
  }

  const match = entrada.match(/^(\d{1,2})\s*(º|o|a)?\s*(pel|pelotao|pelotão)?/);

  if (!match) {
    return {
      proximaEtapa: 'natureza',
      mensagemResposta: '❌ Formato inválido para Pelotão. Exemplos válidos: *1º Pel*, *2 Pelotão*. Ou digite *pular* para ignorar.',
      dadoExtraido: null,
    };
  }

  const numero = parseInt(match[1], 10);
  if (numero < 1 || numero > 99) {
    return {
      proximaEtapa: 'natureza',
      mensagemResposta: '❌ Número de Pelotão inválido. Utilize um número entre *1* e *99*.',
      dadoExtraido: null,
    };
  }

  const pelotaoFormatado = `${numero}º Pel`;

  const idxAtual = etapasFluxo.findIndex(et => et.chave === 'pelotao');
  const proximaPergunta = etapasFluxo[idxAtual + 1]?.pergunta;

  return {
    proximaEtapa: 'natureza',
    mensagemResposta: `✅ Pelotão registrado: *${pelotaoFormatado}*.` + (proximaPergunta ? `\n\n${proximaPergunta}` : ''),
    dadoExtraido: pelotaoFormatado,
  };
}
