export const proxySecurity = {
  validarMensagem: (mensagem) => {
    return mensagem && mensagem.from && typeof mensagem.body === 'string';
  },

  registrarLog: ({ telefone, ip, prompt }) => {
    console.log(`[LOG] ${new Date().toISOString()} | ${telefone} (${ip}) → ${prompt}`);
  }
};

export const limitesAbuso = {
  bloqueados: new Set(),

  verificarAbuso: (telefone) => {
    return limitesAbuso.bloqueados.has(telefone);
  }
};
