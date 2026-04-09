# JerseyStore — Loja de Camisas de Futebol

Sistema web completo com React, Node.js/Express e MySQL.


## Como Executar

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

---

### 1. Banco de Dados


-- No terminal, execute:
mysql -u root -p < database-true.sql

Se nao abra o arquivo pelo mySQL

Ou ate copie e cole o conteúdo do arquivo `database.sql` no seu cliente MySQL.

---

### 2. Backend

```bash
cd reactexpcriativa/backend
npm install

# Configure as variáveis de ambiente:
cp .env.example .env
# Edite o .env com seus dados do MySQL senha e user

npm start
# Servidor rodando em http://localhost:3001
```

#### Variáveis de ambiente (`.env`):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=futebol_shop
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

### 3. Frontend

```bash
cd reactexpcriativa/frontend
npm install
npm start
# Aplicação rodando em http://localhost:3000
```

---

## Acesso Admin

Na tela de login (`/login`):
- **Usuário:** `admin`
- **Senha:** `jersey2024`

>Deixado para poder testar a funcao de ADMIN 

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/shirts` | Listar camisas (paginação + filtros) |
| GET | `/api/shirts/featured` | Camisas em destaque |
| GET | `/api/shirts/:id` | Detalhe de uma camisa |
| POST | `/api/shirts` | Criar nova camisa |
| PUT | `/api/shirts/:id` | Atualizar camisa |
| DELETE | `/api/shirts/:id` | Remover camisa (soft delete) |
| GET | `/api/health` | Health check |

### Query params do GET /api/shirts
- `page` — número da página (default: 1)
- `limit` — itens por página (default: 8, max: 50)
- `search` — busca por nome, clube ou país
- `category` — filtro: titular, reserva, treino, retrô, seleção
- `featured` — `true` para destaques

---

## Funcionalidades

- **Listagem** com paginação, busca e filtro por categoria
- **Detalhe** do produto com seleção de tamanho
- **Painel Admin** com tabela completa e ações inline
- **CRUD completo** via modal (criar/editar/excluir)
- **Soft delete** (produtos removidos ficam inativos no banco)
- **Validações** no backend e feedback visual no frontend
- **Toast notifications** para todas as ações
- **Autenticação admin** via localStorage
- **Design responsivo** com Tailwind CSS

---

## Tecnologias

**Frontend:** React 18, React Router v6, Tailwind CSS, Fetch API  
**Backend:** Node.js, Express, mysql2, CORS, dotenv  
**Banco:** MySQL 8 com JSON columns para tamanhos/cores
