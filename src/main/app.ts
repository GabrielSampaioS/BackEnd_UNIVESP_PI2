// =======================
// Importação de módulos
// ======================= 
import express from "express";
import cors from "cors";

import clienteRoutes from "../interfaces/routes/clientes";
import authRoute from "../interfaces/routes/authRoutes";

import { EventRepository } from "../domain/repositories/EventRepository";
import { EmailService } from "../domain/repositories/EmailService";
import { UserRepository } from "../domain/repositories/UserRepository";

import { middlewareError } from "../middlewares/MiddlewareError"


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
        userRepository: UserRepository  
    }) {
    
    const app = express();

    app.use(cors());
    app.use(express.json());

    // =======================
    // Importação das rotas
    // =======================

    app.use("/clientes", clienteRoutes({eventRepository, emailService}));
    app.use("/auth", authRoute({userRepository}))

    app.use(middlewareError)

    return app;
}




