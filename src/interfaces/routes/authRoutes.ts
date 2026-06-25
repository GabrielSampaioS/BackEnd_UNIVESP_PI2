import express  from "express";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { AuthController } from "../controllers/AuthController";

export default function authRoute({userRepository} : {userRepository : UserRepository}){

    const router = express.Router()

    const authController = new AuthController(userRepository)

    router.post("/register", authController.register.bind(authController))

    router.post("/login", authController.login.bind(authController))

    return router;
}