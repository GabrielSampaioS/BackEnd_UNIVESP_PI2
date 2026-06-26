import { Request, Response } from "express"

import { RegisterUser } from "../../application/useCases/User/RegisterUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { LoginUser } from "../../application/useCases/User/LoginUser";

export class AuthController {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async register(req: Request, res: Response) {
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
  }

  async login(req: Request, res: Response) {
    const usecase = new LoginUser(this.userRepository)

    const result = await usecase.execute(req.body)

    return res.status(200).json({
      message: "Login realizado com sucesso",
      data: {
        token: result.token,

      }
    })
  }
}