// utils/proxy.js
import { salvarNoDrive } from '../services/googleDrive.js';

export async function finalizarResenha(numero, textoFinal, enviarMensagem, callbackFinal = () => {}) {
  try {
    await enviarMensagem(numero, textoFinal);

    const idArquivo = await salvarNoDrive(textoFinal, `resenha_${numero}.txt`);
    await enviarMensagem(numero, `📁 Resenha salva no Google Drive!\nID do arquivo: ${idArquivo}`);

    await enviarMensagem(numero, '*✅ Resenha finalizada com sucesso!*');
    callbackFinal();
  } catch (err) {
    console.error('Erro ao finalizar resenha:', err);
    await enviarMensagem(numero, '❌ Ocorreu um erro ao finalizar sua resenha.');
  }
}