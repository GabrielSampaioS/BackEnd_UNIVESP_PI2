//lib para testes
import test, { after, before, beforeEach, describe, mock } from "node:test";
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

describe("Integração com Controller, UseCase e Repository (Mock)", () => {

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

    test("criarCliente", async () => {

        /*
        Mock de Request/Response.
        O problema é que o Controller está acoplado ao Express
        (Request e Response), então o teste precisa conhecer
        detalhes internos de como o Express funciona para recriar
        parcialmente esses objetos.   

        Teste com baixa redistencia a refotação por causa dos Spy, a troca de json para send, mesmo que não mudaria o resultado final, o teste vai falhar
        */

        const repository = new MongoEventRepository();
        const sut = new ClienteController(repository);

        // Arrange
        const reqSpy = {
            body: {
                nome: "Gabriel",
                sobrenome: "Sampaio",
                cpf: "   12345678998",
                telefone: "19999999999",
                email: "g@gmail.com"
            }
        };

        const resSpy = {
            status: mock.fn((code: number) => resSpy),
            json: mock.fn((data: any) => resSpy),
            send: mock.fn((data: any) => resSpy)
        };

        // Act
        await sut.criarCliente(reqSpy as any, resSpy as any);

        // Assert

        //verboso d+
        assert.strictEqual(resSpy.status.mock.calls[0].arguments[0], 201);

        // controller usa json()
        const response = resSpy.json.mock.calls[0].arguments[0];
        assert.ok(response);

        //verificar propriedades
        assert.ok(response.data.id)
        assert.strictEqual(response.data.nome, reqSpy.body.nome);
        assert.strictEqual(response.data.sobrenome, reqSpy.body.sobrenome);
        assert.strictEqual(response.data.cpf, reqSpy.body.cpf);
        assert.strictEqual(response.data.telefone, reqSpy.body.telefone);
        assert.strictEqual(response.data.email, reqSpy.body.email);

        /* Ideal seria validar que o uusário foi salvo, já que é um teste de integração
        const eventos = await repository.findClientes(promise);
        assert.strictEqual(eventos.length, 1);
        */
    });

    test.todo("registrarDivida", async () => { })
    test.todo("registrarPagamento", async () => { })
    test.todo("obterHistorico", async () => { })
    test.todo("localizarUser", async () => { })

})

