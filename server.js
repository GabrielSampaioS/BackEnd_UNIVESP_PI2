// =======================
// Importação de módulos
// ======================= 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// =======================
// Inicialização do app
// =======================
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =======================
// Configuração de arquivos estáticos
// =======================
app.use(express.static(path.join(__dirname, 'public')));

// =======================
// Importação das rotas
// =======================
const clienteRoutes = require('./routes/clientes');
app.use('/clientes', clienteRoutes);

// =======================
// Conexão com o banco de dados
// =======================
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/barDaFilo';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})
.catch(err => {
  console.error('Erro ao conectar no MongoDB:', err);
});
