// fluxo/tipos/grandeComando.js

export async function executarGrandeComando(resposta, dados) {
  // Normaliza a entrada: remove espaços extras, converte para maiúsculas
  let texto = resposta.trim().toUpperCase().replace(/\s+/g, ' ');

  // Aceita formatos como "cpa m6", "cpa-m6", "cpa m 6", "cpi 1", "cpi-1", etc.
  texto = texto.replace(/CPA[\s\-]*M[\s\-]*(\d+)/, 'CPA-M/$1');
  texto = texto.replace(/CPI[\s\-]*(\d+)/, 'CPI-$1');
  texto = texto.replace(/\s*\/\s*/, '/'); // Normaliza barra
  texto = texto.replace(/\s+/g, ''); // Remove espaços restantes

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
      mensagemResposta: '❌ Formato inválido. Exemplos válidos:\n\n• CPA M6\n• CPA-M6\n• CPI 1\n• CPI-1\n• CPChq\n• CPC\n• CPM',
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