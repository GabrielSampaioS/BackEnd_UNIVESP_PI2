import { before, after, describe, test, todo, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/main/app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";


describe("GET /clientes/:id/eventos", () => {
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


  test("deve retornar histórico do cliente (200)", async () => {

    // Cria cliente
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

    // Registra dívida
    await request(app)
      .post(`/clientes/${idCliente}/dividas`)
      .send({
        valor: 100,
        descricao: "2kg de batata"
      })
      .expect(201);

    // Registra pagamento
    await request(app)
      .post(`/clientes/${idCliente}/pagamentos`)
      .send({
        valor: 40,
        forma_pagamento : "PIX"
      })
      .expect(201);

    // Busca histórico
    const responseHistorico = await request(app)
      .get(`/clientes/${idCliente}/eventos`)
      .expect(200);

    assert.ok(
      Array.isArray(responseHistorico.body.historico)
    );

    assert.strictEqual(
      responseHistorico.body.historico.length,
      3
    );

    assert.strictEqual(
      responseHistorico.body.saldo,
      60
    );
  });

  test("deve retornar erro ao buscar histórico de cliente inexistente (404)", async () => {

    const response = await request(app)
      .get("/clientes/1/eventos")
      .expect(404);

    assert.strictEqual(
      response.body.type,
      "CLIENT_NOT_FOUND"
    );



  })
})