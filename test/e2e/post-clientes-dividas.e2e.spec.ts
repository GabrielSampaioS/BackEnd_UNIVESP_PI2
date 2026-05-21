import { before, after, describe, test, todo, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/main/app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";

describe("Cadastrar divida do cliente", () => {
    before(async () => {
        await connectDatabase();
    });

    beforeEach(async () => {

        const collections = mongoose.connection.collections;

        for (const key in collections) {
            await collections[key].deleteMany({});
        }

    });

    after(async () => {
        await mongoose.connection.close();
    });

  test("Cadastrar uma dívida para um cliente existente (201)", async () => {

    const responseCliente = await request(app)
      .post("/clientes")
      .send({
        nome: "Gabriel",
        sobrenome: "Sampaio",
        telefone: "1999999999",
        cpf: "12345678998",
        email: "teste@gmail.com.br",
      })
      .expect(201);

    const idCliente = responseCliente.body.data.id;

    /*console.log("id atribuido apos criar user")
    console.log(idCliente)*/

    const responseDivida = await request(app)
      .post(`/clientes/${idCliente}/dividas`)
      .send({
        valor: 20
      })
      .expect(201);

    assert.strictEqual(
      responseDivida.body.type,
      "DIVIDA_CRIADA"
    );

  });

  test("Deve retornar erro ao cadastrar dívida para cliente inexistente (404)", async () => {

    const response = await request(app)
      .post("/clientes/1/dividas")
      .send({
        valor: 20
      })
      .expect(404);

    assert.strictEqual(
      response.body.type,
      "CLIENT_NOT_FOUND"
    );

  });

  test("Deve retornar erro ao cadastrar dívida com valor negativo (400)", async () => {

    const responseCliente = await request(app)
      .post("/clientes")
      .send({
        nome: "Gabriel",
        sobrenome: "Sampaio",
        telefone: "1999999999",
        cpf: "12345678998",
        email: "teste@gmail.com.br",
      })
      .expect(201);

    const idCliente = responseCliente.body.data.id;

    const response = await request(app)
      .post(`/clientes/${idCliente}/dividas`)
      .send({
        valor: -20
      })
      .expect(400);

    assert.strictEqual(
      response.body.type,
      "INVALID_DATA"
    );

  });

});
