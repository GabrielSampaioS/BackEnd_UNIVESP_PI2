import { EventRepository } from "../../domain/repositories/EventRepository";
import { EventTypes } from "../../domain/events/EventTypes";

import { AppError } from "../../shared/errors/AppError";

export class RegistrarDivida {

  constructor(private repository: EventRepository) { }

  async execute(aggregate_id: string, valor: number): Promise<void> {

    // Validação de valor
    if (!valor || valor <= 0) {

      throw new AppError(
        "Valor inválido",
        400,
        "INVALID_DATA"
      );

    }


    // Verifica se cliente existe
    // Verifica se cliente existe (codigo dupolicado com o usercase RegistrarPagamento)

    const cliente = await this.repository.findByAggregateId(
      aggregate_id
    );


    if (!cliente || cliente.length === 0) {

      throw new AppError(
        "Cliente não encontrado",
        404,
        "CLIENT_NOT_FOUND"
      );

    }

    // Criação do evento
    const event = {

      aggregate_id,

      event_type: EventTypes.DIVIDA_REGISTRADA,

      event_data: {
        valor
      },

      created_at: new Date()

    };

    try {

      await this.repository.save(event);

    } catch (error) {

      throw new AppError(
        "Erro ao registrar dívida",
        500,
        "INTERNAL_SERVER_ERROR"
      );

    }

  }

}