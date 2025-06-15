// fluxo/tipos/equipe.js

import { formatarTextoEquipe } from '../../utils/formatadores.js';

export async function executarEquipe(resposta, dados, numero) {
  const texto = resposta.trim();

  const equipe = {
    viatura: '',
    policiais: [],
  };

  // Regex para extrair viatura (aceita "VIATURA: M-10500" ou "M-10500" no início)
  const viaturaRegex = /(?:viatura\s*:?\s*)?([A-Za-z0-9\-]{4,})/i;
  const viaturaMatch = texto.match(viaturaRegex);
  if (viaturaMatch) {
    equipe.viatura = viaturaMatch[1].trim();
  }

  // Regex para extrair nomes com posto (aceita "Sd PM Fulano", "Cb PM Beltrano", etc)
  const nomesRegex = /\b(?:Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten|Al Of|Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)?\s*PM\s+[\wÀ-ÿ\s.'-]+/gi;
  const nomes = texto.match(nomesRegex);
  if (nomes) {
    equipe.policiais = nomes.map(n => n.trim());
  }

  if (!equipe.viatura && equipe.policiais.length === 0) {
    return {
      proximaEtapa: 'equipe',
      mensagemResposta:
        '⚠️ Não consegui identificar a viatura ou os policiais.\n\nEnvie no formato:\n\n' +
        '• M-10500 Sd PM Fulano e Sd PM Ciclano\n' +
        '• Ou:\nVIATURA: M-10101\n1º Ten PM Billy\nCb PM Souza\nSd PM Lima\n\n' +
        'Você pode informar a viatura seguida dos nomes dos policiais na mesma linha, separados por "e", vírgula ou nova linha.',
      dadoExtraido: equipe,
    };
  }

  return {
    proximaEtapa: 'apoios',
    mensagemResposta: `✅ Equipe registrada:\n${formatarTextoEquipe(equipe.viatura, equipe.policiais)}\n\nDeseja adicionar *viaturas de apoio?* (Ex: M-10002 CFP 1º TEN PM Costa, M-10501 - 2 Sgt PM Oliveira, CB PM Santos)\n\nSe não quiser informar apoios, responda *"pular"* ou *"não"*.`,
    dadoExtraido: equipe,
  };
}
