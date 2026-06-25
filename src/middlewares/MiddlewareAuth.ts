import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/errors/AppError";

interface TokenPayload  {
    nome: string,
    email: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization;


    if (!authHeader) {
        throw new AppError(
            "Token não enviado",
            401,
            "UNAUTHORIZED"
        );

    }

    const [, token] = authHeader.split(" ");

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload;


        req.user = {
            nome: decoded.nome,
            email: decoded.email
        };


        next();

    } catch {
        throw new AppError(
            "Token inválido",
            401,
            "INVALID_TOKEN"
        );
    }
}