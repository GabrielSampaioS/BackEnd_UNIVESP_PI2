import { Request, Response } from "express"

import { CriarCliente } from "../../application/useCases/Cliente/CriarCliente"
import { RegistrarDivida } from "../../application/useCases/Cliente/RegistrarDivida"
import { RegistrarPagamento } from "../../application/useCases/Cliente/RegistrarPagamento"
import { ObterHistorico } from "../../application/useCases/Cliente/ObterHistorico"
import { LocalizarClientes } from "../../application/useCases/Cliente/LocalizarClientes"
import { AppError } from "../../shared/errors/AppError"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EmailGateway } from "../../gateways/email.gateways"


export class ClienteController {
  constructor(
    private repository: EventRepository,
    private emailGateway: EmailGateway
  ) { }

  async criarCliente(req: Request, res: Response) {
    try {
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
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          type: error.type
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
        type: "INTERNAL_SERVER_ERROR"
      });

    }

  }

  async registrarDivida(req: Request, res: Response) {

    try {
      const { id } = req.params
      const { valor } = req.body
      const { descricao } = req.body

      const usecase = new RegistrarDivida(this.repository)


      //Cambirra usar "as string" ??
      await usecase.execute(id as string, valor, descricao)

      return res.status(201).json({
        message: "Divida registrada",
        type: "DIVIDA_CRIADA"
      })

    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          type: error.type
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
        type: "INTERNAL_SERVER_ERROR"
      });

    }

  }

  async registrarPagamento(req: Request, res: Response) {

    try {
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
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          type: error.type
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
        type: "INTERNAL_SERVER_ERROR"
      });

    }

  }


  async obterHistorico(req: Request, res: Response) {

    try {

      const { id } = req.params;

      const usecase = new ObterHistorico(this.repository);

      const result = await usecase.execute(id as string);

      return res.status(200).json(result);

    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          type: error.type
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
        type: "INTERNAL_SERVER_ERROR"
      });

    }

  }

  async localizarUser(req: Request, res: Response) {

    try {

      const { nome, cpf } = req.query as {
        nome?: string
        cpf?: string
      }

      const usecase = new LocalizarClientes(this.repository)

      const result = await usecase.execute(nome, cpf)


      if (result.length > 0) {
        return res.status(200).json(result)
      } else {
        return res.status(404).json({
          message: 'Nenhum cliente encontrado',
          type: 'NOT_FOUND'
        })
      }

    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message,
          type: error.type
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
        type: "INTERNAL_SERVER_ERROR"
      });

    }

  }

}