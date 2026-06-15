
import { before, after, describe, test, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import { createAppTest } from "../utils/create-test-app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";

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

const { app } = createAppTest()


describe("POST /clientes/:id/pagamentos", () => {



  test.todo("deve retornar erro ao registrar pagamento com forma de pagamento inválida (400)");

  test("deve registrar pagamento para cliente existente no pix (201)", async () => {

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

    const responsePagamento = await request(app)
      .post(`/clientes/${idCliente}/pagamentos`)
      .send({
        valor: 20,
        forma_pagamento: "PIX"
      })
      .expect(201);

    assert.strictEqual(
      responsePagamento.body.type,
      "PAGAMENTO_CRIADO"
    );

    assert.strictEqual(
      responsePagamento.body.data.valor,
      20
    );

    assert.strictEqual(
      responsePagamento.body.data.forma_pagamento,
      "PIX"
    );


  });

  test("deve registrar pagamento para cliente existente no dinheiro (201)", async () => {

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

    const responsePagamento = await request(app)
      .post(`/clientes/${idCliente}/pagamentos`)
      .send({
        valor: 50,
        forma_pagamento: "DINHEIRO"
      })
      .expect(201);

    assert.strictEqual(
      responsePagamento.body.type,
      "PAGAMENTO_CRIADO"
    );

    assert.strictEqual(
      responsePagamento.body.data.valor,
      50
    );

    assert.strictEqual(
      responsePagamento.body.data.forma_pagamento,
      "DINHEIRO"
    );


  });

  //todo: ajustar par aque o retorno conhenha juros(10%)
  test("deve registrar pagamento para cliente existente no crédito retorno (201)", async () => {

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

    const responsePagamento = await request(app)
      .post(`/clientes/${idCliente}/pagamentos`)
      .send({
        valor: 100,
        forma_pagamento: "CREDITO"
      })
      .expect(201);

    assert.strictEqual(
      responsePagamento.body.type,
      "PAGAMENTO_CRIADO"
    );

    assert.strictEqual(
      responsePagamento.body.data.valor,
      100
    );

    assert.strictEqual(
      responsePagamento.body.data.forma_pagamento,
      "CREDITO"
    );

  });

  test("deve retornar erro ao registrar pagamento para cliente inexistente (404)", async () => {

    const response = await request(app)
      .post("/clientes/1/pagamentos")
      .send({
        valor: 20
      })
      .expect(404);

    assert.strictEqual(
      response.body.type,
      "CLIENT_NOT_FOUND"
    );

  });

  test("deve retornar erro ao registrar pagamento com valor inválido (400)", async () => {

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
      .post(`/clientes/${idCliente}/pagamentos`)
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