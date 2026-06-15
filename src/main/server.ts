// Não usar "/../src/..."
// Funciona no TS, mas após o build a pasta "src" não existe mais (vira dist).
// Use caminhos relativos: "./interfaces/..."

import dotenv from "dotenv";
import criarApp from "./app";

import { MongoEventRepository } from "../infrastructure/repositories/MongoEventRepository";
import { EmailGateway } from "../gateways/email.gateways";

dotenv.config();


// Implemnetção real das interfaces
const eventRepository = new MongoEventRepository();
const emailService = new EmailGateway();

const app = criarApp({eventRepository, emailService});

app.listen(
    process.env.PORT ?? 3000,
    () => {
        console.log(`Servidor rodando na porta ${process.env.PORT ?? 3000}`);

    }
);

