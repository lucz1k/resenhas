export const proxySecurity = {
  validarMensagem: (mensagem) => {
    // Verifica se a mensagem tem um remetente e corpo de texto
    return !!mensagem && !!mensagem.from && typeof mensagem.body === 'string' && mensagem.body.trim().length > 0;
  },

  registrarLog: ({ telefone, ip, prompt }) => {
    console.log(`[LOG] ${new Date().toISOString()} | ${telefone || 'desconhecido'} (${ip || 'sem IP'}) → ${prompt || ''}`);
  }
};

export const limitesAbuso = {
  bloqueados: new Set(),

  verificarAbuso: (telefone) => {
    // Verifica se o telefone está bloqueado
    return !!telefone && limitesAbuso.bloqueados.has(telefone);
  }
};
