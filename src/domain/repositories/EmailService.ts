export interface EmailService {
    sendEmail(data: {
        remetente: string
        destinatario: string
        assunto: string
        mensagem: string
    }): Promise<void>
}