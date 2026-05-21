import express from "express"

import {
  criarCliente,
  registrarDivida,
  registrarPagamento,
  obterHistorico,
  localizarUser
} from "../controllers/ClienteController"

const router = express.Router()

//Teste ok
router.post("/clientes", criarCliente)

//Teste ok
router.post("/clientes/:id/dividas", registrarDivida)

//Teste ok
router.post("/clientes/:id/pagamentos", registrarPagamento)

// N 
router.get("/clientes/:id/eventos", obterHistorico)

//Teste ok
router.get("/clientes", localizarUser)

export default router