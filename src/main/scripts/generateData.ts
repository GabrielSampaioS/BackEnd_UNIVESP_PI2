import dotenv from "dotenv"

//1) Mongo
//import { connectDatabase } from "../infrastructure/database/mongoose"
//import { MongoEventRepository } from "../infrastructure/repositories/MongoEventRepository"

//2) Excel
import { ExcelEventRepository } from "../../infrastructure/repositories/ExcelEventRepository"

 
import { CriarCliente } from "../../application/useCases/CriarCliente"
import { RegistrarDivida } from "../../application/useCases/RegistrarDivida"
import { RegistrarPagamento } from "../../application/useCases/RegistrarPagamento"

import { SyntheticDataGenerator } from "./SyntheticDataGenerator"
import { mock } from "node:test"

dotenv.config()

function createEmailGatewayMock() {
    return {
        sendEmail: mock.fn(async () => { })
    };
}

async function main() {

    //1) await connectDatabase()
    //1) const repo = new MongoEventRepository()
    
    const repo = new ExcelEventRepository()
    const serveceEmailMock = createEmailGatewayMock()

    const criarCliente = new CriarCliente(repo, serveceEmailMock)
    const registrarDivida = new RegistrarDivida(repo)
    const registrarPagamento = new RegistrarPagamento(repo)

    const generator = new SyntheticDataGenerator(
        criarCliente,
        registrarDivida,
        registrarPagamento
    )

    //TODO
    //Fazer um trycath para erros
    console.time("Gerando...")

    await generator.run()

    await repo.close("dados.xlsx")

    process.exit(0)
}

main()