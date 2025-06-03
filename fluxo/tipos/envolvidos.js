export async function executarEnvolvidos(resposta, dados) {
  if (!dados.envolvidos) {
    dados.envolvidos = { vitimas: [], autores: [], testemunhas: [] };
    dados._etapaInternaEnvolvidos = 'vitimas';
  }

  const etapa = dados._etapaInternaEnvolvidos;
  const texto = resposta.trim();
  const textoMinusculo = texto.toLowerCase();

  const respostasNegativas = ['pular', 'nao', 'não', 'nenhum', 'fim', 'encerrar'];

  // Instruções para o usuário na primeira etapa
  if (
    etapa === 'vitimas' &&
    dados.envolvidos.vitimas.length === 0 &&
    !respostasNegativas.includes(textoMinusculo)
  ) {
    return {
      proximaEtapa: 'envolvidos',
      mensagemResposta:
        'Informe as *VÍTIMAS* (nome e, se possível, RG ou RE).\n\n' +
        '➡️ Para PM da ativa: Exemplo: "Cb PM João Silva, RE 1234567"\n' +
        '➡️ Para PM da reserva: Exemplo: "Cb PM João Silva, da reserva, última unidade 10º BPM/M"\n' +
        '➡️ Para civis: Exemplo: "Maria Souza (RG: 12345678)"\n\n' +
        'Envie um por vez. Quando terminar, responda *"pular"*.',
      dadoExtraido: dados.envolvidos,
    };
  }

  if (respostasNegativas.includes(textoMinusculo)) {
    if (etapa === 'vitimas') {
      dados._etapaInternaEnvolvidos = 'autores';
      return {
        proximaEtapa: 'envolvidos',
        mensagemResposta:
          'Deseja adicionar *AUTORES?* NOME (RG: XXX)\n\n' +
          '➡️ Para PM da ativa: Exemplo: "Cb PM João Silva, RE 1234567"\n' +
          '➡️ Para PM da reserva: Exemplo: "Cb PM João Silva, da reserva, última unidade 10º BPM/M"\n' +
          '➡️ Para civis: Exemplo: "Maria Souza (RG: 12345678)"\n\n' +
          'Envie um por vez. Quando terminar, responda *"pular"*.',
        dadoExtraido: dados.envolvidos,
      };
    } else if (etapa === 'autores') {
      dados._etapaInternaEnvolvidos = 'testemunhas';
      return {
        proximaEtapa: 'envolvidos',
        mensagemResposta:
          'Deseja adicionar *TESTEMUNHAS?* NOME (RG: XXX)\n\n' +
          '➡️ Para PM da ativa: Exemplo: "Cb PM João Silva, RE 1234567"\n' +
          '➡️ Para PM da reserva: Exemplo: "Cb PM João Silva, da reserva, última unidade 10º BPM/M"\n' +
          '➡️ Para civis: Exemplo: "Maria Souza (RG: 12345678)"\n\n' +
          'Envie um por vez. Quando terminar, responda *"pular"*.',
        dadoExtraido: dados.envolvidos,
      };
    } else {
      delete dados._etapaInternaEnvolvidos;
      return {
        proximaEtapa: 'veiculos',
        mensagemResposta:
          'Deseja adicionar *veículos* relacionados à ocorrência?\n\n' +
          'Você pode informar de forma simples ou detalhada:\n' +
          '➡️ Simples: "ABC1A34, Civic"\n' +
          '➡️ Simples: "EDF3D33/Civic"\n' +
          '➡️ Simples: "EDF3D33 - Civic"\n' +
          '➡️ Detalhado: "Placa: ABC1A34, Modelo: Civic, Cor: Prata, Marca: Honda, Ano: 2020"\n\n' +
          'Envie um veículo por vez. Quando terminar, responda *"pular"*.',
        dadoExtraido: dados.envolvidos,
      };
    }
  }

  let entradaFormatada = texto;

  // PM da reserva
  const pmReservaRegex = /((?:Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten|Al Of|Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)?\s*PM)\s+([\w\s]+?),\s*da reserva\s*,?\s*(última unidade\s+[\wº\s/]+)?/i;
  entradaFormatada = entradaFormatada.replace(pmReservaRegex, (_, posto, nome, unidade) => {
    const postoFinal = posto?.trim() || _getPosto(texto);
    return `${postoFinal} ${nome.trim()}, da reserva${unidade ? `, ${unidade.trim()}` : ''}`;
  });

  // PM da ativa com RE
  const pmAtivaRegex = /((?:Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten|Al Of|Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)?\s*PM)\s+([\w\s]+?),\s*RE\s*(\d{4,})/i;
  entradaFormatada = entradaFormatada.replace(pmAtivaRegex, (_, posto, nome, re) => {
    const postoFinal = posto?.trim() || _getPosto(texto);
    return `${postoFinal} ${nome.trim()} – ${re}`;
  });

  // Armazena no grupo correto
  switch (etapa) {
    case 'vitimas':
      dados.envolvidos.vitimas.push(entradaFormatada);
      break;
    case 'autores':
      dados.envolvidos.autores.push(entradaFormatada);
      break;
    case 'testemunhas':
      dados.envolvidos.testemunhas.push(entradaFormatada);
      break;
  }

  return {
    proximaEtapa: 'envolvidos',
    mensagemResposta:
      `Envolvido registrado como ${etapa.toUpperCase()}. Deseja adicionar outro? Se não, responda *"pular"*.\n\n` +
      '➡️ Para PM da ativa: Exemplo: "Cb PM João Silva, RE 1234567"\n' +
      '➡️ Para PM da reserva: Exemplo: "Cb PM João Silva, da reserva, última unidade 10º BPM/M"\n' +
      '➡️ Para civis: Exemplo: "Maria Souza (RG: 12345678)"',
    dadoExtraido: dados.envolvidos,
  };
}

function _getPosto(texto) {
  const postos = ['Sd', 'Cb', '3º Sgt', '2º Sgt', '1º Sgt', 'Subten', 'Al Of', 'Asp Of', '2º Ten', '1º Ten', 'Cap', 'Maj', 'Ten Cel', 'Cel'];
  const textoLimpo = texto.toUpperCase();
  for (const posto of postos) {
    if (textoLimpo.includes(posto.toUpperCase())) return posto;
  }
  return 'PM';
}
