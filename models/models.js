// models.js
import mongoose from 'mongoose';

const progressoSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  etapaAtual: { type: String, required: true },
  dados: { type: Object, default: {} },
}, { timestamps: true });

const Progresso = mongoose.model('Progresso', progressoSchema);

export default Progresso;
