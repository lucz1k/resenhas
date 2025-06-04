// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resenhaRoutes from './routes/resenha.js';
import webhookRouter from './services/zapi.js';
import openaiProxyRouter from './proxy/openaiProxy.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//rota do proxy OpenAI
app.use('/', openaiProxyRouter);

// ✅ Rota do Webhook (ex: Z-API) separada
app.use('/webhook', webhookRouter);

// ✅ Rota da API de resenhas
app.use('/api/resenha', resenhaRoutes);

// ✅ Conexão MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ Conectado ao MongoDB');
}).catch((err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
