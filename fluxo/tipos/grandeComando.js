// fluxo/tipos/grandeComando.js

export async function executarGrandeComando(resposta, dados) {
  // Normaliza a entrada: remove espaços e hífens, converte para maiúsculas
  let texto = resposta.trim().toUpperCase().replace(/[\s\-]+/g, '');

  // Ajusta para formatos válidos com separadores
  texto = texto.replace(/^CPAM(\d+)$/, 'CPA-M/$1');
  texto = texto.replace(/^CPI(\d+)$/, 'CPI-$1');
  texto = texto.replace(/\s*\/\s*/, '/');

  const formatosValidos = [
    /^CPA-M\/\d+$/,  // Ex: CPA-M/10
    /^CPI-\d+$/,     // Ex: CPI-1
    /^CPCHQ$/,       // CPChq
    /^CPC$/,         // CPC
    /^CPM$/          // CPM
  ];

  const valido = formatosValidos.some((regex) => regex.test(texto));

  if (!valido) {
    return {
      proximaEtapa: 'grandeComando',
      mensagemResposta: '❌ Formato inválido. Envie algo como:\n\n• CPA-M/10\n• CPI-1\n• CPChq\n• CPC\n• CPM',
      dadoExtraido: null,
    };
  }

  dados.grandeComando = texto;

  return {
    proximaEtapa: 'batalhao',
    mensagemResposta: `✅ Grande comando registrado: *${texto}*.\n\nInforme agora o *Batalhão* (ex: 10º BPM/M, 3º BPChq, etc).`,
    dadoExtraido: texto,
  };
}