import { DateTime } from 'luxon';

export async function executarData(resposta, dados) {
  let dataLimpa = resposta.trim().toLowerCase();

  let dataFinal;
  const hoje = DateTime.now().setZone('America/Sao_Paulo');

  if (dataLimpa === 'hoje') {
    dataFinal = hoje;
  } else if (dataLimpa === 'ontem') {
    dataFinal = hoje.minus({ days: 1 });
  } else {
    // Tenta formatos comuns
    const formatos = [
      'dd/MM/yyyy',
      'dd/MM/yy',
      'dd/MM',
      'd MMMM', // 25 maio
      'd MMM',  // 25 mai
      'ddLLLyy', // 25mai25
    ];

    let encontrada = false;
    for (const formato of formatos) {
      const tentativa = DateTime.fromFormat(dataLimpa, formato, { locale: 'pt-BR' });
      if (tentativa.isValid) {
        dataFinal = tentativa;
        encontrada = true;
        break;
      }
    }

    if (!encontrada) {
      return {
        proximaEtapa: 'hora',
        mensagemResposta: '❌ Não entendi a data. Tente algo como: 25/05, 25mai25, ou "hoje".',
        dadoExtraido: null,
      };
    }
  }

  const dataFormatada = dataFinal.toFormat("ddLLLyy").toUpperCase(); // Ex: 25MAI25

  return {
    proximaEtapa: 'hora',
    mensagemResposta: `✅ Data registrada: *${dataFormatada}*.\nQual o horário dos fatos? (Ex: agora, 15:30, 1530)`,
    dadoExtraido: dataFormatada,
  };
}
