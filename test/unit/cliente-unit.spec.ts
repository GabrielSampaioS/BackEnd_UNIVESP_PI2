import test, { describe } from "node:test";
import assert from "node:assert";

import { Cliente } from "../../src/domain/entities/Cliente";
import { EventTypes } from "../../src/domain/events/EventTypes";

describe("Cliente", () => {

    test("validarCadastro não deve lançar erro para dados válidos", () => {
        assert.doesNotThrow(() => {

            Cliente.validarCadastro({
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

        //act
        Cliente.validarCadastro(dadosValidos);
        const cliente = Cliente.rehydrate([
            {
                event_type: EventTypes.CLIENTE_CADASTRADO,
                event_data: dadosValidos
            }
        ]);

        //assert
        assert.strictEqual(dadosValidos.nome, cliente.nome);
        assert.strictEqual(dadosValidos.sobrenome, cliente.sobrenome);
        assert.strictEqual(dadosValidos.telefone, cliente.telefone);
        assert.strictEqual(dadosValidos.cpf, cliente.cpf);
        assert.strictEqual(dadosValidos.email, cliente.email);


    })

    test("validarCadastro deve lançar erro quando qualquer campo estiver vazio", () => {

        assert.throws(() => {

            Cliente.validarCadastro({
                nome: "",
                sobrenome: "Sampaio",
                telefone: "19999999999",
                cpf: "12345678900",
                email: "gabriel@email.com"
            });

        } , {message: 'Campo nome é obrigatório'});

    });

    test("registrarDivida deve gerar evento DIVIDA_REGISTRADA com o valor informado", () => {

        const cliente = Cliente.rehydrate([
            {
                event_type: EventTypes.CLIENTE_CADASTRADO,
                event_data: {
                    nome: "Gabriel",
                    sobrenome: "Sampaio",
                    telefone: "19999999999",
                    cpf: "12345678900",
                    email: "gabriel@email.com"
                }
            }
        ]);

        const event = cliente.registrarDivida(50, "Pão");


        assert.strictEqual(
            event.event_type,
            EventTypes.DIVIDA_REGISTRADA
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

        const cliente = Cliente.rehydrate([
            {
                event_type: EventTypes.CLIENTE_CADASTRADO,
                event_data: {
                    nome: "Gabriel",
                    sobrenome: "Sampaio",
                    telefone: "19999999999",
                    cpf: "12345678900",
                    email: "gabriel@email.com"
                }
            }
        ]);

        assert.throws(() => {

            cliente.registrarDivida(0)

        }, {message: "Valor inválido"});

    });

    test("rehydrate deve calcular o saldo a partir da sequência de eventos de dívida e pagamento", () => {

        const cliente = Cliente.rehydrate([
            {
                event_type: EventTypes.CLIENTE_CADASTRADO,
                event_data: {
                    nome: "Gabriel",
                    sobrenome: "Sampaio",
                    telefone: "19999999999",
                    cpf: "12345678900",
                    email: "gabriel@email.com"
                }
            },
            {
                event_type: EventTypes.DIVIDA_REGISTRADA,
                event_data: {
                    valor: 100
                }
            },
            {
                event_type: EventTypes.DIVIDA_REGISTRADA,
                event_data: {
                    valor: 50,
                    forma_pagamento : "PIX"

                }
            },
            {
                event_type: EventTypes.PAGAMENTO_EFETUADO,
                event_data: {
                    valor_abatido: 20,
                    forma_pagamento: "PIX",
                    taxa_percentual: 0,
                    valor_taxa: 0,
                    valor_pago_cliente: 20 + 0
                }
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