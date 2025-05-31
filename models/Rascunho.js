import mongoose from 'mongoose';

const ProgressoSchema = new mongoose.Schema({
  numero: { type: String, unique: true },
  etapaAtual: String,
  dados: Object,
});

export const Progresso = mongoose.model('Progresso', ProgressoSchema);
