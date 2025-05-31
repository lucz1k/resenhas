import { DateTime } from 'luxon';

export async function executarHora(resposta, dados) {
  const texto = resposta.trim().toLowerCase();
  const agora = DateTime.now().setZone('America/Sao_Paulo');

  let horaFinal;

  if (texto === 'agora') {
    horaFinal = agora.toFormat('HH\'h\'mm');
  } else {
    // Tenta extrair hora de formatos variados
    const regexHora = /^(\d{1,2})[:hH]?(\d{2})$/;
    const match = texto.match(regexHora);

    if (match) {
      const hora = match[1].padStart(2, '0');
      const minuto = match[2].padStart(2, '0');
      horaFinal = `${hora}h${minuto}`;
    } else {
      return {
        proximaEtapa: 'endereco',
        mensagemResposta: '❌ Não entendi o horário. Tente algo como "agora", "15:30" ou "1530".',
        dadoExtraido: null,
      };
    }
  }

  return {
    proximaEtapa: 'endereco',
    mensagemResposta: `⏰ Horário registrado: *${horaFinal}*.\nAgora, informe o endereço da ocorrência.`,
    dadoExtraido: horaFinal,
  };
}
