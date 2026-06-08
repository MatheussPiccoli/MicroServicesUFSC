# API Gateway — Smart Lockers

Centraliza o acesso aos cinco microservices do sistema de smart lockers.

## Portas

| Serviço              | Porta | Prefix interno   |
| -------------------- | ----- | ---------------- |
| **API Gateway**      | 3000  | —                |
| Residents            | 3002  | `/api/residents` |
| Entregas             | 3003  | `/entregas`      |
| Logging              | 3004  | `/api/logs`      |
| Lockers              | 3005  | `/lockers`       |
| Controle de Abertura | 3006  | `/abertura`      |

## Instalação

```bash
npm install
```

## Execução

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload)
npm run dev
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (já incluído com os valores padrão):

```env
GATEWAY_PORT=3000

LOCKERS_SERVICE_URL=http://localhost:3005
RESIDENTS_SERVICE_URL=http://localhost:3002
DELIVERIES_SERVICE_URL=http://localhost:3003
LOGGING_SERVICE_URL=http://localhost:3004
ABERTURA_SERVICE_URL=http://localhost:3006
```

## Rotas disponíveis

### Lockers — `/api/lockers`

| Método | Rota                                          | Descrição                          |
| ------ | --------------------------------------------- | ---------------------------------- |
| GET    | `/api/lockers`                                | Lista todos os lockers             |
| GET    | `/api/lockers/:id`                            | Busca locker por ID                |
| POST   | `/api/lockers`                                | Cadastra novo locker               |
| GET    | `/api/lockers/:id/compartimentos/disponiveis` | Compartimentos disponíveis         |
| PATCH  | `/api/lockers/compartimentos/ocupacao`        | Atualiza ocupação de compartimento |

### Residents (Condôminos) — `/api/residents`

| Método | Rota                              | Descrição               |
| ------ | --------------------------------- | ----------------------- |
| POST   | `/api/residents`                  | Cadastra condômino      |
| GET    | `/api/residents/locker/:lockerId` | Condôminos de um locker |
| GET    | `/api/residents/:id`              | Busca condômino por ID  |
| PATCH  | `/api/residents/:id`              | Atualiza condômino      |
| DELETE | `/api/residents/:id`              | Remove condômino        |

### Entregas — `/api/entregas`

| Método | Rota                        | Descrição               |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/entregas`             | Lista todas as entregas |
| GET    | `/api/entregas/:id`         | Busca entrega por ID    |
| POST   | `/api/entregas`             | Registra nova entrega   |
| POST   | `/api/entregas/:id/retirar` | Registra retirada       |

### Logs — `/api/logs`

| Método | Rota               | Descrição           |
| ------ | ------------------ | ------------------- |
| GET    | `/api/logs`        | Lista todos os logs |
| GET    | `/api/logs/:logId` | Busca log por ID    |
| POST   | `/api/logs`        | Cria novo log       |

### Abertura — `/api/abertura`

| Método | Rota                  | Descrição             |
| ------ | --------------------- | --------------------- |
| POST   | `/api/abertura/abrir` | Abre um compartimento |

### Health Check

| Método | Rota      | Descrição         |
| ------ | --------- | ----------------- |
| GET    | `/health` | Status do gateway |

## Estrutura do projeto

```
api-gateway/
├── src/
│   ├── server.js          # Entry point
│   ├── config.js          # URLs dos microservices
│   ├── routes/
│   │   ├── lockers.js
│   │   ├── residents.js
│   │   ├── entregas.js
│   │   ├── logs.js
│   │   └── abertura.js
│   └── services/
│       └── proxy.js       # Encaminha requisições via axios
├── .env
└── package.json
```
