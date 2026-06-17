import { TaxaStrategy } from "./TaxaStrategy";

export class TaxaCreditoStrategy implements TaxaStrategy {

    private readonly taxaPercentual = 10;

    obterTaxaPercentual(): number {
        return this.taxaPercentual
    }
    calcularTaxa(valor: number): number {
        return valor * (this.taxaPercentual * 100)
    }
    calcularValorTotal(valor: number): number {
        return valor + this.calcularTaxa(valor)

    }

}