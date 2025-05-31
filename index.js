// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resenhaRoutes from './routes/resenha.js';
import webhookRouter from './routes/zapi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/resenha', webhookRouter);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ Conectado ao MongoDB');
}).catch((err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

// ✅ Prefixo correto da rota
app.use('/api/resenha', resenhaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
