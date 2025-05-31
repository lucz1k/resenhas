// fluxo/tipos/envolvidos.js

export async function executarEnvolvidos(resposta, dados) {
  if (!dados.envolvidos) {
    dados.envolvidos = { vitimas: [], autores: [], testemunhas: [] };
    dados._etapaInternaEnvolvidos = 'vitimas';
  }

  const etapa = dados._etapaInternaEnvolvidos;

  if (/^(não|nao|nenhum|fim|encerrar)$/i.test(resposta.trim())) {
    // Avança para o próximo grupo ou etapa
    if (etapa === 'vitimas') {
      dados._etapaInternaEnvolvidos = 'autores';
      return {
        proximaEtapa: 'envolvidos',
        mensagemResposta: 'Deseja adicionar AUTORES?',
        dadoExtraido: dados.envolvidos,
      };
    } else if (etapa === 'autores') {
      dados._etapaInternaEnvolvidos = 'testemunhas';
      return {
        proximaEtapa: 'envolvidos',
        mensagemResposta: 'Deseja adicionar TESTEMUNHAS?',
        dadoExtraido: dados.envolvidos,
      };
    } else {
      delete dados._etapaInternaEnvolvidos;
      return {
        proximaEtapa: 'veiculos',
        mensagemResposta: 'Deseja adicionar veículos relacionados à ocorrência?',
        dadoExtraido: dados.envolvidos,
      };
    }
  }

  // Formatação especial para PMs da ativa ou reserva
  let entrada = resposta.trim();

  // Detecta PM da reserva
  const pmReservaRegex = /(?:|Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten| Al Of| Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)\s*PM\s+([\w\s]+),\s*da reserva\s*,?\s*(última unidade\s+[\wº\s/]+)?/i;
  if (pmReservaRegex.test(entrada)) {
    entrada = entrada.replace(pmReservaRegex, (_, nome, unidade) =>
      `${_getPosto(_)} PM ${nome.trim()}, da reserva${unidade ? `, ${unidade.trim()}` : ''}`
    );
  }

  // Detecta PM da ativa com RE
  const pmAtivaRegex = /(?:|Sd|Cb|3º Sgt|2º Sgt|1º Sgt|Subten| Al Of| Asp Of|2º Ten|1º Ten|Cap|Maj|Ten Cel|Cel)\s*PM\s+([\w\s]+),\s*RE\s*(\d{4,})/i;
  if (pmAtivaRegex.test(entrada)) {
    entrada = entrada.replace(pmAtivaRegex, (_, nome, re) =>
      `${_getPosto(_)} PM ${nome.trim()} – ${re}`
    );
  }

  // Armazena no tipo correto
  if (etapa === 'vitimas') {
    dados.envolvidos.vitimas.push(entrada);
  } else if (etapa === 'autores') {
    dados.envolvidos.autores.push(entrada);
  } else {
    dados.envolvidos.testemunhas.push(entrada);
  }

  return {
    proximaEtapa: 'envolvidos',
    mensagemResposta: `Envolvido registrado como ${etapa.toUpperCase()}. Deseja adicionar outro? Se não, responda "não".`,
    dadoExtraido: dados.envolvidos,
  };
}

function _getPosto(texto) {
  const postos = ['Sd', 'Cb', '3º Sgt', '2º Sgt', '1º Sgt', 'Subten', 'Al Of', 'Asp Of','2º Ten', '1º Ten', 'Cap', 'Maj', 'Ten Cel', 'Cel'];
  for (const p of postos) {
    if (texto.includes(p)) return p;
  }
  return 'PM';
}
