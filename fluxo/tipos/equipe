// fluxo/tipos/equipe.js

import { formatarTextoEquipe } from '../../utils/formatadores.js';

export async function executarEquipe(resposta, dados, numero) {
  const viaturaRegex = /viatura\s*:?\s*([A-Za-z0-9-]+)/i;
  const nomesRegex = /(?:|Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten| Al Of| Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)?\s*PM\s+[\wÀ-ÿ\s.'-]+/gi;

  const equipe = {
    viatura: '',
    policiais: [],
  };

  // Extrai viatura
  const viaturaMatch = resposta.match(viaturaRegex);
  if (viaturaMatch) {
    equipe.viatura = viaturaMatch[1].trim();
  }

  // Extrai nomes
  const nomes = resposta.match(nomesRegex);
  if (nomes && nomes.length > 0) {
    equipe.policiais = nomes.map(n => n.trim());
  }

  if (!equipe.viatura && equipe.policiais.length === 0) {
    return {
      proximaEtapa: 'equipe',
      mensagemResposta: '⚠️ Por favor, informe a viatura e os policiais da equipe no seguinte formato:\n\nVIATURA: M-10101\n1º Ten PM Billy\nCb PM Souza\nSd PM Lima',
      dadoExtraido: equipe,
    };
  }

  return {
    proximaEtapa: 'apoios',
    mensagemResposta: `✅ Equipe registrada:\n${formatarTextoEquipe(equipe)}\n\nDeseja adicionar algum apoio?`,
    dadoExtraido: equipe,
  };
}
