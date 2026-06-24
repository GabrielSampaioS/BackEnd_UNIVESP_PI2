import test, { describe } from "node:test";
import assert from "node:assert";
import { v4 as uuidv4 } from "uuid"


import { Cliente } from "../../src/domain/entities/Cliente";
import { ClienteEventTypes } from "../../src/domain/events/EventTypes";
import { DomainEvent } from "../../src/domain/events/DomainEvent";
import { FormaPagamento } from "../../src/domain/enums/FormaPagamento";
import { ClienteValidador } from "../../src/domain/validators/ClienteValidador";

describe("Cliente", () => {

    test("validarCadastro não deve lançar erro para dados válidos", () => {
        assert.doesNotThrow(() => {

            ClienteValidador.validarCadastro({
                nome: "Gabriel",
                sobrenome: "Sampaio",
                telefone: "19999999999",
                cpf: "12345678900",
                email: "gabriel@email.com"
            });

        });

    });

    test("rehydrate deve reconstruir o cliente a partir do evento CLIENTE_CADASTRADO", () => {
        //Arrange
        const dadosValidos = {
            nome: "Gabriel",
            sobrenome: "Sampaio",
            telefone: "19999999999",
            cpf: "12345678900",
            email: "gabriel@email.com"
        };
        const aggregate_id = uuidv4();

        //act
        ClienteValidador.validarCadastro(dadosValidos);

        const event: DomainEvent = {
            aggregate_id,
            event_type: ClienteEventTypes.CLIENTE_CADASTRADO,
            event_data: {
                nome: dadosValidos.nome,
                sobrenome: dadosValidos.sobrenome,
                telefone: dadosValidos.telefone,
                cpf: dadosValidos.cpf,
                email: dadosValidos.email
            },
            created_at: new Date()
        };


        const cliente = Cliente.rehydrate([event]);

        //assert
        assert.strictEqual(dadosValidos.nome, cliente.nome);
        assert.strictEqual(dadosValidos.sobrenome, cliente.sobrenome);
        assert.strictEqual(dadosValidos.telefone, cliente.telefone);
        assert.strictEqual(dadosValidos.cpf, cliente.cpf);
        assert.strictEqual(dadosValidos.email, cliente.email);


    })

    test("validarCadastro deve lançar erro quando qualquer campo estiver vazio", () => {

        assert.throws(() => {

            ClienteValidador.validarCadastro({
                nome: "",
                sobrenome: "Sampaio",
                telefone: "19999999999",
                cpf: "12345678900",
                email: "gabriel@email.com"
            });

        }, { message: 'Campo nome é obrigatório' });

    });

    test("registrarDivida deve gerar evento DIVIDA_REGISTRADA com o valor informado", () => {

        const event = Cliente.registrarDivida(50, "Pão");


        assert.strictEqual(
            event.event_type,
            ClienteEventTypes.DIVIDA_REGISTRADA
        );

        assert.strictEqual(
            event.event_data.valor,
            50
        );
        assert.strictEqual(
            event.event_data.descricao, "Pão"
        )

    });

    test("registrarDivida deve lançar erro quando o valor for menor ou igual a zero", () => {
        assert.throws(
            () => Cliente.registrarDivida(0, "teste"),
            { message: "Valor inválido" });

    });

    test("rehydrate deve calcular o saldo a partir da sequência de eventos de dívida e pagamento", () => {
        const aggregate_id = uuidv4();

        const cliente = Cliente.rehydrate([
            {
                aggregate_id: aggregate_id,
                event_type: ClienteEventTypes.CLIENTE_CADASTRADO,
                event_data: {
                    nome: "Gabriel",
                    sobrenome: "Sampaio",
                    telefone: "19999999999",
                    cpf: "12345678900",
                    email: "gabriel@email.com"
                },
                created_at: new Date()
            },
            {
                aggregate_id: aggregate_id,
                event_type: ClienteEventTypes.DIVIDA_REGISTRADA,
                event_data: {
                    valor: 100,
                    descricao: "teste"
                },
                created_at: new Date()
            },
            {
                aggregate_id: aggregate_id,
                event_type: ClienteEventTypes.DIVIDA_REGISTRADA,
                event_data: {
                    valor: 50,
                    descricao: "teste"
                },
                created_at: new Date()
            },
            {
                aggregate_id: aggregate_id,
                event_type: ClienteEventTypes.PAGAMENTO_EFETUADO,
                event_data: {
                    valor_abatido: 20,
                    forma_pagamento: FormaPagamento.PIX,
                    taxa_percentual: 0,
                    valor_taxa: 0,
                    valor_pago_cliente: 20 + 0
                },
                created_at: new Date()
            }
        ]);

        assert.strictEqual(
            cliente.getSaldo(),
            130
        );

    });

    test.todo("teste com pagamento via credito, decontando apenas o valor pago e não o valor com juros")

});

/* Explicação:
   
       assert.equal e assert.strictEqual:

       - assert.equal(a, b) verifica se a == b, ou seja, compara os valores após realizar coerção de tipo. Por exemplo, assert.equal(1, "1") passaria, pois ambos são considerados iguais após a coerção.
       - assert.strictEqual(a, b) verifica se a === b, ou seja, compara os valores sem realizar coerção de tipo. Por exemplo, assert.strictEqual(1, "1") falharia, pois um é um número e o outro é uma string.

       Mesma coisa para as funções assert.deepEqual e assert.deepStrictEqual, onde a primeira realiza coerção de tipo e a segunda não.
       Porem o deepStrictEqual também verificar a classe dos objetos, como exemplo:

       class Pessoa {
           constructor(public nome: string) {}
       }
       
       const p1 = new Pessoa("Gabriel");
       const p2 = new Pessoa("Gabriel");
       const p3 = { nome: "Gabriel" };

       assert.deepEqual(p1, p2); // Passa, pois os objetos têm as mesmas propriedades e valores
       assert.deepStrictEqual(p1, p2); // Falha, pois p1 e p2 são instâncias diferentes da classe Pessoa
       
       assert.deepEqual(p1, p3); // Passa, pois os objetos têm as mesmas propriedades e valores
       assert.deepStrictEqual(p1, p3); // Falha, pois p1 é uma instância da classe Pessoa e p3 é um objeto literal

       */