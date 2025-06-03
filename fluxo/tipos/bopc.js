export async function executarBopc(resposta, dados) {
  const valor = resposta.trim();

  // Campo opcional: permite seguir mesmo se vazio ou se usuário responder "não"
  if (!valor || valor.toLowerCase() === 'não' || valor.toLowerCase() === 'pular') {
    dados.bopc = '';
    return {
      proximaEtapa: 'delegado',
      mensagemResposta: 'Nenhum BOPC informado. Agora informe o nome do *delegado responsável* (digite 'pular' para ignorar).',
      dadoExtraido: '',
    };
  }

  dados.bopc = valor;

  return {
    proximaEtapa: 'delegado',
    mensagemResposta: `✅ BOPC registrado: *${valor}*.\nAgora informe o nome do *delegado* responsável (digite 'pular' para ignorar).`,
    dadoExtraido: valor,
  };
}