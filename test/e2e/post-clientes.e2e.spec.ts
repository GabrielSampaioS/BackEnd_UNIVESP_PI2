import { before, after, describe, test } from "node:test";
import mongoose from "mongoose";
import request from "supertest";

import app from "../../src/main/app";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import { response } from "express";
import assert = require("node:assert");


describe("Cadastrar cliente", () => {
  before(async () => {
    await connectDatabase();
  });

  after(async () => {
    await mongoose.connection.close();
  });


  test("Retorna os dados do cliente cadastrado quando os dados são válidos (201)", async () => {

    await request(app)
      .post("/clientes")
      .send({
        nome: "Gabriel",
        telefone: "19999999999"
      })
      .expect(201).expect((response) =>{
        const dadosRes = response.body;

        assert.strictEqual(dadosRes.nome, 'Gabriel')
      });

  });

});