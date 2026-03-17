export class FakeDataGenerator {
    /*private generateNames(size: number): string[] {
        return Array.from({ length: size }, (_, i) => `Nome${i}`)
    }*/

    static generateCPF(): string {
        return Math.floor(Math.random() * 1e11).toString().padStart(11, '0')
    }

    static generatePhone(): string {
        return `(19) 9${Math.floor(10000000 + Math.random() * 90000000)}`
    }

    static generateValue(): number {
    return Math.floor(Math.random() * 90) + 10
    }
}

