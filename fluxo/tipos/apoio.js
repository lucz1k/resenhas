// fluxo/tipos/apoio.js

import { formatarTextoApoio } from '../../utils/formatadores.js';

export async function executarApoio(inputUsuario, dadosProgresso, numero) {
  if (!dadosProgresso.apoios) {
    dadosProgresso.apoios = [];
  }

  const texto = inputUsuario.trim();

  if (texto.toLowerCase() === 'não' || texto.toLowerCase() === 'nao') {
    return {
      proximaEtapa: 'envolvidos',
      mensagemResposta: 'Certo, não registrarei viaturas de apoio. Vamos prosseguir para os envolvidos.',
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
    parte = parte.trim();
    if (parte.toLowerCase().startsWith('viatura:')) {
      novaViatura.viatura = parte.replace(/viatura:/i, '').trim();
    } else if (parte.toLowerCase().startsWith('autoridade:')) {
      novaViatura.autoridade = parte.replace(/autoridade:/i, '').trim();
    } else if (parte) {
      novaViatura.policiais.push(parte);
    }
  }

  if (novaViatura.viatura || novaViatura.autoridade || novaViatura.policiais.length > 0) {
    dadosProgresso.apoios.push(novaViatura);

    return {
      proximaEtapa: 'apoios',
      mensagemResposta: `📝 Apoio registrado:\n${formatarTextoApoio(novaViatura)}\n\nDeseja adicionar outro apoio? Caso não deseje, responda "não".`,
      dadoExtraido: dadosProgresso.apoios,
    };
  }

  return {
    proximaEtapa: 'apoios',
    mensagemResposta: '⚠️ Não consegui entender os dados do apoio. Por favor, envie no formato:\n\nVIATURA: 10502\nAUTORIDADE: 1º Ten PM Cardoso\nCb PM Souza\nSd PM Lima\n\nOu apenas alguns desses campos.',
    dadoExtraido: dadosProgresso.apoios,
  };
}
