import { Request, Response } from "express"

import { CriarCliente } from "../../application/useCases/Cliente/CriarCliente"
import { RegistrarDivida } from "../../application/useCases/Cliente/RegistrarDivida"
import { RegistrarPagamento } from "../../application/useCases/Cliente/RegistrarPagamento"
import { ObterHistorico } from "../../application/useCases/Cliente/ObterHistorico"
import { LocalizarClientes } from "../../application/useCases/Cliente/LocalizarClientes"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EmailService } from "../../domain/repositories/EmailService"
import { BadRequestError } from "../../middlewares/MiddlewareError"


export class ClienteController {
  constructor(
    private repository: EventRepository,
    private emailGateway: EmailService
  ) { }

  async criarCliente(req: Request, res: Response) {
    const usecase = new CriarCliente(this.repository, this.emailGateway)

    const result = await usecase.execute(req.body)

    return res.status(201).json({
      message: "Cliente criado",
      data: {
        id: result.id,
        nome: result.cliente.nome,
        sobrenome: result.cliente.sobrenome,
        telefone: result.cliente.telefone,
        cpf: result.cliente.cpf,
        email: result.cliente.email
      }

    })
  }

  async registrarDivida(req: Request, res: Response) {

    const { id } = req.params
    const { valor } = req.body
    const { descricao } = req.body

    const usecase = new RegistrarDivida(this.repository)

    await usecase.execute(id as string, valor, descricao)

    return res.status(201).json({
      message: "Divida registrada",
      type: "DIVIDA_CRIADA"
    })

  }

  async registrarPagamento(req: Request, res: Response) {

    const { id } = req.params
    const { valor } = req.body
    const { forma_pagamento } = req.body

    const usecase = new RegistrarPagamento(this.repository)

    await usecase.execute(id as string, valor, forma_pagamento)

    return res.status(201).json({
      message: "Pagamento registrado",
      type: "PAGAMENTO_CRIADO",
      data: {
        valor,
        forma_pagamento
      }

    })
  }


  async obterHistorico(req: Request, res: Response) {

    const { id } = req.params;

    const usecase = new ObterHistorico(this.repository);

    const result = await usecase.execute(id as string);

    return res.status(200).json(result);


  }

  async localizarClientes(req: Request, res: Response) {
    const { nome, cpf } = req.query as {
      nome?: string
      cpf?: string
    }

    const usecase = new LocalizarClientes(this.repository)

    const result = await usecase.execute(nome, cpf)


    if (result.length > 0) {
      return res.status(200).json(result)
    } else {
      throw new BadRequestError("Nenhum cliente encontrado", "NOT_FOUND")
    }

  }

}