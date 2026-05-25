import { Request, Response } from "express"

import { MongoEventRepository } from "../../infrastructure/repositories/MongoEventRepository"

import { CriarCliente } from "../../application/useCases/CriarCliente"
import { RegistrarDivida } from "../../application/useCases/RegistrarDivida"
import { RegistrarPagamento } from "../../application/useCases/RegistrarPagamento"
import { ObterHistorico } from "../../application/useCases/ObterHistorico"
import { LocalizarClientes } from "../../application/useCases/LocalizarClientes"
import { AppError } from "../../shared/errors/AppError"

const repository = new MongoEventRepository()

export async function criarCliente(req: Request, res: Response) {
  try {
    const usecase = new CriarCliente(repository)

    const aggregate_id = await usecase.execute(req.body)

    return res.status(201).json({
      message: "Cliente criado",
      data: {
        id: aggregate_id,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        email: req.body.email
      }

    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      type: 'INVALID_DATA'
    })
  }

}

export async function registrarDivida(req: Request, res: Response) {

  try {
    const { id } = req.params
    const { valor } = req.body

    const usecase = new RegistrarDivida(repository)


    //Cambirra usar "as string" ??
    await usecase.execute(id as string, valor)

    return res.status(201).json({
      message: "Divida registrada",
      type: "DIVIDA_CRIADA"
    })

  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
        type: error.type
      })
    }
  }

  return res.status(500).json({
    message: "Erro interno do servidor",
    type: "INTERNAL_SERVER_ERROR"
  });
}

export async function registrarPagamento(req: Request, res: Response) {

  try {
    const { id } = req.params
    const { valor } = req.body

    const usecase = new RegistrarPagamento(repository)

    await usecase.execute(id as string, valor)

    return res.status(201).json({
      message: "Pagamento registrado",
      type: "PAPAMENTO_CRIADA"
    })
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
        type: error.type
      })
    }
  }

  return res.status(500).json({
    message: "Erro interno do servidor",
    type: "INTERNAL_SERVER_ERROR"
  });
}


export async function obterHistorico(req: Request, res: Response) {

  try {

    const { id } = req.params;

    const usecase = new ObterHistorico(repository);

    const result = await usecase.execute(id as string);

    return res.status(200).json(result);

  } catch (error: any) {

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

export async function localizarUser(req: Request, res: Response) {

  try {

    const { nome, cpf } = req.query as {
      nome?: string
      cpf?: string
    }

    const usecase = new LocalizarClientes(repository)

    const result = await usecase.execute(nome, cpf)


    if (result.length > 0) {
      return res.status(200).json(result)
    } else {
      return res.status(404).json({
        message: 'Nenhum cliente encontrado',
        type: 'NOT_FOUND'
      })
    }


  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      type: 'ERRO_INTERNO'
    })

  }


}