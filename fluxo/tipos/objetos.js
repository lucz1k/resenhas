// fluxo/tipos/objetos.js

export async function executarObjetos(resposta, dados) {
  if (!dados.objetos) {
    dados.objetos = [];
  }

  const texto = resposta.trim();

  // Aceita "não", "nao", "nenhum", "fim", "encerrar" com ou sem acento
  if (/^(n[aã]o|nenhum|fim|encerrar|pular)$/i.test(texto.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
    return {
      proximaEtapa: 'armamentos',
      mensagemResposta: '📦 Deseja *registrar armamentos envolvidos* na ocorrência?\n\nEnvie no formato:\nTipo, numeração, calibre, disparos, cápsulas, munições\nExemplo: Pistola, 123456, .40, 2, 2, 10\nOu envie *"pular"* para avançar',
      dadoExtraido: dados.objetos,
    };
  }

  if (texto.length > 0) {
    dados.objetos.push(texto);
  }

  return {
    proximaEtapa: 'objetos',
    mensagemResposta:
      '✅ Objeto registrado.\nDeseja *adicionar outro objeto* relacionado à ocorrência?\n\nExemplo: "Celular Samsung, bolsa preta, carteira com documentos".\nSe não houver mais objetos, responda *"não".*',
    dadoExtraido: dados.objetos,
  };
}
