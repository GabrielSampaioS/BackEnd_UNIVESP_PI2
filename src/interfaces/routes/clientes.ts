import express from "express"

import { ClienteController } from "../controllers/ClienteController"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EmailService } from "../../domain/repositories/EmailService"


export default function clienteRoutes({ eventRepository, emailService }: { eventRepository: EventRepository, emailService: EmailService }) {

  const router = express.Router()

  const clienteController = new ClienteController(eventRepository, emailService)

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
  return router;
}


