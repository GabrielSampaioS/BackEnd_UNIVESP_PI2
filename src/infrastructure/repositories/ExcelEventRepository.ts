import { DomainEvent } from "../../domain/events/DomainEvent"
import ExcelJS from "exceljs"
import { EventRepository } from "../../domain/repositories/EventRepository"

export class ExcelEventRepository implements EventRepository{

    private workbook: ExcelJS.Workbook
    private sheet: ExcelJS.Worksheet
    private rowBuffer: DomainEvent[] = []
    private readonly BATCH_SIZE = 1000

    constructor() {
        this.workbook = new ExcelJS.Workbook()
        this.sheet = this.workbook.addWorksheet("eventes")

        this.sheet.columns = [
            { header: "aggregate_id", key: "aggregate_id" },
            { header: "event_type", key: "event_type" },
            { header: "created_at", key: "created_at" },
            { header: "event_data", key: "event_data" }
        ]
    }


    async save(event: DomainEvent): Promise<void> {
        this.rowBuffer.push(event)
        if (this.rowBuffer.length >= this.BATCH_SIZE) {
            this.flush()
        }
    }

    private flush() {
        for (const event of this.rowBuffer) {
            this.sheet.addRow({
                aggregate_id: event.aggregate_id,
                event_type: event.event_type,
                created_at: event.created_at,
                event_data: JSON.stringify(event.event_data)
            })
        }
        this.rowBuffer = []
    }
    
    async close(fileName = "event.xlsx") {
        if (this.rowBuffer.length) {
            this.flush()
        }

        await this.workbook.xlsx.writeFile(fileName)
    }


    // ---------------- NÃO IMPLEMENTADOS ----------------
    // Problema com L do SOLID
    findByAggregateId(id: string): Promise<DomainEvent[]> {
        throw new Error("Method not implemented.")
    }
    findClientes(query: any): Promise<DomainEvent[]> {
        throw new Error("Method not implemented.")
    }
    findByNameOrCpf(nome?: string, cpf?: string): Promise<DomainEvent[]> {
        throw new Error("Method not implemented.")
    }

}