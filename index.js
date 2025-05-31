// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resenhaRoutes from './routes/resenha.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para ler JSON
app.use(express.json());

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Conectado ao MongoDB');
}).catch((err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

// Rota principal do ResenhaApp
app.use('/api/resenha/webhook/whatsapp', resenhaRoutes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
