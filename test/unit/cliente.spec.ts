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

        });

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

        const event = cliente.registrarDivida(50);
        

        assert.strictEqual(
            event.event_type,
            EventTypes.DIVIDA_REGISTRADA
        );

        assert.strictEqual(
            event.event_data.valor,
            50
        );

        assert.strictEqual(
            cliente.getSaldo(),
            50
        );

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

            cliente.registrarDivida(0), "Valor da dívida deve ser maior que zero";

        });

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
                    valor: 50
                }
            },
            {
                event_type: EventTypes.PAGAMENTO_EFETUADO,
                event_data: {
                    valor: 20
                }
            }
        ]);

        assert.strictEqual(
            cliente.getSaldo(),
            130
        );

    });


         
});