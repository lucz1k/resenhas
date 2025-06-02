// fluxo/tipos/hora.js
import { DateTime } from 'luxon';

export async function executarHora(resposta, dados) {
  const texto = resposta.trim().toLowerCase();
  const agora = DateTime.now().setZone('America/Sao_Paulo');

  let horaFinal;

  if (texto === 'agora') {
    horaFinal = agora.toFormat("HH'h'mm");
  } else {
    // Aceita formatos como "1530", "15:30", "15h30", "15"
    const regexHora = /^(\d{1,2})(?::|h|H)?(\d{2})?$/;
    const match = texto.match(regexHora);

    if (match) {
      const hora = match[1].padStart(2, '0');
      const minuto = match[2] ? match[2].padStart(2, '0') : '00';

      const horaNum = parseInt(hora);
      const minutoNum = parseInt(minuto);

      if (horaNum > 23 || minutoNum > 59) {
        return {
          proximaEtapa: 'hora',
          mensagemResposta: '❌ Horário inválido. Certifique-se de que esteja entre 00:00 e 23:59.',
          dadoExtraido: null,
        };
      }

      horaFinal = `${hora}h${minuto}`;
    } else {
      return {
        proximaEtapa: 'hora',
        mensagemResposta: '❌ Não entendi o horário. Tente algo como "agora", "15:30", "1530" ou "15".',
        dadoExtraido: null,
      };
    }
  }

  return {
    proximaEtapa: 'endereco',
    mensagemResposta: `⏰ Horário registrado: *${horaFinal}*.\nAgora, informe o *endereço da ocorrência*. (Rua X, nº Y - Cidade)`,
    dadoExtraido: horaFinal,
  };
}
