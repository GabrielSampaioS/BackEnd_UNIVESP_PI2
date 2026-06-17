import { FormaPagamento } from "../enums/FormaPagamento";
import { TaxaStrategy } from "./TaxaStrategy";
import { TaxaPixStrategy } from "./TaxaPixStrategy";
import { TaxaDinheiroStrategy } from "./TaxaDinheiroStrategy";
import { TaxaCreditoStrategy } from "./TaxaCreditoStrategy";

export class TaxaStrategyFactory {
    static criar(forma_pagamento: FormaPagamento): TaxaStrategy {
        switch (forma_pagamento) {
            case FormaPagamento.CREDITO:
                return new TaxaCreditoStrategy();
            case FormaPagamento.PIX:
                return new TaxaPixStrategy();
            case FormaPagamento.DINHEIRO:
                return new TaxaDinheiroStrategy();

            default:
                throw new Error(
                    `Forma de pagamento não suportada: ${forma_pagamento}`
                );

        }

    }
}