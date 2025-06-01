import { executores } from './executores.js';
export const etapasFluxo = [
  {
    chave: 'grandeComando',
    pergunta: 'Qual o GRANDE COMANDO da ocorrência?',
    tipo: 'texto',
  },
  {
    chave: 'batalhao',
    pergunta: 'Qual o BATALHÃO da ocorrência?',
    tipo: 'texto',
  },
  {
    chave: 'cia',
    pergunta: 'Qual a CIA da ocorrência?',
    tipo: 'texto',
  },
  {
    chave: 'pelotao',
    pergunta: 'Qual o PELOTÃO da ocorrência?',
    tipo: 'texto',
  },
  {
    chave: 'natureza',
    pergunta: 'Qual a natureza da ocorrência (ex: C04)?',
    tipo: 'texto',
  },
  {
    chave: 'complementoNatureza',
    pergunta: 'Complemento da ocorrência (tentado, consumado, envolvendo policial militar etc)',
    tipo: 'textoOpcional',
  },
  {
    chave: 'data',
    pergunta: 'Qual a data dos fatos? (Ex: hoje, 25 de maio, 25mai25)',
    tipo: 'data',
  },
  {
    chave: 'hora',
    pergunta: 'Qual o horário dos fatos? (Ex: agora, 15:30, 1530)',
    tipo: 'hora',
  },
  {
    chave: 'endereco',
    pergunta: 'Qual o endereço da ocorrência? (Ou envie a localização)',
    tipo: 'endereco',
  },

  // Bloco 2 - EQUIPE E APOIOS
  {
    chave: 'equipe',
    pergunta: 'Qual a equipe que atendeu? Informe a viatura e os nomes dos policiais.',
    tipo: 'equipe',
  },
  {
    chave: 'apoios',
    pergunta: 'Deseja adicionar viaturas de apoio?',
    tipo: 'apoio',
  },

  // Bloco 3 - ENVOLVIDOS
  {
    chave: 'envolvidos',
    pergunta: 'Deseja adicionar envolvidos (vítimas, autores, testemunhas)?',
    tipo: 'envolvidos',
  },
   // Bloco 4 - VEÍCULOS
  {
    chave: 'veiculos',
    pergunta: 'Deseja adicionar veículos relacionados à ocorrência? (placa e modelo são obrigatórios)',
    tipo: 'veiculos',
  },

// Bloco 5 - OBJETOS
  {
    chave: 'objetos',
    pergunta: 'Deseja registrar objetos relacionados à ocorrência? (Ex: celulares, bolsas, drogas etc)',
    tipo: 'objetos',
  },
// Bloco 6 - ARMAMENTOS
  {
    chave: 'armamentos',
    pergunta: 'Deseja adicionar armamentos envolvidos na ocorrência? (Tipo, numeração, calibre, disparos, cápsulas, munições)',
    tipo: 'armamentos',
  },

  // Bloco 7 - FORMA DE ACIONAMENTO
  {
    chave: 'formaAcionamento',
    pergunta: 'Como a equipe foi acionada para a ocorrência? (Despachada via COPOM, deparou-se na via, populares, ligação/mensagem)',
    tipo: 'texto',
  },

  // Bloco 8 - HISTÓRICO
  {
    chave: 'historico',
    pergunta: 'Descreva os fatos da ocorrência para que possamos gerar o histórico final.',
    tipo: 'historico',
  },
];

for (const etapa of etapasFluxo) {
  if (!executores[etapa.tipo]) {
    throw new Error(`Executor não encontrado para o tipo: ${etapa.tipo}`);
  }
  etapa.executar = executores[etapa.tipo];
}