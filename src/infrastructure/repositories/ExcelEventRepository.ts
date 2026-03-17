import EventModel from "../../models/EventModel"
import { EventRepository } from "../../domain/repositories/EventRepository"
import ExcelJS from "exceljs"

export class ExcelEventRepository implements EventRepository {

    private workbook: ExcelJS.Workbook
    private sheet: ExcelJS.Worksheet
    private rowBuffer: any[] = []
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


    async save(event: any): Promise<void> {
        this.rowBuffer.push({
            aggregate_id: event.aggregate_id,
            event_type: event.event_type,
            created_at: event.created_at,
            event_data: JSON.stringify(event.event_data)
        })
        if (this.rowBuffer.length >= this.BATCH_SIZE) {
            this.flush()
        }
    }

    private flush() {
        for (const row of this.rowBuffer) {
            this.sheet.addRow(row)
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
    findByAggregateId(id: String): Promise<any[]> {
        throw new Error("Method not implemented.")
    }
    findClientes(query: any): Promise<any[]> {
        throw new Error("Method not implemented.")
    }
    findByNameOrCpf(nome?: string, cpf?: string): Promise<any[]> {
        throw new Error("Method not implemented.")
    }

}