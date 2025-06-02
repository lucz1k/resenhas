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
    Array.isArray(grupo) && grupo.length > 0 ? grupo.map(p => `- ${p}`).join('\n') : '';

  const veiculosTexto = Array.isArray(veiculos)
    ? veiculos
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

  const historicoCompleto = formaAcionamento
    ? `Equipe ${formaAcionamento.toLowerCase()}. \n\n${historico}`.trim()
    : historico;

  // Formatação correta para equipe
  let equipeTexto = '';
  if (Array.isArray(equipe)) {
    equipeTexto = equipe.map(eq => formatarTextoEquipe(eq.viatura, eq.policiais)).join('\n');
  } else if (equipe && typeof equipe === 'object') {
    equipeTexto = formatarTextoEquipe(equipe.viatura, equipe.policiais);
  } else {
    equipeTexto = equipe || '';
  }

  // Formatação correta para apoios
  let apoiosTexto = '';
  if (Array.isArray(apoios)) {
    apoiosTexto = apoios.map(formatarTextoApoio).join('\n');
  } else if (apoios && typeof apoios === 'object') {
    apoiosTexto = formatarTextoApoio(apoios);
  } else {
    apoiosTexto = apoios || '';
  }

  // Montagem fiel ao modelo solicitado
  const resenha = [
    `*SECRETARIA DA SEGURANÇA PÚBLICA*`,
    `*POLÍCIA MILITAR DO ESTADO DE SÃO PAULO*`,
    `*${grandeComando}*`,
    `*${batalhao}*`,
    `*${cia}*`,
    `*${pelotao}*`,
    '',
    `*DATA*: ${data}`,
    `*HORA*: ${hora}`,
    `*ENDEREÇO*`,
    endereco && `${endereco}`,
    '',
    `*NATUREZA*: ${naturezaPorExtenso}`,
    complementoNatureza && `*COMPLEMENTO*: ${complementoNatureza}`,
    bopm && `*BOPM*: ${bopm}`,
    bopc && `*BOPC*: ${bopc}`,
    delegado && `*DELEGADO*: ${delegado}`,
    '',
    `*EQUIPE*`,
    equipeTexto,
    '',
    `*APOIOS*`,
    apoiosTexto,
    '',
    `*ENVOLVIDOS*`,
    `*VÍTIMAS*`,
    formatarEnvolvidos(envolvidos.vitimas),
    `*AUTORES*`,
    formatarEnvolvidos(envolvidos.autores),
    `*TESTEMUNHAS*`,
    formatarEnvolvidos(envolvidos.testemunhas),
    '',
    veiculosTexto && `*VEÍCULOS*\n${veiculosTexto}`,
    objetosTexto && `*OBJETOS*\n${objetosTexto}`,
    armamentosTexto && `*ARMAMENTOS*\n${armamentosTexto}`,
    '',
    `*HISTÓRICO*`,
    historicoCompleto,
    '',
    '*VAMOS TODOS JUNTOS, NINGUÉM FICA PARA TRÁS*'
  ]
    .filter(Boolean) // Remove apenas linhas "falsas", mantém as vazias
    .join('\n');

  return resenha;
}
