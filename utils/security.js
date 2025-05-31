export const proxySecurity = {
  validarMensagem: (mensagem) => {
    return mensagem && mensagem.from && typeof mensagem.body === 'string';
  },

  registrarLog: ({ numero, ip, prompt }) => {
    console.log(`[LOG] ${new Date().toISOString()} | ${numero} (${ip}) → ${prompt}`);
  }
};

export const limitesAbuso = {
  bloqueados: new Set(),

  verificarAbuso: (numero) => {
    return limitesAbuso.bloqueados.has(numero);
  }
};
