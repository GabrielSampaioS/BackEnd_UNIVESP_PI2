import { before, after, describe, test, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import { createAppTest } from "../utils/create-test-app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";
import { getAuthToken } from "../utils/auth";

const { app } = createAppTest()
let authHeader: string;;

before(async () => {
  await connectDatabase();
});

beforeEach(async () => {

  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  const token = await getAuthToken(app);
  authHeader = `Bearer ${token}`;

});

after(async () => {
  await mongoose.connection.close();
});



describe("POST /clientes/:id/dividas", () => {


  test("deve registrar dívida para cliente existente (201)", async () => {

    const responseCliente = await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
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
      .set(
        "Authorization",
        authHeader
      )
      .send({
        valor: 20,
        descricao: "3 caixa de leite"

      })
      .expect(201);

    assert.strictEqual(
      responseDivida.body.type,
      "DIVIDA_CRIADA"
    );

  });

  test("deve retornar erro ao registrar dívida para cliente inexistente (404)", async () => {

    const response = await request(app)
      .post("/clientes/1/dividas")
      .set(
        "Authorization",
        authHeader
      )
      .send({
        valor: 20
      })
      .expect(404);

    assert.strictEqual(
      response.body.type,
      "CLIENT_NOT_FOUND"
    );

  });

  test("deve retornar erro ao registrar dívida com valor inválido (400)", async () => {

    const responseCliente = await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
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
      .set(
        "Authorization",
        authHeader
      )
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
