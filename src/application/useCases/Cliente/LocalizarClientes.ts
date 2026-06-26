import { EventReader } from "../../../domain/repositories/EventRepository";
import { NotFoundError } from "../../../middlewares/MiddlewareError";


export class LocalizarClientes {
    constructor(private repository: EventReader) { }

    async execute(nome?: string, cpf?: string) {
        const retorno = await this.repository.findByNameOrCpf(nome, cpf);

        if (retorno.length === 0) {
            throw new NotFoundError(
                "Cliente não localizado",
                "CLIENT_NOT_FOUND"
            );
        }else{
            return retorno;
        }
    }
}

