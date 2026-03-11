import express from "express"

import {
  criarCliente,
  registrarDivida,
  registrarPagamento,
  obterHistorico
} from "../controllers/ClienteController"

const router = express.Router()

router.post("/clientes", criarCliente)

router.post("/clientes/:id/dividas", registrarDivida)

router.post("/clientes/:id/pagamentos", registrarPagamento)

router.get("/clientes/:id/eventos", obterHistorico)

export default router