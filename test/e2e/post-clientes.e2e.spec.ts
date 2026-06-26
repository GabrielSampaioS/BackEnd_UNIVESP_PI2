import { before, after, describe, test, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";
import { createAppTest } from "../utils/create-test-app";
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



describe("POST /clientes", () => {

  test("deve cadastrar um cliente com dados válidos (201)", async () => {

    //arrange
    await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
      .send({
        nome: "Gabriel     ",
        sobrenome: "Sampaio",
        telefone: "1999999999",
        cpf: "   12345678998",
        email: "teste@gmail.com.br",
      })
      .expect(201).expect((response) => {
        const dadosRes = response.body;
        //assert.strictEqual(typeof dadosRes.id, 'string') VALIDAR que o ID é retornado
        assert.strictEqual(dadosRes.data.nome, 'Gabriel')
        assert.strictEqual(dadosRes.data.sobrenome, 'Sampaio')
        assert.strictEqual(dadosRes.data.telefone, '1999999999')
        assert.strictEqual(dadosRes.data.cpf, '12345678998')
        assert.strictEqual(dadosRes.data.email, 'teste@gmail.com.br')
      });

  });

  test("deve retornar erro ao cadastrar cliente com dados inválidos (400)", async () => {

    await request(app)
      .post("/clientes")
      .set(
        "Authorization",
        authHeader
      )
      .send({
        nome: "",
        sobrenome: "sampaio",
        telefone: "111111111",
        cpf: "12345678998",
        email: "teste@gmail.com.br",
      })

      .expect(400).expect((response) => {
        const codigoErro = response.body.typeError
        assert.equal(codigoErro, 'INVALID_DATA')
      });
    //REsistencia a refatoração: quando um teste continua redistente mesmo apos mudar um detalhe de implementação

  });

});

