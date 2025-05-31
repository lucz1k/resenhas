// utils/proxy.js
import { salvarNoDrive } from '../services/googleDrive.js';

/**
 * Envia a resenha finalizada para o usuário e salva no Google Drive.
 */
export async function finalizarResenha(telefone, textoFinal, enviarMensagem, callbackFinal = () => {}) {
  try {
    await enviarMensagem(telefone, textoFinal);

    const idArquivo = await salvarNoDrive(textoFinal, `resenha_${numero}.txt`);
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

/**
 * Limita o número de requisições para evitar abusos.
 * (Placeholder)
 */
export function limitesAbuso(telefone) {
  // Exemplo: limitar por IP, número ou frequência
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
