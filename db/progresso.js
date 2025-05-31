// db/progresso.js
import mongoose from 'mongoose';
import { Progresso } from '../models/models.js';

// Salva ou atualiza o progresso do número informado
export async function salvarProgresso(numero, progresso) {
  await Progresso.findOneAndUpdate(
    { numero },
    { $set: progresso },
    { upsert: true, new: true }
  );
}

// Obtém o progresso atual de um número
export async function obterProgresso(numero) {
  return await Progresso.findOne({ numero });
}

// (Opcional) Zera o progresso de um número
export async function limparProgresso(numero) {
  await Progresso.deleteOne({ numero });
}
