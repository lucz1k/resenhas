// filepath: c:\Users\lucas\resenhaapp-backend\db\usuarios.js
// Simples mock para evitar erro de importação

// Você pode adaptar para usar banco de dados ou arquivo JSON depois

const usuarios = {};

export async function buscarUsuario(telefone) {
  return usuarios[telefone] || null;
}

export async function salvarUsuario(telefone, dados) {
  usuarios[telefone] = dados;
}