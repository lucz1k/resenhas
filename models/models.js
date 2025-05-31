// models/models.js
import mongoose from 'mongoose';

const ProgressoSchema = new mongoose.Schema({
  telefone: { type: String, required: true, unique: true },
  etapaAtual: { type: String, required: true },
  dados: { type: Object, required: true }
}, { timestamps: true });

const Progresso = mongoose.model('Progresso', ProgressoSchema);

export { Progresso }; // ✅ exportação nomeada compatível com ES Modules
