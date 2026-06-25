import express from "express"

import { ClienteController } from "../controllers/ClienteController"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EmailService } from "../../domain/repositories/EmailService"


export default function clienteRoutes({ eventRepository, emailService }: { eventRepository: EventRepository, emailService: EmailService }) {

  const router = express.Router()

  const clienteController = new ClienteController(eventRepository, emailService)

  router.post(
    "/",
    clienteController.criarCliente.bind(clienteController)
  )

  router.post(
    "/:id/dividas",
    clienteController.registrarDivida.bind(clienteController)
  )

  router.post(
    "/:id/pagamentos",
    clienteController.registrarPagamento.bind(clienteController)
  )

  router.get(
    "/:id/eventos",
    clienteController.obterHistorico.bind(clienteController)
  )

  router.get(
    "/",
    clienteController.localizarUser.bind(clienteController)
  )
  return router;
}


