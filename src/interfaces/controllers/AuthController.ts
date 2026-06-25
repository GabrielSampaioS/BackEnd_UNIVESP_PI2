import { Request, Response } from "express"

import { RegisterUser } from "../../application/useCases/User/RegisterUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { AppError } from "../../shared/errors/AppError";
import { LoginUser } from "../../application/useCases/User/LoginUser";

export class AuthController {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async register(req: Request, res: Response) {
    try {

      const { email, nome, senha } = req.body

      const usecase = new RegisterUser(this.userRepository)
      
      const result = await usecase.execute(req.body)

      return res.status(201).json({
        message: "Usuário criado",
        data: {
          id: result.id,
          nome: result.cliente.nome,
          email: result.cliente.email,
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

  async login(req: Request, res: Response) {
    try {
      const usecase = new LoginUser(this.userRepository)
      console.log("teste")

      const result = await usecase.execute(req.body)

      return res.status(200).json({
        message: "Login realizado com sucesso",
        data: {

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

}