//lib para testes
import test, { after, before, beforeEach, describe } from "node:test";
import assert from "node:assert";

// Imports da Infraestrutura
import { MongoEventRepository } from "../../src/infrastructure/repositories/MongoEventRepository";
import mongoose from "mongoose";
import { connectDatabase } from "../../src/infrastructure/database/mongoose";
import { ClienteController } from "../../src/interfaces/controllers/ClienteController"


// Imports dos Use Cases
import { CriarCliente } from "../../src/application/useCases/CriarCliente";
import { RegistrarDivida } from "../../src/application/useCases/RegistrarDivida";
import { RegistrarPagamento } from "../../src/application/useCases/RegistrarPagamento";

// Imports do Domínio
import { FormaPagamento } from "../../src/domain/enums/FormaPagamento";
import { Cliente } from "../../src/domain/entities/Cliente";

describe("Integração com UseCase e Repository", () => {

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


    test("deve criar cliente e persistir no MongoDB", async () => {
        // teste envolvendo as camadas: UseCase e Repositories

        //arrange
        const repository = new MongoEventRepository();
        const usecase = new CriarCliente(repository);


        //act

        const clienteId = await usecase.execute({
            nome: "João",
            sobrenome: "Silva",
            telefone: "11999999999",
            cpf: "12345678900",
            email: "joao@email.com"
        })

        //assert
        const eventos = await repository.findByAggregateId(clienteId);
        assert.strictEqual(eventos.length, 1);
        assert.strictEqual(eventos[0].event_type, "ClienteCadastrado");
        assert.strictEqual(eventos[0].event_data.nome, "João");
        assert.strictEqual(eventos[0].event_data.sobrenome, "Silva");
        assert.strictEqual(eventos[0].event_data.telefone, "11999999999");
        assert.strictEqual(eventos[0].event_data.cpf, "12345678900");
        assert.strictEqual(eventos[0].event_data.email, "joao@email.com");

    })

    test("deve registrar dívida e pagamento para o cliente e validar divida final", async () => {
        // teste envolvendo as camadas: UseCase, Repositories e Entities

        //arrange
        const repository = new MongoEventRepository();
        const usecase = new CriarCliente(repository);
        const registrarDividaUsecase = new RegistrarDivida(repository)
        const registrarPagamentoUsecase = new RegistrarPagamento(repository)

        //act

        const clienteId = await usecase.execute({
            nome: "Maria",
            sobrenome: "Oliveira",
            telefone: "11988888888",
            cpf: "98765432100",
            email: "maria@email.com"
        });


        await registrarDividaUsecase.execute(clienteId, 100, "Compra no supermercado");
        await registrarPagamentoUsecase.execute(clienteId, 50, FormaPagamento.PIX);

        //assert
        const eventos = await repository.findByAggregateId(clienteId);
        assert.strictEqual(eventos.length, 3);
        assert.strictEqual(eventos[0].event_type, "ClienteCadastrado");
        assert.strictEqual(eventos[1].event_type, "DividaRegistrada");
        assert.strictEqual(eventos[1].event_data.valor, 100);
        assert.strictEqual(eventos[1].event_data.descricao, "Compra no supermercado");
        assert.strictEqual(eventos[2].event_type, "PagamentoEfetuado");
        assert.strictEqual(eventos[2].event_data.valor_abatido, 50);
        assert.strictEqual(eventos[2].event_data.forma_pagamento, FormaPagamento.PIX);


        //validar dívida final
        const cliente = Cliente.rehydrate(eventos);
        assert.strictEqual(cliente.getSaldo(), 50);
    })

    test.todo("não deve permitir pagamento com valor negativo")

})

describe("Integração com Controller UseCase e Repository", () => {

    test.todo("criarCliente", async () => {

        const repository = new MongoEventRepository();
        const sut = new ClienteController(repository)

        //arrange

        const clienteId = { nome: "Gabriel", sobrenome: "Sampaio", telefone: "1999999999", email: "g@gmail.com" }
        const req = {}
        const res = {
            status() { return res },
            json() { return res },
            send() { return res },
        }

        res.status.s
        //act
        await sut.criarCliente()
    })



    test.todo("registrarDivida", async () => { })
    test.todo("registrarPagamento", async () => { })
    test.todo("obterHistorico", async () => { })
    test.todo("localizarUser", async () => { })

})