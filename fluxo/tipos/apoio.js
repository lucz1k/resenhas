// fluxo/tipos/apoio.js

import { formatarTextoApoio } from '../../utils/formatadores.js';

export async function executarApoio(inputUsuario, dadosProgresso, numero) {
  if (!dadosProgresso.apoios) {
    dadosProgresso.apoios = [];
  }

  const texto = inputUsuario.trim();

  // Verifica resposta negativa
  if (['não', 'nao', 'n', 'n.'].includes(texto.toLowerCase())) {
    return {
      proximaEtapa: 'envolvidos',
      mensagemResposta: 'Certo, não registrarei viaturas de apoio. Vamos prosseguir para os envolvidos. Digite os dados da vítima ou não para prosseguir [formato NOME - VITIMA (RG:XXXXX)]',
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
      mensagemResposta: `📝 Apoio registrado:\n${formatarTextoApoio(novaViatura)}\n\nDeseja adicionar outro apoio? Caso não deseje, responda "não".`,
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
