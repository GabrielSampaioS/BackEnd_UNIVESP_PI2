import express from "express"

import { ClienteController } from "../controllers/ClienteController"
import { MongoEventRepository } from "../../infrastructure/repositories/MongoEventRepository"
import { EmailGateway } from "../../gateways/email.gateways"

const router = express.Router()

const repository = new MongoEventRepository()
const emailGateway = new EmailGateway()

const clienteController = new ClienteController(repository, emailGateway)

router.post(
  "/clientes",
  clienteController.criarCliente.bind(clienteController)
)

router.post(
  "/clientes/:id/dividas",
  clienteController.registrarDivida.bind(clienteController)
)

router.post(
  "/clientes/:id/pagamentos",
  clienteController.registrarPagamento.bind(clienteController)
)

router.get(
  "/clientes/:id/eventos",
  clienteController.obterHistorico.bind(clienteController)
)

router.get(
  "/clientes",
  clienteController.localizarUser.bind(clienteController)
)

export default router