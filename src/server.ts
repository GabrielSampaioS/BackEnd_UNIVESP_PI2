// =======================
// Importação de módulos
// ======================= 

// Não usar "/../src/..."
// Funciona no TS, mas após o build a pasta "src" não existe mais (vira dist).
// Use caminhos relativos: "./interfaces/..."

import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import clienteRoutes from "./interfaces/routes/clientes"
import { connectDatabase } from "./infrastructure/database/mongoose"
dotenv.config()

// =======================
// Inicialização do app
// =======================
const app = express()
app.use(cors())
app.use(express.json())



// =======================
// Configuração de arquivos estáticos
// =======================


// =======================
// Importação das rotas
// =======================

app.use("/", clienteRoutes)

// =======================
// Iniciando aplicacão
// =======================

async function startServer() {

  await connectDatabase()

  const PORT = process.env.PORT || 3001

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })

}

startServer()