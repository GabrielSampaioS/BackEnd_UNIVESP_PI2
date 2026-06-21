# LedgerFlow

## Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura](#arquitetura)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Começando](#começando)
6. [Executando Testes](#executando-testes)
7. [Documentação da API](#documentação-da-api)
8. [Deploy com Docker](#deploy-com-docker)
9. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
10. [Padrões de Design](#padrões-de-design)

---

## Visão Geral

LedgerFlow é um serviço backend projetado para gerenciar registros de crédito de clientes em pequenos negócios. Em vez de armazenar apenas o saldo atual, o sistema registra cada transação como um evento imutável, permitindo trilhas de auditoria completas e reconstrução histórica.

### Características Principais

- Arquitetura de Event Sourcing para histórico completo de transações
- Domain-Driven Design para isolamento de lógica de negócio
- Clean Architecture com separação clara de responsabilidades
- Cálculo automático de taxas baseado no método de pagamento
- Notificações por email no cadastro de cliente
- Cobertura abrangente de testes (E2E, Integração, Unitário)
- Suporte a Docker para deploy containerizado
- MongoDB para armazenamento persistente de eventos

### Regras de Negócio

O sistema aplica as seguintes regras de negócio:

- Clientes devem fornecer nome, sobrenome, telefone, CPF e email válidos
- Dívidas são registradas com descrições opcionais
- Pagamentos são processados com taxas específicas do método
  - PIX: 0% de taxa
  - Dinheiro: 0% de taxa
  - Crédito: 5% de taxa
- O saldo do cliente é calculado a partir do histórico completo de eventos
- Todas as transações são imutáveis e auditáveis

---

## Stack Tecnológico

### Tecnologias Principais

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | 5.9+ | Desenvolvimento type-safe |
| Express | 5.1+ | Framework de servidor HTTP |
| MongoDB | 7+ | Banco de dados de eventos |
| Mongoose | 9.7+ | ODM para MongoDB |

### Ferramentas de Desenvolvimento

| Ferramenta | Propósito |
|-----------|----------|
| tsx | Execução e testes TypeScript |
| ts-node-dev | Servidor de desenvolvimento com hot reload |
| Supertest | Biblioteca de asserção HTTP |
| ESLint | Qualidade e estilo de código |
| Docker | Orquestração de containers |
| Docker Compose | Gerenciamento de múltiplos containers |

### Framework de Testes

- Test runner nativo do Node.js
- Supertest para testes HTTP
- Funções mock para isolamento

---

## Arquitetura

### Princípios de Design

O projeto implementa três padrões arquiteturais principais:

#### 1. Event Sourcing

Em vez de armazenar estado atual, o sistema armazena eventos imutáveis representando mudanças de estado:

```
Linha do Tempo de Eventos:
├── ClienteCadastrado (Cliente registrado)
├── DividaRegistrada (Dívida registrada)
├── DividaRegistrada (Outra dívida registrada)
└── PagamentoEfetuado (Pagamento processado)

Estado Atual = Reproduzindo todos os eventos
```

Benefícios:
- Trilha de auditoria completa
- Consultas temporais (estado em qualquer ponto no tempo)
- Debugging e troubleshooting
- Conformidade e requisitos regulatórios

#### 2. Domain-Driven Design

Lógica de negócio isolada na camada de domínio:

```
Camada de Domínio (Lógica de Negócio Pura)
├── Entidades (Cliente)
├── Value Objects (FormaPagamento)
├── Eventos (DomainEvent)
├── Estratégias (TaxaStrategy)
└── Repositórios (EventRepository)
```

#### 3. Clean Architecture

Separação de responsabilidades entre camadas:

```
Camada de Interfaces (Controllers HTTP, Rotas)
    ↓
Camada de Aplicação (Casos de Uso, DTOs)
    ↓
Camada de Domínio (Regras de Negócio, Entidades)
    ↓
Camada de Infraestrutura (Banco de Dados, Serviços Externos)
```

### Fluxo de Dependências

```
Requisição HTTP
    ↓
Rota Express
    ↓
Controller (extrai dados HTTP)
    ↓
Caso de Uso (orquestra lógica de negócio)
    ↓
Entidade de Domínio (aplica regras de negócio)
    ↓
Repositório (persiste eventos)
    ↓
MongoDB (armazena eventos)
```

---

## Estrutura do Projeto

```
LedgerFlow/
├── src/
│   ├── domain/                          # Lógica de negócio (independente de framework)
│   │   ├── entities/
│   │   │   └── Cliente.ts               # Agregado raiz de cliente
│   │   ├── enums/
│   │   │   └── FormaPagamento.ts        # Enumeração de método de pagamento
│   │   ├── events/
│   │   │   ├── DomainEvent.ts           # Interface de evento
│   │   │   └── EventTypes.ts            # Constantes de tipo de evento
│   │   ├── repositories/
│   │   │   ├── EventRepository.ts       # Contrato de persistência de eventos
│   │   │   └── EmailService.ts          # Contrato de serviço de email
│   │   └── strategies/
│   │       ├── TaxaStrategy.ts          # Interface de cálculo de taxa
│   │       ├── TaxaPixStrategy.ts       # Estratégia de taxa PIX
│   │       ├── TaxaDinheiroStrategy.ts  # Estratégia de taxa Dinheiro
│   │       ├── TaxaCreditoStrategy.ts   # Estratégia de taxa Crédito
│   │       └── TaxaStrategyFactory.ts   # Factory de estratégias
│   │
│   ├── application/                     # Casos de uso e DTOs
│   │   ├── dto/
│   │   │   └── CriarClienteDTO.ts       # Input de criação de cliente
│   │   └── useCases/
│   │       ├── CriarCliente.ts          # Caso de uso: criar cliente
│   │       ├── RegistrarDivida.ts       # Caso de uso: registrar dívida
│   │       ├── RegistrarPagamento.ts    # Caso de uso: processar pagamento
│   │       ├── ObterHistorico.ts        # Caso de uso: obter histórico
│   │       └── LocalizarClientes.ts     # Caso de uso: buscar clientes
│   │
│   ├── infrastructure/                  # Implementações técnicas
│   │   ├── database/
│   │   │   └── mongoose.ts              # Configuração de conexão MongoDB
│   │   ├── repositories/
│   │   │   ├── MongoEventRepository.ts  # Armazenamento de eventos MongoDB
│   │   │   └── ExcelEventRepository.ts  # Armazenamento de eventos Excel (somente leitura)
│   │   └── models/
│   │       └── EventModel.ts            # Schema MongoDB
│   │
│   ├── interfaces/                      # Camada HTTP
│   │   ├── controllers/
│   │   │   └── ClienteController.ts     # Manipuladores de requisição HTTP
│   │   └── routes/
│   │       └── clientes.ts              # Definições de rota
│   │
│   ├── gateways/                        # Adaptadores de serviços externos
│   │   ├── cpf-api.gateway.ts           # Serviço de validação de CPF
│   │   └── email.gateways.ts            # Adaptador de serviço de email
│   │
│   ├── shared/                          # Utilitários compartilhados
│   │   └── errors/
│   │       └── AppError.ts              # Tratamento padronizado de erros
│   │
│   └── main/
│       ├── app.ts                       # Factory de app Express
│       ├── server.ts                    # Inicialização do servidor
│       └── scripts/
│           ├── generateData.ts          # Geração de dados sintéticos
│           ├── SyntheticDataGenerator.ts # Lógica de geração de dados
│           └── Helpers/
│               └── FakeDataGenerator.ts # Utilitários de dados fake
│
├── test/
│   ├── e2e/                             # Testes end-to-end
│   │   ├── post-clientes.e2e.spec.ts
│   │   ├── post-clientes-dividas.e2e.spec.ts
│   │   ├── post-clientes-pagamentos.e2e.spec.ts
│   │   ├── get-clientes.e2e.spec.ts
│   │   └── get-clientes-eventos.e2e.spec.ts
│   ├── int/                             # Testes de integração
│   │   └── cliente-int.spec.ts
│   ├── unit/                            # Testes unitários
│   │   └── cliente-unit.spec.ts
│   ├── factories/
│   │   └── cliente.factory.ts           # Factory de dados de teste
│   └── utils/
│       └── create-test-app.ts           # Helper de configuração de app de teste
│
├── docker-compose.yml                   # Ambiente de desenvolvimento
├── docker-compose.infra.yml             # Infraestrutura de produção
├── Dockerfile                           # Definição de imagem de container
├── package.json                         # Dependências do projeto
├── tsconfig.json                        # Configuração TypeScript
└── README.md                            # Este arquivo
```

---

## Começando

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn como gerenciador de pacotes
- MongoDB 7 ou superior (local ou Docker)
- Git

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/GabrielSampaioS/BackEnd_UNIVESP_PI2.git
cd BackEnd_UNIVESP_PI2
```

2. Instale as dependências:

```bash
npm install
```

3. Crie arquivo de ambiente:

```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente:

```env
PORT=3000
MONGO_URI=mongodb://admin:admin@localhost:27017/barDaFilo?authSource=admin
NODE_ENV=development
EMAIL_API_KEY=sua_chave_api_email
```

5. Inicie o MongoDB:

```bash
docker-compose up -d mongo
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

### Verificação

Teste se a API está rodando:

```bash
curl http://localhost:3000/clientes
```

---

## Executando Testes

### Estrutura de Testes

O projeto inclui três níveis de testes:

#### 1. Testes End-to-End (E2E)

Testam fluxos completos de usuário através de endpoints HTTP:

```bash
npm run test:e2e-concurrency1                                                                                                                                           
```


#### 2. Testes de Integração

Testam interação entre camadas (Casos de Uso + Repositório + Banco de Dados):

```bash
npm run test:int-concurrency1
```

#### 3. Testes Unitários

Testam lógica de domínio individual isoladamente:

```bash
npm run test:unit
```

---

## Documentação da API

### URL Base

```
http://localhost:3000
```

### Autenticação

Atualmente, a API não requer autenticação. Esta é uma consideração de segurança para implementação futura.

### Tratamento de Erros

Todos os erros seguem um formato padronizado:

```json
{
  "message": "Descrição do erro",
  "type": "CÓDIGO_ERRO"
}
```

Códigos de erro comuns:
- `INVALID_DATA` - Dados de entrada inválidos (HTTP 400)
- `CLIENT_NOT_FOUND` - Cliente não encontrado (HTTP 404)
- `INTERNAL_SERVER_ERROR` - Erro do servidor (HTTP 500)

### Endpoints

#### 1. Criar Cliente

Cria um novo cliente e envia email de boas-vindas.

**Requisição:**

```http
POST /clientes
Content-Type: application/json

{
  "nome": "Gabriel",
  "sobrenome": "Sampaio",
  "telefone": "11999999999",
  "cpf": "12345678998",
  "email": "gabriel@example.com"
}
```

**Resposta (201 Criado):**

```json
{
  "message": "Cliente criado",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Gabriel",
    "sobrenome": "Sampaio",
    "telefone": "11999999999",
    "cpf": "12345678998",
    "email": "gabriel@example.com"
  }
}
```

**Resposta de Erro (400 Requisição Inválida):**

```json
{
  "message": "Campo nome é obrigatório",
  "type": "INVALID_DATA"
}
```

**Regras de Validação:**
- `nome`: Obrigatório, string não vazia
- `sobrenome`: Obrigatório, string não vazia
- `telefone`: Obrigatório, 10-11 dígitos
- `cpf`: Obrigatório, 11 dígitos
- `email`: Obrigatório, formato de email válido

---

#### 2. Registrar Dívida

Registra uma dívida para um cliente existente.

**Requisição:**

```http
POST /clientes/{clienteId}/dividas
Content-Type: application/json

{
  "valor": 100,
  "descricao": "2kg de batata"
}
```

**Resposta (201 Criado):**

```json
{
  "message": "Divida registrada",
  "type": "DIVIDA_CRIADA"
}
```

**Resposta de Erro (404 Não Encontrado):**

```json
{
  "message": "Cliente não encontrado",
  "type": "CLIENT_NOT_FOUND"
}
```

**Regras de Validação:**
- `valor`: Obrigatório, número positivo
- `descricao`: Opcional, string
- `clienteId`: Deve ser UUID válido de cliente existente

---

#### 3. Processar Pagamento

Registra um pagamento para um cliente existente com cálculo automático de taxa.

**Requisição:**

```http
POST /clientes/{clienteId}/pagamentos
Content-Type: application/json

{
  "valor": 50,
  "forma_pagamento": "PIX"
}
```

**Resposta (201 Criado):**

```json
{
  "message": "Pagamento registrado",
  "type": "PAGAMENTO_CRIADO",
  "data": {
    "valor": 50,
    "forma_pagamento": "PIX",
    "taxaPercentual": 0,
    "valor_taxa": 0,
    "valorPagoCliente": 50
  }
}
```

**Métodos de Pagamento e Taxas:**

| Método | Taxa | Exemplo |
|--------|------|---------|
| PIX | 0% | 100,00 |
| DINHEIRO | 0% | 100,00 |
| CREDITO | 5% | 105,00 |

**Resposta de Erro (400 Requisição Inválida):**

```json
{
  "message": "Valor inválido",
  "type": "INVALID_DATA"
}
```

**Regras de Validação:**
- `valor`: Obrigatório, número positivo
- `forma_pagamento`: Obrigatório, um de (PIX, DINHEIRO, CREDITO)
- `clienteId`: Deve ser UUID válido de cliente existente

---

#### 4. Obter Histórico de Transações

Recupera histórico completo de transações e saldo atual de um cliente.

**Requisição:**

```http
GET /clientes/{clienteId}/eventos
```

**Resposta (200 OK):**

```json
{
  "historico": [
    {
      "aggregate_id": "550e8400-e29b-41d4-a716-446655440000",
      "event_type": "ClienteCadastrado",
      "event_data": {
        "nome": "Gabriel",
        "sobrenome": "Sampaio",
        "telefone": "11999999999",
        "cpf": "12345678998",
        "email": "gabriel@example.com"
      },
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "aggregate_id": "550e8400-e29b-41d4-a716-446655440000",
      "event_type": "DividaRegistrada",
      "event_data": {
        "valor": 100,
        "descricao": "2kg de batata"
      },
      "created_at": "2024-01-15T10:35:00Z"
    },
    {
      "aggregate_id": "550e8400-e29b-41d4-a716-446655440000",
      "event_type": "PagamentoEfetuado",
      "event_data": {
        "valor_abatido": 50,
        "forma_pagamento": "PIX",
        "taxaPercentual": 0,
        "valor_taxa": 0,
        "valorPagoCliente": 50
      },
      "created_at": "2024-01-15T10:40:00Z"
    }
  ],
  "saldo": 50
}
```

**Resposta de Erro (404 Não Encontrado):**

```json
{
  "message": "Cliente não localizado",
  "type": "CLIENT_NOT_FOUND"
}
```

---

#### 5. Buscar Clientes

Busca clientes por nome ou CPF.

**Requisição (por nome):**

```http
GET /clientes?nome=Gabriel
```

**Requisição (por CPF):**

```http
GET /clientes?cpf=12345678998
```

**Resposta (200 OK):**

```json
[
  {
    "aggregate_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_type": "ClienteCadastrado",
    "event_data": {
      "nome": "Gabriel",
      "sobrenome": "Sampaio",
      "telefone": "11999999999",
      "cpf": "12345678998",
      "email": "gabriel@example.com"
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Resposta de Erro (404 Não Encontrado):**

```json
{
  "message": "Cliente não localizado",
  "type": "NOT_FOUND"
}
```

**Parâmetros de Query:**
- `nome`: Opcional, nome do cliente (case-insensitive)
- `cpf`: Opcional, CPF do cliente (correspondência exata)

---

## Deploy com Docker

### Ambiente de Desenvolvimento

Para desenvolvimento local com MongoDB:

```bash
docker-compose up -d
```

Inicia:
- MongoDB na porta 27017
- Volume persistente para dados

Parar serviços:

```bash
docker-compose down
```

### Infraestrutura de Produção

Para deploy em produção com load balancing:

```bash
docker-compose -f docker-compose.infra.yml up -d
```

Inicia:
- MongoDB (armazenamento de eventos)
- Duas instâncias de API (api1, api2)
- Proxy reverso Nginx na porta 80

### Construindo Imagem Docker

Construa a imagem:

```bash
npm run build
docker build -t ledgerflow-api:latest .
```

Execute o container:

```bash
docker run -p 3000:3000 \
  -e MONGO_URI=mongodb://admin:admin@mongo:27017/barDaFilo?authSource=admin \
  -e PORT=3000 \
  ledgerflow-api:latest
```

---

## Fluxo de Desenvolvimento

### Servidor de Desenvolvimento

Inicie com hot reload:

```bash
npm run dev
```

O servidor reinicia automaticamente quando arquivos mudam.

### Build para Produção

Compile TypeScript para JavaScript:

```bash
npm run build
```

Saída: diretório `dist/`

Inicie servidor de produção:

```bash
npm start
```

### Qualidade de Código

Execute linter:

```bash
npm run lint
```

Corrija problemas de linting:

```bash
npm run lint -- --fix
```

### Variáveis de Ambiente

Variáveis principais:

| Variável | Padrão | Propósito |
|----------|--------|----------|
| PORT | 3000 | Porta do servidor |
| MONGO_URI | mongodb://admin:admin@localhost:27017/barDaFilo?authSource=admin | Conexão com banco de dados |
| NODE_ENV | development | Ambiente (development/production) |
| EMAIL_API_KEY | (obrigatório) | Autenticação do serviço de email |

---

## Padrões de Design

### 1. Strategy Pattern

O cálculo de taxas usa strategy pattern para extensibilidade:

```typescript
interface TaxaStrategy {
  obterTaxaPercentual(): number
  calcularTaxa(valor: number): number
  calcularValorTotal(valor: number): number
}

class TaxaPixStrategy implements TaxaStrategy {
  obterTaxaPercentual(): number { return 0 }
  calcularTaxa(valor: number): number { return 0 }
  calcularValorTotal(valor: number): number { return valor }
}

class TaxaCreditoStrategy implements TaxaStrategy {
  obterTaxaPercentual(): number { return 5 }
  calcularTaxa(valor: number): number { return valor * 0.05 }
  calcularValorTotal(valor: number): number { return valor * 1.05 }
}
```

Adicionar um novo método de pagamento requer apenas criar uma nova classe de estratégia.

### 2. Factory Pattern

Estratégias são criadas via factory:

```typescript
export class TaxaStrategyFactory {
  static criar(forma: FormaPagamento): TaxaStrategy {
    switch (forma) {
      case FormaPagamento.PIX:
        return new TaxaPixStrategy()
      case FormaPagamento.CREDITO:
        return new TaxaCreditoStrategy()
      case FormaPagamento.DINHEIRO:
        return new TaxaDinheiroStrategy()
    }
  }
}
```

### 3. Repository Pattern

Acesso a dados é abstraído:

```typescript
interface EventRepository {
  save(event: DomainEvent): Promise<void>
  findByAggregateId(id: string): Promise<DomainEvent[]>
  findClientes(query: any): Promise<DomainEvent[]>
  findByNameOrCpf(nome?: string, cpf?: string): Promise<DomainEvent[]>
}
```

Múltiplas implementações podem ser fornecidas (MongoDB, Excel, etc.).

### 4. Dependency Injection

Dependências são injetadas na raiz de composição:

```typescript
const eventRepository = new MongoEventRepository()
const emailService = new EmailGateway()
const app = criarApp({ eventRepository, emailService })
```

Controllers recebem dependências, não as criando.

### 5. Aggregate Pattern

Cliente é a raiz do agregado:

```typescript
export class Cliente {
  private events: DomainEvent[] = []

  static rehydrate(events: DomainEvent[]): Cliente {
    const cliente = new Cliente()
    cliente.events = events
    // Reconstruir estado a partir de eventos
    return cliente
  }

  registrarDivida(valor: number, descricao: string) {
    // Lógica de negócio
  }

  registrarPagamento(valor: number, forma: FormaPagamento) {
    // Lógica de negócio
  }
}
```

---

## Licença

ISC

## Autor

Gabriel Sampaio

---

## Roadmap

### Versão 2.0 (Planejado)

- Autenticação e autorização (JWT)
- Validação de entrada (schema Zod)
- Value Objects (Email, CPF, Money)
- Rate limiting
- Documentação de API (Swagger)

### Versão 3.0 (Futuro)

- Implementação CQRS
- Arquitetura de microserviços
- Notificações em tempo real (WebSocket)
- Análises avançadas
- Suporte a app mobile

---

## Referências

- Event Sourcing: https://martinfowler.com/eaaDev/EventSourcing.html
- Domain-Driven Design: https://www.domainlanguage.com/ddd/
- Clean Architecture: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- Princípios SOLID: https://en.wikipedia.org/wiki/SOLID
- Express.js: https://expressjs.com/
- MongoDB: https://www.mongodb.com/
- TypeScript: https://www.typescriptlang.org/

---
