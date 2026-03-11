import express from "express"

import {
  criarCliente,
  registrarDivida,
  registrarPagamento,
  obterHistorico
} from "../controllers/ClienteController"
const router = express.Router()

router.post("/", criarCliente)

router.post("/divida", registrarDivida)

router.post("/pagamento", registrarPagamento)

router.get("/historico", obterHistorico)

export default router