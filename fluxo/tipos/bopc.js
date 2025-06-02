export async function executarBopc(resposta, dados) {
  const valor = resposta.trim();

  // Campo opcional: permite seguir mesmo se vazio ou se usuário responder "não"
  if (!valor || valor.toLowerCase() === 'não' || valor.toLowerCase() === 'nao') {
    dados.bopc = '';
    return {
      proximaEtapa: 'delegado',
      mensagemResposta: 'Nenhum BOPC informado. Agora informe o nome do delegado responsável (pode deixar em branco).',
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