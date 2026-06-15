import { mock } from "node:test";

import criarApp from "../../src/main/app";

import { MongoEventRepository } from "../../src/infrastructure/repositories/MongoEventRepository";

export function createAppTest() {
    
    const eventRepository = new MongoEventRepository();

    const emailService = {
        sendEmail: mock.fn(async () => {})
    };

    const app = criarApp({eventRepository, emailService});

    return {
        app,
        eventRepository,
        emailService
    };
}