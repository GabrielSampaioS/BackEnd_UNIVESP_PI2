import { before, after, describe, test, todo, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/main/app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";

describe("Retornar o historico de dividas e pagemtos", () => {
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

  test("Deve retornar o histórico de um cliente existente (200)", async () => {

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
        valor: 100
      })
      .expect(201);

    // Registra pagamento
    await request(app)
      .post(`/clientes/${idCliente}/pagamentos`)
      .send({
        valor: 40
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
      -60
    );

  });

  test("Deve retornar erro ao buscar histórico de cliente inexistente (404)", async () => {

    const response = await request(app)
      .get("/clientes/1/eventos")
      .expect(404);

    assert.strictEqual(
      response.body.type,
      "CLIENT_NOT_FOUND"
    );


  })
}
)