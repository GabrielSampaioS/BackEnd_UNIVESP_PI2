import { Request, Response } from "express"

import { MongoEventRepository } from "../../infrastructure/repositories/MongoEventRepository"

import { CriarCliente } from "../../application/useCases/CriarCliente"
import { RegistrarDivida } from "../../application/useCases/RegistrarDivida"
import { RegistrarPagamento } from "../../application/useCases/RegistrarPagamento"
import { ObterHistorico } from "../../application/useCases/ObterHistorico"

const repository = new MongoEventRepository()

export async function criarCliente(req: Request, res: Response) {

  const usecase = new CriarCliente(repository)

  const aggregate_id = await usecase.execute(req.body)

   return res.status(201).json({
    message: "Cliente criado",
    id: aggregate_id
  })

}

export async function registrarDivida(req: Request, res: Response) {

  const { id } = req.params
  const { valor } = req.body

  const usecase = new RegistrarDivida(repository)

  //teste
  await usecase.execute(id[0], valor)

  return res.status(201).json({
    message: "Divida registrada"
  })
}

export async function registrarPagamento(req: Request, res: Response) {

  const { id } = req.params
  const { valor } = req.body

  const usecase = new RegistrarPagamento(repository)

  await usecase.execute(id[0], valor)

  return res.status(201).json({
    message: "Pagamento registrado"
  })

}

export async function obterHistorico(req: Request, res: Response) {

  const { id } = req.params

  const usecase = new ObterHistorico(repository)

  const result = await usecase.execute(id[0])

  return res.status(200).json(result)

}