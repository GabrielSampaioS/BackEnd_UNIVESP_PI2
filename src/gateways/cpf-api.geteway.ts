export class CpfApiGateway {

    //Apenas simular uma chamada ao um serviço externo

    async consultarCPF({ cpf }: { cpf: number }) {

        const apiEndPonit = `https://validarcpf/api/cof${cpf}` 
        const res = await fetch(apiEndPonit, {
            method: 'GET',
            headers:{
                'Content-Type' : 'application/json'
            }
        })

        const sus = res.ok;

        return sus;
    }
}