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

  res.json({ aggregate_id })

}

export async function registrarDivida(req: Request, res: Response) {

  const { aggregate_id, valor } = req.body

  const usecase = new RegistrarDivida(repository)

  await usecase.execute(aggregate_id, valor)

  res.json({ message: "Divida registrada" })

}

export async function registrarPagamento(req: Request, res: Response) {

  const { aggregate_id, valor } = req.body

  const usecase = new RegistrarPagamento(repository)

  await usecase.execute(aggregate_id, valor)

  res.json({ message: "Pagamento registrado" })

}

export async function obterHistorico(req: Request, res: Response) {

  const { aggregate_id } = req.query as any

  const usecase = new ObterHistorico(repository)

  const result = await usecase.execute(aggregate_id)

  res.json(result)

}