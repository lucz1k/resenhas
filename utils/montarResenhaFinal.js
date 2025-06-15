import { interpretarNaturezaPrefixo } from './proxy.js';
import { formatarTextoArmamentos, formatarTextoEquipe, formatarTextoApoio } from './formatadores.js';

export async function montarResenhaFinal(dados) {
  const {
    grandeComando = '',
    batalhao = '',
    cia = '',
    pelotao = '',
    data = '',
    hora = '',
    natureza = '',
    complementoNatureza = '',
    bopm = '',
    bopc = '',
    delegado = '',
    endereco = '',
    equipe = '',
    apoios = '',
    envolvidos = {},
    veiculos = [],
    objetos = [],
    armamentos = [],
    formaAcionamento = '',
    historico = ''
  } = dados;

  const naturezaCodigo = typeof natureza === 'string' ? natureza : natureza?.codigo || '';
  const naturezaDescricao = typeof natureza === 'object' ? natureza?.descricao : '';
  const naturezaPorExtenso = naturezaCodigo && naturezaDescricao
    ? `${naturezaCodigo} – ${naturezaDescricao}`
    : interpretarNaturezaPrefixo(natureza);

  const formatarEnvolvidos = (grupo) =>
    Array.isArray(grupo) && grupo.length > 0
      ? grupo.filter(Boolean).map(p => `- ${p}`).join('\n')
      : '';

  const veiculosTexto = Array.isArray(veiculos)
    ? veiculos
        .filter(v => (v.placa && v.placa.trim()) || (v.modelo && v.modelo.trim()))
        .map(v => {
          const placa = v.placa || '';
          const modelo = v.modelo || '';
          return (placa || modelo) ? `- ${placa} ${modelo}`.trim() : '';
        })
        .filter(Boolean)
        .join('\n')
    : veiculos;

  const objetosTexto = Array.isArray(objetos)
    ? objetos.filter(Boolean).map(o => `- ${o}`).join('\n')
    : objetos;

  const armamentosTexto = Array.isArray(armamentos)
    ? armamentos.filter(Boolean).map(formatarTextoArmamentos).join('\n')
    : armamentos;

  const historicoCompleto = historico;

  // Formatação correta para equipe
  let equipeTexto = '';
  if (Array.isArray(equipe)) {
    equipeTexto = equipe
      .filter(eq => eq && (eq.viatura || (eq.policiais && eq.policiais.length)))
      .map(eq => formatarTextoEquipe(eq.viatura, eq.policiais))
      .filter(Boolean)
      .join('\n');
  } else if (equipe && typeof equipe === 'object' && (equipe.viatura || (equipe.policiais && equipe.policiais.length))) {
    equipeTexto = formatarTextoEquipe(equipe.viatura, equipe.policiais);
  } else if (typeof equipe === 'string' && equipe.trim()) {
    equipeTexto = equipe;
  }

  // Formatação correta para apoios
  let apoiosTexto = '';
  if (Array.isArray(apoios)) {
    apoiosTexto = apoios
      .filter(a => a && (a.viatura || (a.policiais && a.policiais.length)))
      .map(formatarTextoApoio)
      .filter(Boolean)
      .join('\n');
  } else if (apoios && typeof apoios === 'object' && (apoios.viatura || (apoios.policiais && apoios.policiais.length))) {
    apoiosTexto = formatarTextoApoio(apoios);
  } else if (typeof apoios === 'string' && apoios.trim()) {
    apoiosTexto = apoios;
  }

  // Checa se há algum envolvido
  const temEnvolvidos =
    (envolvidos.vitimas && envolvidos.vitimas.length > 0) ||
    (envolvidos.autores && envolvidos.autores.length > 0) ||
    (envolvidos.testemunhas && envolvidos.testemunhas.length > 0);

  const blocoEnvolvidos = temEnvolvidos
    ? [
        '*ENVOLVIDOS*',
        (envolvidos.vitimas && envolvidos.vitimas.length > 0) && '*VÍTIMAS*',
        formatarEnvolvidos(envolvidos.vitimas),
        (envolvidos.autores && envolvidos.autores.length > 0) && '*AUTORES*',
        formatarEnvolvidos(envolvidos.autores),
        (envolvidos.testemunhas && envolvidos.testemunhas.length > 0) && '*TESTEMUNHAS*',
        formatarEnvolvidos(envolvidos.testemunhas),
        ''
      ]
    : [];

  // Montagem fiel ao modelo solicitado, mas só inclui linhas não vazias
  const resenha = [
    `*SECRETARIA DA SEGURANÇA PÚBLICA*`,
    `*POLÍCIA MILITAR DO ESTADO DE SÃO PAULO*`,
    grandeComando && `*${grandeComando}*`,
    batalhao && `*${batalhao}*`,
    cia && `*${cia}*`,
    pelotao && `*${pelotao}*`,
    '',
    data && `*DATA*: ${data}`,
    hora && `*HORA*: ${hora}`,
    endereco && `*ENDEREÇO*`,
    endereco && endereco.toUpperCase(),
    '',
    naturezaPorExtenso && `*NATUREZA*: ${naturezaPorExtenso}`,
    complementoNatureza && `*COMPLEMENTO*: ${complementoNatureza}`,
    bopm && `*BOPM*: ${bopm}`,
    bopc && `*BOPC*: ${bopc}`,
    delegado && `*DELEGADO*: ${delegado}`,
    '',
    equipeTexto && `*EQUIPE*`,
    equipeTexto,
    '',
    apoiosTexto && `*APOIOS*`,
    apoiosTexto,
    '',
    ...blocoEnvolvidos,
    veiculosTexto && `*VEÍCULOS*\n${veiculosTexto}`,
    objetosTexto && `*OBJETOS*\n${objetosTexto}`,
    armamentosTexto && `*ARMAMENTOS*\n${armamentosTexto}`,
    '',
    `*HISTÓRICO*`,
    historicoCompleto,
    '',
    '*VAMOS TODOS JUNTOS, NINGUÉM FICA PARA TRÁS*'
  ]
    // Remove linhas vazias, nulas ou só com espaços para evitar blocos em branco
    .filter(linha => typeof linha === 'string' && linha.trim().length > 0);

  let textoFinal = resenha.join('\n');
  // Remove múltiplas linhas em branco consecutivas
  textoFinal = textoFinal.replace(/\n{3,}/g, '\n\n');
  return textoFinal;
}
