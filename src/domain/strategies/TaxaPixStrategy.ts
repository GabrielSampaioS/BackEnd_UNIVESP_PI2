import { TaxaStrategy } from "./TaxaStrategy";

export class TaxaPixStrategy implements TaxaStrategy {

    private readonly taxaPercentual = 0;

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