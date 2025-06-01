export async function executarBopc(resposta, dados) {
  const valor = resposta.trim();

  // Campo opcional: permite seguir mesmo se vazio
  if (!valor) {
    dados.bopc = '';
    return {
      proximaEtapa: 'delegado',
      mensagemResposta: 'Nenhum BOPC informado. Agora informe o nome do delegado responsável (opcional).',
      dadoExtraido: '',
    };
  }

  dados.bopc = valor;

  return {
    proximaEtapa: 'delegado',
    mensagemResposta: `✅ BOPC registrado: *${valor}*.\nAgora informe o nome do delegado responsável (opcional).`,
    dadoExtraido: valor,
  };
}