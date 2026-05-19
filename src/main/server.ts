// Não usar "/../src/..."
// Funciona no TS, mas após o build a pasta "src" não existe mais (vira dist).
// Use caminhos relativos: "./interfaces/..."

import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "../infrastructure/database/mongoose";

dotenv.config();


async function startServer() {

  await connectDatabase();

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

}

startServer();