# 🐳 Docker Setup - GX-Habit

Este guia explica como executar o backend e o PostgreSQL usando Docker.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
# Database Configuration
POSTGRES_USER=gxhabit
POSTGRES_PASSWORD=gxhabit123
POSTGRES_DB=gxhabit
POSTGRES_PORT=5432

# Database URL
DATABASE_URL=postgresql://gxhabit:gxhabit123@postgres:5432/gxhabit

# Server Configuration
SERVER_PORT=3000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

### 2. Instalar Dependências do PostgreSQL

Antes de executar o Docker, instale a dependência do PostgreSQL:

```bash
bun install
```

ou se preferir npm:

```bash
npm install
```

### 3. Gerar Migrações do Banco de Dados (Apenas primeira vez)

Se você ainda não criou as migrações, execute:

```bash
bun run db:generate
```

### 4. Iniciar os Serviços

Execute o seguinte comando para iniciar o PostgreSQL e o backend:

```bash
docker-compose up -d
```

Este comando irá:
- Baixar as imagens necessárias (PostgreSQL 16 Alpine e Node 20 Alpine)
- Criar e iniciar o container do PostgreSQL
- Construir e iniciar o container do backend
- **Executar migrations automaticamente no startup do backend** ✨
- Criar uma rede Docker para comunicação entre os serviços
- Criar um volume persistente para os dados do PostgreSQL

> **✨ Migrations Automáticas**: O backend agora executa automaticamente `bun run db:migrate` durante o startup, garantindo que o banco de dados esteja sempre atualizado!

### 5. Verificar Status dos Serviços

```bash
docker-compose ps
```

Você deverá ver algo como:

```
NAME                  IMAGE                  STATUS         PORTS
gx-habit-postgres     postgres:16-alpine     Up (healthy)   0.0.0.0:5432->5432/tcp
gx-habit-server       gx-habit-server        Up (healthy)   0.0.0.0:3000->3000/tcp
```

### 6. Verificar Logs de Inicialização

Para confirmar que as migrations foram executadas com sucesso:

```bash
docker-compose logs server
```

Você deverá ver no log:
```
🚀 Starting GX-Habit Backend...
⏳ Waiting for PostgreSQL to be ready...
✅ PostgreSQL is ready!
📦 Running database migrations...
✅ Migrations completed successfully!
🎯 Starting server...
Server running on port 3000
```

## 📝 Comandos Úteis

### Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas o backend
docker-compose logs -f server

# Apenas o PostgreSQL
docker-compose logs -f postgres
```

### Parar os Serviços

```bash
docker-compose down
```

### Parar e Remover Volumes (⚠️ Remove todos os dados!)

```bash
docker-compose down -v
```

### Reconstruir as Imagens

```bash
docker-compose up -d --build
```

### Acessar o Shell do Container

```bash
# Backend
docker-compose exec server sh

# PostgreSQL
docker-compose exec postgres sh
```

### Executar Comandos no Backend

```bash
# Executar migrações manualmente (normalmente não necessário - é automático!)
docker-compose exec server sh -c "cd /app && bun run db:migrate"

# Gerar novas migrações
docker-compose exec server sh -c "cd /app && bun run db:generate"

# Abrir Drizzle Studio
docker-compose exec server sh -c "cd /app && bun run db:studio"
```

## 🔍 Acessar o Banco de Dados

### Via Docker

```bash
docker-compose exec postgres psql -U gxhabit -d gxhabit
```

### Via Cliente PostgreSQL Local

Se você tiver um cliente PostgreSQL instalado localmente:

```bash
psql postgresql://gxhabit:gxhabit123@localhost:5432/gxhabit
```

### Via Drizzle Studio

```bash
# Localmente
bun run db:studio

# Via Docker
docker-compose exec server bun run db:studio
```

## 🧹 Limpeza

### Remover Containers e Volumes

```bash
docker-compose down -v
```

### Remover Imagens

```bash
docker rmi gx-habit-server
```

## 🛠️ Troubleshooting

### Migrations falharam no startup

Se você ver erros relacionados a migrations nos logs:

```bash
# Ver logs do servidor
docker-compose logs server

