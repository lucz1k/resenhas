// utils/proxy.js
import { salvarNoDrive } from '../services/googleDrive.js';

/**
 * Envia a resenha finalizada para o usuário e salva no Google Drive.
 */
export async function finalizarResenha(telefone, textoFinal, enviarMensagem, callbackFinal = () => {}) {
  try {
    await enviarMensagem(telefone, textoFinal);

    const idArquivo = await salvarNoDrive(textoFinal, `resenha_${telefone}.txt`);
    await enviarMensagem(telefone, `📁 Resenha salva no Google Drive!\nID do arquivo: ${idArquivo}`);

    await enviarMensagem(telefone, '*✅ Resenha finalizada com sucesso!*');
    callbackFinal();
  } catch (err) {
    console.error('Erro ao finalizar resenha:', err);
    await enviarMensagem(telefone, '❌ Ocorreu um erro ao finalizar sua resenha.');
  }
}

/**
 * Segurança do proxy – valida se pode continuar o processamento.
 * (Placeholder, ajuste conforme sua lógica de segurança futura)
 */
export function proxySecurity(telefone, mensagem) {
  // Exemplo: bloquear certos números ou conteúdos
  return true;
}

const abuseLimits = new Map();
const MAX_REQUESTS = 10; // máximo de requisições permitidas por hora
const WINDOW_MS = 60 * 60 * 1000; // 1 hora

/**
 * Limita o número de requisições para evitar abusos.
 * (Placeholder)
 */
export function limitesAbuso(telefone) {
  const now = Date.now();
  let entry = abuseLimits.get(telefone);

  if (!entry || now - entry.start > WINDOW_MS) {
    // Nova janela de tempo
    abuseLimits.set(telefone, { count: 1, start: now });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    return true; // Abuso detectado
  }

  abuseLimits.set(telefone, entry);
  return false;
}

/**
 * Interpreta o prefixo de natureza (ex: "ROUBO" ou "FURTO").
 * (Placeholder)
 */
export function interpretarNaturezaPrefixo(natureza) {
  if (typeof natureza === 'string') {
    const upper = natureza.toUpperCase();
    if (upper.includes('ROUBO')) return 'ROUBO';
    if (upper.includes('FURTO')) return 'FURTO';
  }
  return 'OUTROS';
}

/**
 * Monta a resenha final com base nos dados da ocorrência.
 * (Placeholder)
 */
export function montarResenhaFinal(dados) {
  // Lógica futura de formatação completa
  return `*Resumo da Ocorrência*\n\n${JSON.stringify(dados, null, 2)}`;
}
