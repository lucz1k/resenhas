import mongoose from 'mongoose';

const RascunhoSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true, match: /^\d+$/ }, // Garante apenas números
  etapaAtual: { type: String, required: true },
  dados: { type: Object, required: true },
}, { timestamps: true });

export const Rascunho = mongoose.model('Rascunho', RascunhoSchema);
