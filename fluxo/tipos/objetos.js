// fluxo/tipos/objetos.js

export async function executarObjetos(resposta, dados) {
  if (!dados.objetos) dados.objetos = [];

  const texto = resposta.trim();

  if (/^(não|nao|nenhum|fim|encerrar)$/i.test(texto)) {
    return {
      proximaEtapa: 'armamentos',
      mensagemResposta: 'Deseja adicionar armamentos envolvidos na ocorrência? (Tipo, numeração, calibre, disparos, cápsulas, munições)',
      dadoExtraido: dados.objetos,
    };
  }

  if (texto.length > 0) {
    dados.objetos.push(texto);
  }

  return {
    proximaEtapa: 'objetos',
    mensagemResposta: '✅ Objeto registrado. Deseja adicionar outro? Se não, digite "não".',
    dadoExtraido: dados.objetos,
  };
}
