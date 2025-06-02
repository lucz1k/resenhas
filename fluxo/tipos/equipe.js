// fluxo/tipos/equipe.js

import { formatarTextoEquipe } from '../../utils/formatadores.js';

export async function executarEquipe(resposta, dados, numero) {
  const texto = resposta.trim();

  const equipe = {
    viatura: '',
    policiais: [],
  };

  // Regex para extrair viatura
  const viaturaRegex = /viatura\s*:?\s*([A-Za-z0-9\-]+)/i;
  const viaturaMatch = texto.match(viaturaRegex);
  if (viaturaMatch) {
    equipe.viatura = viaturaMatch[1].trim();
  }

  // Regex para extrair nomes com posto
  const nomesRegex = /\b(?:Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten|Al Of|Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)?\s*PM\s+[\wÀ-ÿ\s.'-]+/gi;
  const nomes = texto.match(nomesRegex);
  if (nomes) {
    equipe.policiais = nomes.map(n => n.trim());
  }

  if (!equipe.viatura && equipe.policiais.length === 0) {
    return {
      proximaEtapa: 'equipe',
      mensagemResposta:
        '⚠️ Não consegui identificar a viatura ou os policiais. Envie no formato:\n\nVIATURA: M-10101\n1º Ten PM Billy\nCb PM Souza\nSd PM Lima',
      dadoExtraido: equipe,
    };
  }

  return {
    proximaEtapa: 'apoios',
    mensagemResposta: `✅ Equipe registrada:\n${formatarTextoEquipe(equipe.viatura, equipe.policiais)}\n\nDeseja adicionar viaturas de apoio? (Ex: M-10002 - CFP 1º TEN PM Costa, M-10501 - 2 Sgt PM Oliveira, CB PM Santos)`,
    dadoExtraido: equipe,
  };
}
