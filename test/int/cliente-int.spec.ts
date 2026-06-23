/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { createClienteDTO } from "../factories/cliente.factory";

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

// Mock para evitar envio real de e-mails
function createEmailGatewayMock() {
    return {
        sendEmail: mock.fn(async () => { })
    };
}
const repository = new MongoEventRepository();
const emailGatewayMock = createEmailGatewayMock();

describe("Integração - UseCase + Repository", () => {


    test("deve criar cliente e persistir no MongoDB", async () => {

        //arrange

        const sut = new CriarCliente(repository, emailGatewayMock);


        //act
        const clienteRetorno = await sut.execute(createClienteDTO())

        //assert
        const eventos = await repository.findByAggregateId(clienteRetorno.id);

        assert.strictEqual(eventos.length, 1);
        assert.strictEqual(eventos[0].event_type, "ClienteCadastrado");
        assert.strictEqual(eventos[0].event_data.nome, createClienteDTO().nome);
        assert.strictEqual(eventos[0].event_data.sobrenome, createClienteDTO().sobrenome);
        assert.strictEqual(eventos[0].event_data.telefone, createClienteDTO().telefone);
        assert.strictEqual(eventos[0].event_data.cpf, createClienteDTO().cpf);
        assert.strictEqual(eventos[0].event_data.email, createClienteDTO().email);

    })

    test("deve registrar dívida e pagamento e calcular saldo corretamente", async () => {

        //arrange
        const criarClienteUseCase = new CriarCliente(repository, emailGatewayMock);
        const registrarDividaUsecase = new RegistrarDivida(repository)
        const registrarPagamentoUsecase = new RegistrarPagamento(repository)

        //act
        const clienteRetorno = await criarClienteUseCase.execute(createClienteDTO());


        await registrarDividaUsecase.execute(clienteRetorno.id, 100, "Compra no supermercado");
        await registrarPagamentoUsecase.execute(clienteRetorno.id, 50, FormaPagamento.PIX);

        //assert
        const eventos = await repository.findByAggregateId(clienteRetorno.id);
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

describe("Controller", () => {
    /*
    Mock de Request/Response.
    O problema é que o Controller está acoplado ao Express
    (Request e Response), então o teste precisa conhecer
    detalhes internos de como o Express funciona para recriar
    parcialmente esses objetos.   
    Teste com baixa redistencia a refotação por causa dos Spy, a troca de json para send, mesmo que não mudaria o resultado final, o teste vai falhar
    */
    test("criarCliente deve retornar status 201", async () => {
        
        const sut = new ClienteController(repository, emailGatewayMock);

        // Arrange
        const dados = createClienteDTO()

        const reqSpy = {
            body: {
                nome: dados.nome,
                sobrenome: dados.sobrenome,
                cpf: dados.cpf,
                telefone: dados.telefone,
                email: dados.email
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
        assert.strictEqual(resSpy.status.mock.calls.length, 1);
        assert.strictEqual(resSpy.status.mock.calls[0].arguments[0], 201);

        const response = resSpy.json.mock.calls[0].arguments[0];
        assert.ok(response);
        assert.ok(response.data.id)
        assert.strictEqual(response.data.nome, reqSpy.body.nome);
        assert.strictEqual(response.data.sobrenome, reqSpy.body.sobrenome);
        assert.strictEqual(response.data.cpf, reqSpy.body.cpf);
        assert.strictEqual(response.data.telefone, reqSpy.body.telefone);
        assert.strictEqual(response.data.email, reqSpy.body.email);

        // Verificar persistência no banco
        const eventos =
            await repository.findByAggregateId(
                response.data.id
            );

        assert.strictEqual(eventos.length, 1);

        assert.strictEqual(eventos[0].event_type, "ClienteCadastrado");

        assert.strictEqual(eventos[0].event_data.nome, reqSpy.body.nome);

        assert.strictEqual(eventos[0].event_data.sobrenome, reqSpy.body.sobrenome);

        assert.strictEqual(eventos[0].event_data.cpf, reqSpy.body.cpf);

        assert.strictEqual(eventos[0].event_data.telefone, reqSpy.body.telefone);

        assert.strictEqual(eventos[0].event_data.email, reqSpy.body.email);
    });

    test("registrarDivida deve retornar status 201", async () => {


        const controller =
            new ClienteController(
                repository,
                emailGatewayMock
            );

        // Arrange
        const criarCliente =
            new CriarCliente(
                repository,
                emailGatewayMock
            );



        const dados = createClienteDTO()

        const clienteRetorno =
            await criarCliente.execute({
                nome: dados.nome,
                sobrenome: dados.sobrenome,
                cpf: dados.cpf,
                telefone: dados.telefone,
                email: dados.email
            });

        const reqSpy = {
            params: {
                id: clienteRetorno.id
            },
            body: {
                valor: 100,
                descricao: "Compra no mercado"
            }
        };

        const resSpy = {
            status: mock.fn(() => resSpy),
            json: mock.fn(() => resSpy),
            send: mock.fn(() => resSpy)
        };

        // Act
        await controller.registrarDivida(
            reqSpy as any,
            resSpy as any
        );

        // Assert
        assert.deepEqual(resSpy.status.mock.calls[0].arguments, [201]);

        const response = resSpy.json.mock.calls[0].arguments;

        assert.ok(response);

        const eventos = await repository.findByAggregateId(clienteRetorno.id);

        assert.strictEqual(eventos.length, 2);

        assert.strictEqual(
            eventos[1].event_type,
            "DividaRegistrada"
        );

        assert.strictEqual(
            eventos[1].event_data.valor,
            100
        );
    });

    test("registrarPagamento deve retornar status 201", async () => {


        const controller = new ClienteController(repository, emailGatewayMock);

        const criarCliente = new CriarCliente(repository, emailGatewayMock);

        const registrarDivida = new RegistrarDivida(repository);


        const dados = createClienteDTO()

        const clienteRetorno =
            await criarCliente.execute({
                nome: dados.nome,
                sobrenome: dados.sobrenome,
                cpf: dados.cpf,
                telefone: dados.telefone,
                email: dados.email
            });

        await registrarDivida.execute(
            clienteRetorno.id,
            100,
            "Compra no mercado"
        );

        const reqSpy = {
            params: {
                id: clienteRetorno.id
            },
            body: {
                valor: 50,
                forma_pagamento: FormaPagamento.PIX
            }
        };

        const resSpy = {
            status: mock.fn(() => resSpy),
            json: mock.fn(() => resSpy),
            send: mock.fn(() => resSpy)
        };

        await controller.registrarPagamento(
            reqSpy as any,
            resSpy as any
        );

        //assert

        assert.deepEqual(resSpy.status.mock.calls[0].arguments, [201]);

        const eventos = await repository.findByAggregateId(clienteRetorno.id);

        assert.strictEqual(eventos.length, 3);

        assert.strictEqual(eventos[2].event_type, "PagamentoEfetuado");

        assert.strictEqual(eventos[2].event_data.valor_abatido, 50);
    });

    test("obterHistorico deve retornar status 200 e lista de eventos", async () => {


        const controller =
            new ClienteController(
                repository,
                emailGatewayMock
            );

        const criarCliente =
            new CriarCliente(
                repository,
                emailGatewayMock
            );



        const dados = createClienteDTO()
        const clienteRetorno =
            await criarCliente.execute({
                nome: dados.nome,
                sobrenome: dados.sobrenome,
                cpf: dados.cpf,
                telefone: dados.telefone,
                email: dados.email
            });

        const reqSpy = {
            params: {
                id: clienteRetorno.id
            }
        };

        const resSpy = {
            status: mock.fn(() => resSpy),
            json: mock.fn(() => resSpy),
            send: mock.fn(() => resSpy)
        };

        await controller.obterHistorico(
            reqSpy as any,
            resSpy as any
        );

        //assert
        assert.deepEqual(resSpy.status.mock.calls[0].arguments, [200]);

        const response = resSpy.json.mock.calls[0].arguments;

        assert.ok(response);

        /*assert.strictEqual(
            response.data.length,
            1
        );*/
    });

    test("localizarUser deve retornar clientes encontrados", async () => {

        const controller =
            new ClienteController(
                repository,
                emailGatewayMock
            );

        const criarCliente =
            new CriarCliente(
                repository,
                emailGatewayMock
            );

        const dados = createClienteDTO()

        await criarCliente.execute({
            nome: dados.nome,
            sobrenome: dados.sobrenome,
            cpf: dados.cpf,
            telefone: dados.telefone,
            email: dados.email
        });

        const reqSpy = {
            query: {
                nome: dados.nome
            }
        };

        const resSpy = {
            status: mock.fn(() => resSpy),
            json: mock.fn(() => resSpy),
            send: mock.fn(() => resSpy)
        };

        await controller.localizarUser(
            reqSpy as any,
            resSpy as any
        );

        assert.deepEqual(
            resSpy.status.mock.calls[0].arguments,
            [200]
        );

        const response =
            resSpy.json.mock.calls[0].arguments;

        assert.ok(response);

        /*assert.strictEqual(
            response.data.length,
            1
        );

        assert.strictEqual(
            response.data[0].nome,
            "Gabriel"
        );*/
    });

})

describe("CriarCliente - envio de e-mail", () => {

    // Quando queremos apenas verificar se uma dependência foi chamada,
    // sem nos preocupar com seu comportamento real, utilizamos Mocks.
    //
    // Exemplo: envio de e-mail. Queremos garantir que o método
    // sendEmail() foi chamado com os dados corretos.
    //
    // Quando precisamos simular uma resposta para que o código
    // continue sua execução, utilizamos Stubs.
    //
    // Exemplo: consultar estoque, CEP ou score de crédito.
    // O sistema precisa receber uma resposta para tomar uma decisão,
    // então o teste fornece um retorno controlado.

    test("deve enviar um e-mail após criar cliente", async () => {

        //arrange
        const sut = new CriarCliente(repository, emailGatewayMock);

        //act
        const clienteId = await sut.execute(createClienteDTO())

        //assert

        assert.ok(clienteId)
        const email =
            emailGatewayMock
                .sendEmail
                .mock
                .calls[0]
                .arguments;

        assert.deepStrictEqual(email, [{
            remetente: "no-reply@mercado.com",
            destinatario: "joao@email.com",
            assunto: "Usuário cadastrado",
            mensagem: "Recebemos sua solicitação de cadastro"
        }])
    })

})
