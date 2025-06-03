// fluxo/tipos/apoio.js

import { formatarTextoApoio } from '../../utils/formatadores.js';

export async function executarApoio(inputUsuario, dadosProgresso, numero) {
  if (!dadosProgresso.apoios) {
    dadosProgresso.apoios = [];
  }

  const texto = inputUsuario.trim();

  // Verifica se o usuário deseja pular a etapa
  if (['pular', 'pula', 'skip', 'ignorar'].includes(texto.toLowerCase())) {
    return {
      proximaEtapa: 'envolvidos',
      mensagemResposta: 'Etapa de apoio ignorada. Vamos prosseguir para os envolvidos. Digite os dados da *vítima* ou *pular* para seguir adiante [NOME (RG:XXXXX) - VÍTIMA]',
      dadoExtraido: dadosProgresso.apoios,
    };
  }

  const novaViatura = {
    viatura: '',
    autoridade: '',
    policiais: [],
  };

  const partes = texto.split('\n');

  for (let parte of partes) {
    const linha = parte.trim();

    if (/^viatura:/i.test(linha)) {
      novaViatura.viatura = linha.replace(/^viatura:/i, '').trim();
    } else if (/^autoridade:/i.test(linha)) {
      novaViatura.autoridade = linha.replace(/^autoridade:/i, '').trim();
    } else if (linha) {
      novaViatura.policiais.push(linha);
    }
  }

  const apoioVálido =
    novaViatura.viatura ||
    novaViatura.autoridade ||
    novaViatura.policiais.length > 0;

  if (apoioVálido) {
    dadosProgresso.apoios.push(novaViatura);

    return {
      proximaEtapa: 'apoios',
      mensagemResposta: `📝 Apoio registrado:\n${formatarTextoApoio(novaViatura)}\n\nDeseja adicionar *outro apoio*? Caso não deseje, responda *"pular"*.`,
      dadoExtraido: dadosProgresso.apoios,
    };
  }

  return {
    proximaEtapa: 'apoios',
    mensagemResposta:
      '⚠️ Não consegui entender os dados do apoio. Envie no formato:\n\nVIATURA: 10502\nAUTORIDADE: 1º Ten PM Cardoso\nCb PM Souza\nSd PM Lima\n\nOu apenas alguns desses campos.',
    dadoExtraido: dadosProgresso.apoios,
  };
}
