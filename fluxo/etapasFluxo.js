import { executores } from './executores.js';
export const etapasFluxo = [
  {
    chave: 'grandeComando',
    pergunta: 'Qual o *GRANDE COMANDO* da ocorrência?',
    tipo: 'grandeComando',
  },
  {
    chave: 'batalhao',
    pergunta: 'Qual o *BATALHÃO* da ocorrência?',
    tipo: 'batalhao',
  },
  {
    chave: 'cia',
    pergunta: 'Qual a *CIA* da ocorrência?',
    tipo: 'cia',
  },
  {
    chave: 'pelotao',
    pergunta: 'Qual o *PELOTÃO* da ocorrência?',
    tipo: 'pelotao',
  },
  {
    chave: 'natureza',
    pergunta: 'Qual a *natureza* da ocorrência? (Ex: *C04*)',
    tipo: 'natureza',
  },
  {
    chave: 'complementoNatureza',
    pergunta: 'Deseja complementar a *natureza*? (Ex: *tentado*, *consumado*, *envolvendo policial militar*)',
    tipo: 'complementoNatureza',
  },
  {
    chave: 'bopm',
    pergunta: 'Qual o número do *BOPM*?',
    tipo: 'bopm',
  },
  {
    chave: 'bopc',
    pergunta: 'Qual o número do *BOPC*? (*digite não ou pular*)',
    tipo: 'bopc',
  },
  {
    chave: 'delegado',
    pergunta: 'Qual o nome do *delegado* responsável? (*digite não ou pular*)',
    tipo: 'delegado',
  },
  {
    chave: 'data',
    pergunta: 'Qual a *data* dos fatos? (Ex: *hoje*, *25 de maio*, *25mai25*)',
    tipo: 'data',
  },
  {
    chave: 'hora',
    pergunta: 'Qual o *horário* dos fatos? (Ex: *agora*, *15:30*, *1530*, *15*)',
    tipo: 'hora',
  },
  {
    chave: 'endereco',
    pergunta: 'Qual o *endereço* da ocorrência? (Ex: *Rua X, nº Y - Cidade*)',
    tipo: 'endereco',
  },

  // Bloco 2 - EQUIPE E APOIOS
  {
    chave: 'equipe',
    pergunta: 'Qual a *equipe* que atendeu? Informe a *viatura* e os nomes dos *policiais*. (Ex: *M-10500* - 1 Sgt PM Silva, CB PM Souza)',
    tipo: 'equipe',
  },
  {
    chave: 'apoios',
    pergunta: 'Deseja adicionar *viaturas de apoio*? (Ex: *M-10002* - CFP 1º TEN PM Costa, *M-10501* - 2 Sgt PM Oliveira, CB PM Santos)',
    tipo: 'apoio',
  },

  // Bloco 3 - ENVOLVIDOS
  {
    chave: 'envolvidos',
    pergunta: 'Deseja adicionar *envolvidos* (*vítimas*, *autores*, *testemunhas*)?\nExemplo: *João da Silva* (RG: 123456789) - *vítima*, *Maria de Souza* (RG: 987654321) - *autora*',
    tipo: 'envolvidos',
  },
  // Bloco 4 - VEÍCULOS
  {
    chave: 'veiculos',
    pergunta:
      'Deseja adicionar *veículos* relacionados à ocorrência? (*placa* e *modelo* são obrigatórios)\n' +
      'Exemplos:\n' +
      '• *Simples*: "ABC1A34, Civic"\n' +
      '• *Simples*: "EDF3D33/Civic"\n' +
      '• *Simples*: "EDF3D33 - Civic"\n' +
      '• *Detalhado*: "Placa: ABC1A34, Modelo: Civic, Cor: Prata, Marca: Honda, Ano: 2020"\n\n' +
      'Envie um *veículo* por vez. Quando terminar, responda "*não*".',
    tipo: 'veiculos',
  },

  // Bloco 5 - OBJETOS
  {
    chave: 'objetos',
    pergunta:
      'Deseja registrar *objetos* relacionados à ocorrência?\n\n' +
      'Exemplos de *objetos*: *celulares*, *bolsas*, *drogas*, *documentos*, etc.\n' +
      'Exemplo de resposta: *celular Samsung*, *bolsa preta*, *carteira com documentos*.\n\n' +
      'Se não houver *objetos*, responda "*não*".',
    tipo: 'objetos',
  },
  // Bloco 6 - ARMAMENTOS
  {
    chave: 'armamentos',
    pergunta:
      'Deseja adicionar *armamentos* envolvidos na ocorrência?\n' +
      '(Tipo, numeração, calibre, disparos, cápsulas, munições)\n' +
      'Exemplo: *Pistola Glock 17*, numeração *123456789*, calibre *9mm*, disparos: *3*, cápsulas: *3*',
    tipo: 'armamentos',
  },

  // Bloco 7 - FORMA DE ACIONAMENTO
  {
    chave: 'formaAcionamento',
    pergunta: 'Como a *equipe* foi acionada para a ocorrência? (Ex: *Despachada via COPOM*, *deparou-se na via*, *populares*, *ligação/mensagem*)',
    tipo: 'formaAcionamento',
  },

  // Bloco 8 - HISTÓRICO
  {
    chave: 'historico',
    pergunta: 'Descreva os *fatos* da ocorrência para que possamos gerar o *histórico* final.',
    tipo: 'historico',
  },
];

for (const etapa of etapasFluxo) {
  if (!executores[etapa.tipo]) {
    throw new Error(`Executor não encontrado para o tipo: ${etapa.tipo}`);
  }
  etapa.executar = executores[etapa.tipo];
}