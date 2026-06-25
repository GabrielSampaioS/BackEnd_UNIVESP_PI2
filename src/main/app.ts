// =======================
// Importação de módulos
// ======================= 
import express from "express";
import cors from "cors";

import clienteRoutes from "../interfaces/routes/clientes";
import authRoute from "../interfaces/routes/authRoutes";

import { EventRepository } from "../domain/repositories/EventRepository";
import { EmailService } from "../domain/repositories/EmailService";
import { MongoUserRepository } from "../infrastructure/repositories/MongoUserRepository";

// =======================
// Inicialização do app
// =======================
export default function criarApp(
    { 
        eventRepository, 
        emailService,
        userRepository
        
    }: { 
        eventRepository: EventRepository, 
        emailService: EmailService 
        userRepository: MongoUserRepository
    }) {
    
    const app = express();

    app.use(cors());
    app.use(express.json());

    // =======================
    // Importação das rotas
    // =======================

    app.use("/clientes", clienteRoutes({eventRepository, emailService}));
    app.use("/auth", authRoute({userRepository}))

    return app;
}




