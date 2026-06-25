// Não usar "/../src/..."
// Funciona no TS, mas após o build a pasta "src" não existe mais (vira dist).
// Use caminhos relativos: "./interfaces/..."

import dotenv from "dotenv";
import criarApp from "./app";

import { MongoEventRepository } from "../infrastructure/repositories/MongoEventRepository";
import { EmailGateway } from "../gateways/email.gateways";
import { connectDatabase } from "../infrastructure/database/mongoose";
import { MongoUserRepository } from "../infrastructure/repositories/MongoUserRepository";

dotenv.config();

async function start() {
    await connectDatabase();
    // Implemnetção real das interfaces
    const eventRepository = new MongoEventRepository();
    const userRepository = new MongoUserRepository()
    const emailService = new EmailGateway();

    const app = criarApp({ eventRepository, emailService, userRepository});

    app.listen(
        process.env.PORT ?? 3000,
        () => {
            console.log(`Servidor rodando na porta ${process.env.PORT ?? 3000}`);

        }
    );

}


start();