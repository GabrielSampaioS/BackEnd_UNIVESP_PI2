import { CriarCliente } from "../../application/useCases/CriarCliente"
import { RegistrarDivida } from "../../application/useCases/RegistrarDivida"
import { RegistrarPagamento } from "../../application/useCases/RegistrarPagamento"
import { FakeDataGenerator } from "../../main/scripts/Helpers/FakeDataGenerator"

export class SyntheticDataGenerator {
    constructor(
        private criarCliente: CriarCliente,
        private registrarDivida: RegistrarDivida,
        private registrarPagamento: RegistrarPagamento
    ) { }

    async run() {

        const firstNames = ['Ana', 'Lucas', 'Maria']
        const lastNames = ['Silva', 'Sampaio', 'Oliveira']


        for (const fn of firstNames) {
            for (const ln of lastNames) {

                

                // ---------------- CRIAR CLIENTE ----------------
                const clienteId = await this.criarCliente.execute({
                    nome: fn,
                    sobrenome: ln,
                    telefone: FakeDataGenerator.generatePhone(),
                    cpf: FakeDataGenerator.generateCPF(),
                    email: `${fn}.${ln}@gmail.com`.toLowerCase()
                })

                // ---------------- GERAR DIVIDAS ----------------
                const totalDividas = Math.floor(Math.random() * 10)

                for (let qtdDividas = 0; qtdDividas < totalDividas; qtdDividas++) {
                    const valorDivida = FakeDataGenerator.generateValue()

                    await this.registrarDivida.execute(
                        clienteId,
                        valorDivida
                    )
                }

                // ---------------- GERAR PAGAMENTOS ----------------
                const totalPagamentos = Math.floor(Math.random() * 10)

                for (let qtdPagamento = 0; qtdPagamento < totalPagamentos; qtdPagamento++) {
                    const valorPagamento = FakeDataGenerator.generateValue()

                    await this.registrarPagamento.execute(
                        clienteId,
                        valorPagamento
                    )
                }



             
            }
        }
    }
}