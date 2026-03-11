import {EventTypes} from "../events/EventTypes"

export class Cliente{
    private events: any[]
    constructor(events: any[]){
        this.events = events
    }

    getSaldo(): number{
        let saldo = 0;
        this.events.forEach(events =>{
            if(events.event_type === EventTypes.DIVIDA_REGISTRADA){
                saldo -= Number(events.event_data.valor)
            }
            if(events.event_type === EventTypes.PAGAMENTO_EFETUADO){
                saldo += Number(events.event_data.valor)
            }
        })
        return saldo;
    }
}