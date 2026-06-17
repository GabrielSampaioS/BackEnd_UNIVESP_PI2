import { DomainEvent } from "../../domain/events/DomainEvent"
import ExcelJS from "exceljs"

import { EventStore } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

export class ExcelEventRepository implements EventStore {

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
    async findByAggregateId(id: string): Promise<DomainEvent[]> {

        //Funciona ? 
        //TODO: Criar um excel e salvar
        if (this.rowBuffer.length) {
            this.flush();
        }

        const events: DomainEvent[] = [];

        this.sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // cabeçalho

            if (row.getCell(1).value === id) {
                events.push({
                    aggregate_id: String(row.getCell(1).value),
                    event_type: row.getCell(2).value as EventTypes,
                    created_at: new Date(
                        row.getCell(3).value as string
                    ),
                    event_data: JSON.parse(
                        String(row.getCell(4).value)
                    )
                });
            }
        });

        return events;
    }


    async save(event: DomainEvent): Promise<void> {
        this.rowBuffer.push(event)
        if (this.rowBuffer.length >= this.BATCH_SIZE) {
            await this.flush()
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

}