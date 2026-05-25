import { before, after, describe, test, todo, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/main/app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import assert from "node:assert";


describe("Cadastrar cliente", () => {
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


  test("Retorna os dados do cliente cadastrado quando os dados são válidos (201)", async () => {

    await request(app)
      .post("/clientes")
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

  test("Retorna um erro ao cadastrar cliente com dados invalidos (400)", async () => {

    await request(app)
      .post("/clientes")
      .send({
        nome: "",
        sobrenome: "",
        telefone: "",
        cpf: "",
        email: "teste@gmail.com.br",
      })
      .expect(400).expect((response) => {
        const codigoErro = response.body.type
        assert.strictEqual(codigoErro, 'INVALID_DATA')
      });
    //REsistencia a refatoração: quando um teste continua redistente mesmo apos mudar um detalhe de implementação

  });

});