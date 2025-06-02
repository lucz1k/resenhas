import { DateTime } from 'luxon';

export async function executarData(resposta, dados) {
  let dataLimpa = resposta.trim().toLowerCase();

  // Remove acentos para facilitar o parsing de palavras como "amanhã"
  dataLimpa = dataLimpa.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const hoje = DateTime.now().setZone('America/Sao_Paulo');
  let dataFinal;

  switch (dataLimpa) {
    case 'hoje':
      dataFinal = hoje;
      break;
    case 'ontem':
      dataFinal = hoje.minus({ days: 1 });
      break;
    case 'amanha':
      dataFinal = hoje.plus({ days: 1 });
      break;
    default: {
      // Tenta formatos conhecidos
      const formatos = [
        'dd/MM/yyyy',
        'dd/MM/yy',
        'dd/MM',
        'd MMMM',
        'd MMM',
        'ddLLLyy',
      ];

      for (const formato of formatos) {
        const tentativa = DateTime.fromFormat(dataLimpa, formato, { locale: 'pt-BR' });
        if (tentativa.isValid) {
          // Se for apenas dia/mês, assume o ano atual
          if (formato === 'dd/MM' || formato === 'd MMMM' || formato === 'd MMM') {
            dataFinal = tentativa.set({ year: hoje.year });
          } else {
            dataFinal = tentativa;
          }
          break;
        }
      }

      if (!dataFinal) {
        return {
          proximaEtapa: 'hora',
          mensagemResposta: '❌ Não entendi a data. Tente algo como: 25/05, 25mai25, ou "hoje".',
          dadoExtraido: null,
        };
      }
    }
  }

  const dataFormatada = dataFinal.toFormat('ddLLLyy').toUpperCase(); // Ex: 25MAI25

  return {
    proximaEtapa: 'hora',
    mensagemResposta: `✅ Data registrada: *${dataFormatada}*.\nQual o *horário* dos fatos? (Ex: agora, 15:30, 1530)`,
    dadoExtraido: dataFormatada,
  };
}
