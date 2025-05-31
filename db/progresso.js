// db/progresso.js
import mongoose from 'mongoose';
import { Progresso } from '../models/models.js';

export async function salvarProgresso(telefone, progresso) {
  await Progresso.findOneAndUpdate(
    { telefone },
    { $set: progresso },
    { upsert: true, new: true }
  );
}

export async function obterProgresso(telefone) {
  return await Progresso.findOne({ telefone });
}

export async function limparProgresso(telefone) {
  await Progresso.deleteOne({ telefone });
}
