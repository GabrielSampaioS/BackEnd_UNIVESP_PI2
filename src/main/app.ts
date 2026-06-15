// =======================
// Importação de módulos
// ======================= 
import express from "express";
import cors from "cors";

import clienteRoutes from "../interfaces/routes/clientes";

import { EventRepository } from "../domain/repositories/EventRepository";
import { EmailService } from "../domain/repositories/EmailService";

// =======================
// Inicialização do app
// =======================
export default function criarApp({ eventRepository, emailService }: { eventRepository: EventRepository, emailService: EmailService }) {

    const app = express();

    app.use(cors());
    app.use(express.json());

    // =======================
    // Importação das rotas
    // =======================

    app.use("/", clienteRoutes({eventRepository, emailService}));

    return app;
}




