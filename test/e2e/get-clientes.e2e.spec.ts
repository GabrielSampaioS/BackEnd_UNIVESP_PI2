import { before, after, describe, test, todo, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/main/app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";


describe("Localizar cliente", () => {
  before(async () => {
    await connectDatabase();
  });

  beforeEach(async () => {
    await mongoose.connection.collection("events").deleteMany({})
  })

  after(async () => {
    await mongoose.connection.close();
  });

  test("Retorna os dados do cliente cadastrado com base no nome (200)", async () => {

    // cria cliente para localizar
    await request(app)
      .post("/clientes")
      .send({
        nome: "Guilherme",
        sobrenome: "Sampaio",
        telefone: "1997865478",
        cpf: "22407834598",
        email: "guisampaio@gmail.com"
      })
      .expect(201)

    // TESTE: busca cliente
    const response = await request(app)
      .get("/clientes")
      .query({
        nome: "Guilherme"
      })
      .expect(200)

    const clientes = response.body

    assert.ok(Array.isArray(clientes))

    assert.strictEqual(
      clientes[0].event_data.nome,
      "Guilherme"
    )

  })

  test("Retorna os dados do cliente cadastrado com base no CPF (200)", async () => {

    // cria cliente para localizar
    await request(app)
      .post("/clientes")
      .send({
        nome: "Guilherme",
        sobrenome: "Sampaio",
        telefone: "1997865478",
        cpf: "22407834598",
        email: "guisampaio@gmail.com"
      })
      .expect(201)

    // TESTE: busca cliente
    const response = await request(app)
      .get("/clientes")
      .query({
        cpf: "22407834598"
      })
      .expect(200)

    const clientes = response.body

    assert.ok(Array.isArray(clientes))

    assert.strictEqual(
      clientes[0].event_data.nome,
      "Guilherme"
    )
    assert.strictEqual(
      clientes[0].event_data.cpf,
      "22407834598"
    )

  })

  test("Retorna erro ao não localizar nenhum cliente com o nome ou CPF (404)", async () => {

    // cria cliente para localizar
    await request(app)
      .post("/clientes")
      .send({
        nome: "Guilherme",
        sobrenome: "Sampaio",
        telefone: "1997865478",
        cpf: "22407834598",
        email: "guisampaio@gmail.com"
      })
      .expect(201)

    // TESTE: busca cliente
    const response = await request(app)
      .get("/clientes")
      .query({
        cpf: "11111111111"
      })
      .expect(404)
      const codigoErro = response.body.type
      assert.strict(codigoErro, 'NOT_FOUND')
  })
});