# Executar migrations manualmente
docker-compose exec server sh -c "cd /app && bun run db:migrate"
```

**Causas comuns:**
- Arquivos de migration não estão no container (reconstrua: `docker-compose up -d --build`)
- PostgreSQL não estava pronto (o script aguarda 30 tentativas)
- Sintaxe SQL inválida nas migrations

### Backend não conecta ao PostgreSQL

1. Verifique se o PostgreSQL está saudável:
   ```bash
   docker-compose ps
   ```

2. Verifique os logs do PostgreSQL:
   ```bash
   docker-compose logs postgres
   ```

3. Verifique a variável `DATABASE_URL` no `.env`

4. Verifique se o backend está aguardando o PostgreSQL:
   ```bash
   docker-compose logs server | grep "Waiting for PostgreSQL"
   ```

### Porta já em uso

Se as portas 3000 ou 5432 já estiverem em uso, altere no arquivo `.env`:

```env
SERVER_PORT=3001
POSTGRES_PORT=5433
```

E recrie os containers:

```bash
docker-compose down
docker-compose up -d
```

### Reconstruir do Zero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 🔐 Segurança em Produção

⚠️ **IMPORTANTE**: Para ambientes de produção:

1. **Altere as credenciais do banco de dados**
2. **Use variáveis de ambiente seguras**
3. **Configure HTTPS/TLS**
4. **Use secrets do Docker ou ferramentas de gerenciamento de secrets**
5. **Configure firewalls apropriadamente**
6. **Não exponha a porta do PostgreSQL publicamente**

## 📊 Monitoramento

### Health Checks

Os containers incluem health checks:

- **PostgreSQL**: Verifica conectividade a cada 10s
- **Backend**: Verifica endpoint `/` a cada 30s

Você pode visualizar o status:

```bash
docker-compose ps
```

## 🌐 Arquitetura

```
┌─────────────────────────────────────────┐
│         Docker Network                   │
│        gx-habit-network                  │
│                                          │
│  ┌──────────────────┐                    │
│  │   PostgreSQL     │                    │
│  │     :5432        │                    │
│  │  (Health Check)  │                    │
│  └────────┬─────────┘                    │
│           │                              │
│           │ 1. Wait for DB               │
│           ▼                              │
│  ┌──────────────────┐                    │
│  │   Entrypoint     │                    │
│  │ docker-entrypoint│                    │
│  │                  │                    │
│  │ 2. Run Migrations│                    │
│  └────────┬─────────┘                    │
│           │                              │
│           │ 3. Start Server              │
│           ▼                              │
│  ┌──────────────────┐                    │
│  │    Backend       │                    │
│  │     :3000        │                    │
│  │ (Fastify + Auth) │                    │
│  └──────────────────┘                    │
└─────────────────────────────────────────┘
              │
              ▼
       Host Machine
   localhost:3000 → Backend API
   localhost:5432 → PostgreSQL
```

## 📦 Estrutura de Volumes

- `postgres_data`: Armazena dados do PostgreSQL persistentemente

Para listar volumes:

```bash
docker volume ls
```

Para inspecionar um volume:

```bash
docker volume inspect gx-habit_postgres_data
```

---

## 🎯 Fluxo de Startup Automático

Quando você executa `docker-compose up -d`, o seguinte acontece automaticamente:

1. **PostgreSQL inicia** e passa pelo health check
2. **Backend aguarda** o PostgreSQL ficar disponível (até 30 tentativas)
3. **Migrations executam** automaticamente via `docker-entrypoint.sh`
4. **Servidor inicia** na porta 3000
5. **Health check** confirma que tudo está funcionando

Tudo isso é **100% automático** - você só precisa de um comando! 🚀

---

**Pronto!** Seu backend e PostgreSQL estão rodando em containers Docker com migrations automáticas.

Para desenvolvimento local sem Docker, veja o README principal do projeto.
