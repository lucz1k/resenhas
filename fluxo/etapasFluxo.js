import { executores } from './executores.js';
export const etapasFluxo = [
  {
    chave: 'grandeComando',
    pergunta: 'Qual o GRANDE COMANDO da ocorrência?',
    tipo: 'grandeComando',
  },
  {
    chave: 'batalhao',
    pergunta: 'Qual o BATALHÃO da ocorrência?',
    tipo: 'batalhao',
  },
  {
    chave: 'cia',
    pergunta: 'Qual a CIA da ocorrência?',
    tipo: 'cia',
  },
  {
    chave: 'pelotao',
    pergunta: 'Qual o PELOTÃO da ocorrência?',
    tipo: 'pelotao',
  },
  {
    chave: 'natureza',
    pergunta: 'Qual a natureza da ocorrência (ex: C04)?',
    tipo: 'natureza',
  },
  {
    chave: 'complementoNatureza',
    pergunta: 'Complemento da ocorrência (tentado, consumado, envolvendo policial militar etc)',
    tipo: 'complementoNatureza', // CERTO
  },
  {
    chave: 'bopm',
    pergunta: 'Qual o número do BOPM?',
    tipo: 'bopm',
  },
  {
    chave: 'bopc',
    pergunta: 'Qual o número do BOPC?',
    tipo: 'bopc',
  },
  {
    chave: 'delegado',
    pergunta: 'Qual o nome do delegado responsável? (Opcional)',
    tipo: 'delegado',
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
    pergunta: 'Qual o endereço da ocorrência? (Rua, número, bairro, cidade)',
    tipo: 'endereco',
  },

  // Bloco 2 - EQUIPE E APOIOS
  {
    chave: 'equipe',
    pergunta: 'Qual a equipe que atendeu? Informe a viatura e os nomes dos policiais. (M-10500 - 1 Sgt PM Silva, CB PM Souza)',
    tipo: 'equipe',
  },
  {
    chave: 'apoios',
    pergunta: 'Deseja adicionar viaturas de apoio? (Ex: M-10002 - CFP 1º TEN PM Costa, M-10501 - 2 Sgt PM Oliveira, CB PM Santos)',
    tipo: 'apoio',
  },

  // Bloco 3 - ENVOLVIDOS
  {
    chave: 'envolvidos',
    pergunta: 'Deseja adicionar envolvidos (vítimas, autores, testemunhas)? [Joao da silva (RG: 123456789) - vítima , Maria de Souza (RG: 987654321) - autora]',
    tipo: 'envolvidos',
  },
   // Bloco 4 - VEÍCULOS
  {
    chave: 'veiculos',
    pergunta: 'Deseja adicionar veículos relacionados à ocorrência? (placa e modelo são obrigatórios) [Ex: ABC1234 - VW Gol, XYZ5678 - Honda Civic]',
    tipo: 'veiculos',
  },

// Bloco 5 - OBJETOS
  {
    chave: 'objetos',
    pergunta: 'Deseja registrar objetos relacionados à ocorrência? (Ex: celulares, bolsas, drogas etc) [Ex: celular Samsung, bolsa preta]',
    tipo: 'objetos',
  },
// Bloco 6 - ARMAMENTOS
  {
    chave: 'armamentos',
    pergunta: 'Deseja adicionar armamentos envolvidos na ocorrência? (Tipo, numeração, calibre, disparos, cápsulas, munições) [Ex: Pistola Glock 17, numeração 123456789, calibre 9mm, disparos: 3, cápsulas: 3]',
    tipo: 'armamentos',
  },

  // Bloco 7 - FORMA DE ACIONAMENTO
  {
    chave: 'formaAcionamento',
    pergunta: 'Como a equipe foi acionada para a ocorrência? (Despachada via COPOM, deparou-se na via, populares, ligação/mensagem)',
    tipo: 'formaaAcionamento',
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