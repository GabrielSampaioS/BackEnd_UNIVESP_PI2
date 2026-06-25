import express  from "express";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { AuthController } from "../controllers/AuthController";

export default function authRoute({userRepository} : {userRepository : UserRepository}){

    const router = express.Router()

    const authController = new AuthController(userRepository)

    console.log(userRepository)

    router.post("/", authController.register.bind(authController))

    router.post("/", authController.login.bind(authController))

    return router;
}