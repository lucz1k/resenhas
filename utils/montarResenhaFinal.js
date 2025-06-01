import { interpretarNaturezaPrefixo } from './proxy.js';
import { formatarTextoArmamentos } from './formatadores.js';

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

  const naturezaPorExtenso = interpretarNaturezaPrefixo(natureza);

  const formatarEnvolvidos = (grupo) =>
    Array.isArray(grupo) && grupo.length > 0 ? grupo.map(p => `- ${p}`).join('\n') : '';

  const veiculosTexto = Array.isArray(veiculos)
    ? veiculos
        .map(v => {
          const placa = v.placa ? v.placa : '';
          const modelo = v.modelo ? v.modelo : '';
          return (placa || modelo) ? `- ${placa} ${modelo}`.trim() : '';
        })
        .filter(Boolean)
        .join('\n')
    : veiculos;

  const objetosTexto = Array.isArray(objetos)
    ? objetos.filter(Boolean).map(o => `- ${o}`).join('\n')
    : objetos;

  const armamentosTexto = Array.isArray(armamentos)
    ? armamentos.filter(Boolean).map(formatarTextoArmamentos).join('\n\n')
    : armamentos;

  const historicoCompleto = formaAcionamento
    ? `Equipe ${formaAcionamento.toLowerCase()}. ${historico}`.trim()
    : historico;

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
    '',
    `*NATUREZA*: ${naturezaPorExtenso}`,
    `*COMPLEMENTO*: ${complementoNatureza}`,
    `*BOPM*: ${bopm}`,
    `*BOPC*: ${bopc} ${delegado ? '– ' + delegado : ''}`,
    '',
    `*ENDEREÇO*\n${endereco}`,
    '',
    `*EQUIPE*\n${equipe}`,
    '',
    apoios ? `*APOIOS*\n${apoios}` : '',
    '',
    `*ENVOLVIDOS*`,
    `*VÍTIMAS*\n${formatarEnvolvidos(envolvidos.vitimas)}`,
    '',
    `*AUTORES*\n${formatarEnvolvidos(envolvidos.autores)}`,
    '',
    `*TESTEMUNHAS*\n${formatarEnvolvidos(envolvidos.testemunhas)}`,
    '',
    veiculosTexto ? `*VEÍCULOS*\n${veiculosTexto}` : '',
    objetosTexto ? `*OBJETOS*\n${objetosTexto}` : '',
    armamentosTexto ? `*ARMAMENTOS*\n${armamentosTexto}` : '',
    '',
    `*HISTÓRICO*\n${historicoCompleto}`,
    '',
    '*VAMOS TODOS JUNTOS, NINGUÉM FICA PARA TRÁS*'
  ]
    .filter(Boolean)
    .join('\n\n');

  return resenha;
}
