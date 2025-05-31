// fluxo/tipos/grandeComando.js

export async function executarGrandeComando(resposta, dados) {
  const texto = resposta.trim().toUpperCase();

  // Validações simples
  const formatosValidos = [
    /^CPA-M\/\d+$/,     // CPA-M/10
    /^CPI-\d+$/,        // CPI-1
    /^CPCHQ$/,          // CPChq
    /^CPC$/,            // CPC
    /^CPM$/             // CPM
  ];

  const valido = formatosValidos.some((regex) => regex.test(texto));

  if (!valido) {
    return {
      proximaEtapa: 'grandeComando',
      mensagemResposta: '❌ Formato inválido. Envie algo como: CPA-M/10, CPI-1, CPChq, CPC ou CPM.',
      dadoExtraido: null,
    };
  }

  dados.grandeComando = texto;

  return {
    proximaEtapa: 'batalhao',
    mensagemResposta: '✅ Grande comando registrado. Informe agora o Batalhão (ex: 10º BPM/M, 3º BPChq, etc).',
    dadoExtraido: texto,
  };
}
