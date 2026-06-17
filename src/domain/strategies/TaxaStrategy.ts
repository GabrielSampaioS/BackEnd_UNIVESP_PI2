export interface TaxaStrategy{
    obterTaxaPercentual() : number
    calcularTaxa(valor: number) : number
    calcularValorTotal(valor: number): number
}

