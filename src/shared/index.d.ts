declare namespace Express {
    export interface Request {
        user?: {
            nome: string;
            email: string;
        };
    }
}