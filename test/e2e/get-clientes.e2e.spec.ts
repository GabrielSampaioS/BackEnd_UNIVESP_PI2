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
  await mongoose.connection.collection("events").deleteMany({})

  const token = await getAuthToken(app);
  authHeader = `Bearer ${token}`;
})

after(async () => {
  await mongoose.connection.close();
});

describe("GET /clientes", () => {


  test("deve localizar cliente pelo nome (200)", async () => {

    // cria cliente para localizar
    await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
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
      .set(
        "Authorization",
        authHeader
      )
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

  test("deve localizar cliente pelo CPF (200)", async () => {

    // cria cliente para localizar
    await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
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
      .set(
        "Authorization",
        authHeader
      )
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

  test("deve retornar erro ao não localizar cliente (404)", async () => {

    // cria cliente para localizar
    await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
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
      .set(
        "Authorization",
        authHeader
      )
      .query({
        cpf: "11111111111"
      })
      .expect(404)
    const codigoErro = response.body.type
    assert.strict(codigoErro, 'NOT_FOUND')
  })
});