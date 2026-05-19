// =======================
// Importação de módulos
// ======================= 
import express from "express";
import cors from "cors";

import clienteRoutes from "../interfaces/routes/clientes";

// =======================
// Inicialização do app
// =======================

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// Importação das rotas
// =======================

app.use("/", clienteRoutes);

export default app;