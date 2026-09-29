# 🎬 cmovies

API REST para gerenciamento de um catálogo pessoal de filmes e séries. Cadastre, liste, atualize e remova títulos, controlando se já assistiu ou não e sua nota pessoal.

Projeto construído do zero como estudo de **Node.js + Express** aplicando **arquitetura em camadas** (Controller → Service → Repository), validação manual de dados e tratamento centralizado de erros.

---

## Tecnologias

- **[Node.js](https://nodejs.org/)** — runtime JavaScript
- **[Express 5](https://expressjs.com/)** — framework web/HTTP
- **[PostgreSQL](https://www.postgresql.org/)** (via `pg`) — banco de dados relacional
- **[Docker Compose](https://docs.docker.com/compose/)** — sobe o banco de dados em container
- **[dotenv](https://www.npmjs.com/package/dotenv)** — carregamento de variáveis de ambiente
- **[nodemon](https://www.npmjs.com/package/nodemon)** — reinício automático em desenvolvimento

---

## Arquitetura

O projeto segue uma **arquitetura em camadas**, separando responsabilidades:

```
Requisição HTTP
      │
      ▼
   Routes        → define os endpoints e os conecta ao controller
      │
      ▼
  Controller      → recebe req/res, chama o service, monta a resposta
      │
      ▼
   Service        → valida os dados e aplica as regras de negócio
      │
      ▼
  Repository      → executa as queries SQL no banco de dados
      │
      ▼
  PostgreSQL
```

Erros de negócio (dados inválidos, registro não encontrado) são lançados através de uma classe customizada (`AppError`) e capturados por um **middleware central de tratamento de erros** (`errorHandler`), garantindo respostas HTTP padronizadas em toda a API.

---

## Estrutura de pastas

```
cmovies/
├── src/
│   ├── config/
│   │   ├── database.js             # cria o pool de conexões com o PostgreSQL (pg)
│   │   └── env.js                  # carrega e valida as variáveis de ambiente
│   ├── modules/
│   │   └── titles/
│   │       ├── title.routes.js         # define os endpoints (/, /:id) do módulo
│   │       ├── title.controller.js     # recebe req/res, chama o service
│   │       ├── title.service.js        # validação e regras de negócio
│   │       └── title.repository.js     # acesso ao banco (queries SQL)
│   ├── shared/
│   │   └── errors/
│   │       ├── AppError.js             # classe de erro customizada (mensagem + status HTTP)
│   │       └── errorHandler.js         # middleware central de tratamento de erros
│   ├── app.js                       # monta a aplicação Express (middlewares + rotas)
│   └── server.js                    # inicializa o servidor na porta configurada
├── docker-compose.yaml           # sobe o PostgreSQL em container
├── .env.example                  # modelo das variáveis de ambiente necessárias
├── package.json
└── README.md
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (recomendado v18+)
- [Docker](https://www.docker.com/) e Docker Compose instalados (para rodar o banco de dados)

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Jot44/cmovies.git
cd cmovies
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus próprios valores:

```bash
cp .env.example .env
```

O `.env` deve conter:

```env
PORT=<numero_da_porta>
DB_HOST=<host_do_banco>
DB_PORT=<porta_do_banco>
DB_USER=<usuario>
DB_PASSWORD=<senha>
DB_NAME=<nome_do_banco>
```

> Use `.env.example` apenas como referência do formato esperado. Se alguma dessas variáveis não for definida, a aplicação **falha ao iniciar** com um erro claro (`env.js` valida isso antes de qualquer outra coisa rodar).

### 4. Suba o banco de dados com Docker

```bash
docker compose up -d
```

Isso inicia um container PostgreSQL, expondo a porta `5434` da sua máquina para a `5432` do container, usando as credenciais definidas no seu `.env`.

### 5. Crie a tabela `titles`

Conecte-se ao banco (com o client de sua preferência, ex: DBeaver, TablePlus, psql) e rode:

```sql
CREATE TABLE titles (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	type VARCHAR(15) CHECK(type = 'movie' OR type = 'series') NOT NULL,
	genre VARCHAR(50),
	release_year INTEGER,
	rating NUMERIC(3,1),
	status VARCHAR(100) CHECK(status = 'want_to_watch' OR status = 'watched') DEFAULT 'want_to_watch',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Rode a aplicação

Em modo desenvolvimento (com reinício automático via `nodemon`):

```bash
npm run dev
```

Ou em modo produção:

```bash
npm start
```

Se tudo estiver certo, você verá no terminal:

```
Servidor rodando na porta <PORT>
```

A API estará disponível em `http://localhost:<PORT>`.

---

## Endpoints da API

Todas as rotas abaixo são prefixadas por **`/cmovies`**.

| Método   | Rota            | Descrição                          |
|----------|-----------------|-------------------------------------|
| `GET`    | `/cmovies`      | Lista todos os títulos              |
| `GET`    | `/cmovies/:id`  | Busca um título específico pelo id  |
| `POST`   | `/cmovies`      | Cria um novo título                 |
| `PUT`    | `/cmovies/:id`  | Atualiza um título existente        |
| `DELETE` | `/cmovies/:id`  | Remove um título                    |

### Modelo de dados (`title`)

| Campo           | Tipo               | Obrigatório | Regras                                             |
|-----------------|--------------------|-------------|-----------------------------------------------------|
| `name`          | string             | Sim         | Não pode ser vazio                                  |
| `type`          | string             | Sim         | Apenas `"movie"` ou `"series"`                     |
| `genre`         | string             | Não         | —                                                    |
| `release_year`  | number             | Não         | Entre `1888` e o ano atual + 1                      |
| `rating`        | number             | Não         | Entre `0` e `10`                                    |
| `status`        | string             | Não         | Apenas `"want_to_watch"` ou `"watched"` (padrão: `want_to_watch`) |

### Exemplo — criar um título

**Requisição**
```
POST /cmovies
Content-Type: application/json
```
```json
{
  "name": "Breaking Bad",
  "type": "series",
  "genre": "drama",
  "release_year": 2008,
  "rating": 9.5,
  "status": "watched"
}
```

**Resposta — `201 Created`**
```json
{
  "id": 1,
  "name": "Breaking Bad",
  "type": "series",
  "genre": "drama",
  "release_year": 2008,
  "rating": "9.5",
  "status": "watched",
  "created_at": "2026-09-28T14:30:00.000Z"
}
```

### Exemplo — erro de validação

**Requisição**
```json
{
  "name": "Filme Quebrado",
  "type": "documentario",
  "rating": 15
}
```

**Resposta — `400 Bad Request`**
```json
{
  "error": "Tipo inválido"
}
```

### Exemplo — registro não encontrado

**Requisição**
```
GET /cmovies/999
```

**Resposta — `404 Not Found`**
```json
{
  "error": "Registro não encontrado"
}
```

---

## Tratamento de erros

Todos os erros de negócio são instâncias de `AppError`, que carregam uma mensagem e um código de status HTTP:

```js
throw new AppError("Tipo inválido", 400);
```

Esses erros são capturados nos controllers (`try/catch`) e repassados via `next(err)` para o middleware central `errorHandler`, que monta a resposta final:

- Erros conhecidos (`AppError`) → retornam o `statusCode` e a mensagem original.
- Erros inesperados → retornam `500` com uma mensagem genérica, evitando expor detalhes internos da aplicação.

| Status | Significado                                  |
|--------|-----------------------------------------------|
| `200`  | Requisição bem-sucedida (busca/atualização)   |
| `201`  | Recurso criado com sucesso                    |
| `204`  | Recurso removido com sucesso (sem conteúdo)   |
| `400`  | Dados inválidos enviados na requisição        |
| `404`  | Recurso não encontrado                        |
| `500`  | Erro interno inesperado do servidor           |

---

## Testando a API

Você pode testar todos os endpoints usando o [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/):

1. Suba o projeto (`npm run dev`).
2. Crie requisições para `http://localhost:<PORT>/cmovies`, usando os métodos e exemplos de corpo (`Body → raw → JSON`) mostrados na seção de endpoints acima.
3. Confira os status codes retornados de acordo com a tabela de erros.

---

## 📝 Licença

Este projeto está sob a licença ISC.
