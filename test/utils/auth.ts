
import request from "supertest";
import { Express } from "express";


export async function getAuthToken(app: Express) {

    await request(app)
        .post("/auth/register")
        .send({
            nome: "teste",
            email: "teste@test.com",
            senha: "123456"
        });

    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "teste@test.com",
            senha: "123456"
        });


    return response.body.data.token;
}
