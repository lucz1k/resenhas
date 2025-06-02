export async function executarGrandeComando(resposta, dados) {
  // Normaliza a entrada: remove espaços extras, converte para maiúsculas
  let texto = resposta.trim().toUpperCase().replace(/\s+/g, ' ');

  // Aceita já formatado: CPA-M/6, CPA/M6, CPI/5, CPCHQ, CPC, CPM
  if (/^CPA[\-\/]M[\-\/]?\d+$/.test(texto)) {
    texto = texto.replace(/CPA[\-\/]?M[\-\/]?(\d+)/, 'CPA-M/$1');
  } else if (/^CPI[\-\/]?\d+$/.test(texto)) {
    texto = texto.replace(/CPI[\-\/]?(\d+)/, 'CPI-$1');
  } else if (/^CPA\s*M\s*\d+$/.test(texto)) {
    texto = texto.replace(/CPA\s*M\s*(\d+)/, 'CPA-M/$1');
  } else if (/^CPI\s*\d+$/.test(texto)) {
    texto = texto.replace(/CPI\s*(\d+)/, 'CPI-$1');
  } else if (/^M\d+$/i.test(texto)) {
    texto = texto.replace(/^M(\d+)$/i, 'CPA-M/$1');
  } else if (/^I\d+$/i.test(texto)) {
    texto = texto.replace(/^I(\d+)$/i, 'CPI-$1');
  } else if (/^CPA\/M\d+$/i.test(texto)) {
    texto = texto.replace(/^CPA\/M(\d+)$/i, 'CPA-M/$1');
  } else if (/^CPI\/\d+$/i.test(texto)) {
    texto = texto.replace(/^CPI\/(\d+)$/i, 'CPI-$1');
  } else {
    // Remove espaços e normaliza barra
    texto = texto.replace(/\s*\/\s*/, '/').replace(/\s+/g, '');
  }

  // Aceita CPChq, CPC, CPM também
  const formatosValidos = [
    /^CPA-M\/\d+$/,  // Ex: CPA-M/6
    /^CPI-\d+$/,     // Ex: CPI-1
    /^CPCHQ$/,       // CPChq
    /^CPC$/,         // CPC
    /^CPM$/          // CPM
  ];

  const valido = formatosValidos.some((regex) => regex.test(texto));

  if (!valido) {
    return {
      proximaEtapa: 'grandeComando',
      mensagemResposta:
        '❌ Formato inválido para Grande Comando.\n\n' +
        'Exemplos aceitos:\n' +
        '• CPA-M/6, CPA/M6, CPA M6, CPA-M6, M6 (todos viram CPA-M/6)\n' +
        '• CPI-5, CPI/5, CPI 5, CPI-5, I5 (todos viram CPI-5)\n' +
        '• CPChq\n' +
        '• CPC\n' +
        '• CPM\n\n' +
        'Digite o número correspondente ao seu comando, por exemplo: "CPA-M/6", "CPI-5", "CPChq", "M6", "I5".',
      dadoExtraido: null,
    };
  }

  dados.grandeComando = texto;

  return {
    proximaEtapa: 'batalhao',
    mensagemResposta: `✅ Grande comando registrado: *${texto}*.\n\nInforme agora o *Batalhão* (ex: 10m, 10i, 3º BPChq, etc).`,
    dadoExtraido: texto,
  };
}