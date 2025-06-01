export async function executarDelegado(resposta, dados) {
  const valor = resposta.trim();

  // Campo opcional: permite seguir mesmo se vazio
  if (!valor) {
    dados.delegado = '';
    return {
      proximaEtapa: 'FINALIZAR',
      mensagemResposta: 'Nenhum delegado informado. Resenha finalizada!',
      dadoExtraido: '',
    };
  }

  dados.delegado = valor;

  return {
    proximaEtapa: 'FINALIZAR',
    mensagemResposta: `✅ Delegado registrado: *${valor}*.\nResenha finalizada!`,
    dadoExtraido: valor,
  };
}