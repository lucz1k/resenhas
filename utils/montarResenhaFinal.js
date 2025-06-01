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
    '',
    `*EQUIPE*`,
    equipe && `${equipe}`,
    '',
    `*APOIOS*`,
    apoios && `${apoios}`,
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
    .filter((linha, idx, arr) => {
      // Remove linhas falsas/vazias e mantém apenas uma linha em branco seguida
      if (!linha) return false;
      if (linha === '' && arr[idx - 1] === '') return false;
      return true;
    })
    .join('\n');

  return resenha;
}
