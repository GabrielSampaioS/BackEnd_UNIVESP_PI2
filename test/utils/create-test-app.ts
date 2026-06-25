import { mock } from "node:test";

import criarApp from "../../src/main/app";

import { MongoEventRepository } from "../../src/infrastructure/repositories/MongoEventRepository";
import { MongoUserRepository } from "../../src/infrastructure/repositories/MongoUserRepository";

export function createAppTest() {
    
    const eventRepository = new MongoEventRepository();
    const userRepository = new  MongoUserRepository();

    const emailService = {
        sendEmail: mock.fn(async () => {})
    };

    const app = criarApp({eventRepository, emailService, userRepository});

    return {
        app,
        eventRepository,
        emailService
    };
}