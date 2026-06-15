
export class EmailGateway{
    async sendEmail({remetente, destinatario, assunto, mensagem} : {remetente: string, destinatario: string, assunto:string, mensagem: string}){
        console.log(`E-mail enviado de ${remetente} para ${destinatario} com assunto ${assunto} e mensagem: ${mensagem}`)
    }
}   