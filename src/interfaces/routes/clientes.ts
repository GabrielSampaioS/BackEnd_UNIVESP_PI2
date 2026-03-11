import express from "express"

import {
  criarCliente,
  registrarDivida,
  registrarPagamento,
  obterHistorico,
  localizarUser
} from "../controllers/ClienteController"

const router = express.Router()

router.post("/clientes", criarCliente)

router.post("/clientes/:id/dividas", registrarDivida)

router.post("/clientes/:id/pagamentos", registrarPagamento)

router.get("/clientes/:id/eventos", obterHistorico)

router.get("/clientes", localizarUser)

export default router