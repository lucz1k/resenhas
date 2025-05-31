import { interpretarNaturezaPrefixo } from './proxy.js';

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
    veiculos = '',
    objetos = '',
    armamentos = '',
    formaAcionamento = '',
    historico = ''
  } = dados;

  // Use a função para converter o código em texto
  const naturezaPorExtenso = interpretarNaturezaPrefixo(natureza);

  const formatarEnvolvidos = (grupo) => (grupo && grupo.length > 0 ? grupo.map(p => `- ${p}`).join('\n') : '');

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
    veiculos ? `*VEÍCULOS*\n${veiculos}\n` : '',
    objetos ? `*OBJETOS*\n${objetos}\n` : '',
    armamentos ? `*ARMAMENTOS*\n${armamentos}\n` : '',
    '',
    `*HISTÓRICO*\n${historico}`,
    '',
    '*VAMOS TODOS JUNTOS, NINGUÉM FICA PARA TRÁS*'
  ]
    .filter(Boolean)
    .join('\n\n');

  return resenha;
}
