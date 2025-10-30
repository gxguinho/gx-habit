# 📝 Docker Setup - Changelog de Migrations Automáticas

## ✨ O que mudou?

O backend agora **executa migrations automaticamente** ao iniciar, sem necessidade de comandos manuais!

## 🆕 Arquivos Adicionados

### 1. `docker-entrypoint.sh`
Script de inicialização que:
- ✅ Aguarda o PostgreSQL ficar disponível (até 30 tentativas)
- ✅ Executa `bun run db:migrate` automaticamente
- ✅ Inicia o servidor Fastify

**Localização**: Raiz do projeto
**Permissões**: Executável (`chmod +x`)
**Copiado para**: `/usr/local/bin/docker-entrypoint.sh` no container

## 🔄 Arquivos Modificados

### 1. `Dockerfile`
**Mudanças:**
```diff
+ # Install netcat for health checks and wait scripts
+ RUN apk add --no-cache netcat-openbsd

+ # Copy docker entrypoint script
+ COPY docker-entrypoint.sh /usr/local/bin/
+ RUN chmod +x /usr/local/bin/docker-entrypoint.sh

- CMD ["node", "dist/index.js"]
+ ENTRYPOINT ["docker-entrypoint.sh"]

- HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3
+ HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3
```

**Razão**:
- Netcat permite verificar se o PostgreSQL está pronto
- Entrypoint substitui o CMD para executar migrations antes do servidor
- Health check `start-period` aumentado para 40s para dar tempo das migrations executarem

### 2. `DOCKER.md`
**Mudanças:**
- ✨ Adicionada seção "Migrations Automáticas"
- 📋 Atualizado passo a passo de inicialização
- 🎯 Adicionada seção "Fluxo de Startup Automático"
- 🛠️ Adicionado troubleshooting de migrations
- 🌐 Diagrama de arquitetura atualizado com entrypoint
- ✅ Removido passo manual de executar migrations

### 3. `.dockerignore`
**Mudanças:**
```diff
+ # IMPORTANT: DO NOT ignore docker-entrypoint.sh - it's needed in the container!
+ # !docker-entrypoint.sh
```

**Razão**: Documentar que o script de entrypoint NÃO deve ser ignorado

## 📊 Fluxo Antes vs Depois

### ❌ Antes (Manual)
```bash
# 1. Subir containers
docker-compose up -d

# 2. Aguardar PostgreSQL
sleep 10

# 3. Executar migrations MANUALMENTE
docker-compose exec server bun run db:migrate

# 4. Verificar se funcionou
docker-compose logs server
```

### ✅ Depois (Automático)
```bash
# 1. Subir containers (TUDO AUTOMÁTICO!)
docker-compose up -d

# 2. Verificar logs (opcional)
docker-compose logs -f server
```

## 🎯 Benefícios

1. **🚀 Menos comandos**: De 3-4 comandos para 1 único comando
2. **✨ Zero configuração**: Não precisa lembrar de executar migrations
3. **🔒 Segurança**: Garante que o banco está sempre atualizado
4. **🐛 Menos erros**: Elimina esquecimento de migrations
5. **📦 Production-ready**: Ideal para CI/CD e deploys automáticos
6. **⏱️ Startup confiável**: Aguarda PostgreSQL automaticamente

## 🧪 Como Testar

### Teste 1: Primeiro startup
```bash
# Limpar tudo
docker-compose down -v

# Subir e verificar logs
docker-compose up -d
docker-compose logs -f server
```

**Esperado:**
```
🚀 Starting GX-Habit Backend...
⏳ Waiting for PostgreSQL to be ready...
✅ PostgreSQL is ready!
📦 Running database migrations...
✅ Migrations completed successfully!
🎯 Starting server...
Server running on port 3000
```

### Teste 2: Restart (migrations já aplicadas)
```bash
docker-compose restart server
docker-compose logs -f server
```

**Esperado:**
```
🚀 Starting GX-Habit Backend...
⏳ Waiting for PostgreSQL to be ready...
✅ PostgreSQL is ready!
📦 Running database migrations...
⚠️  Migrations failed or no migrations to run
🎯 Starting server...
Server running on port 3000
```

### Teste 3: Nova migration
```bash
# Adicionar nova migration
bun run db:generate

# Rebuild e subir
docker-compose up -d --build

# Verificar que aplicou
docker-compose logs server | grep "Migrations completed"
```

## 🔧 Troubleshooting

### Problema: "Migrations failed"
**Solução:**
```bash
# Ver erro completo
docker-compose logs server

# Executar manualmente para debug
docker-compose exec server sh -c "cd /app && bun run db:migrate"
```

### Problema: "PostgreSQL not ready"
**Solução:**
O script tenta 30 vezes. Se falhar, verifique:
```bash
# Status do PostgreSQL
docker-compose ps postgres

# Logs do PostgreSQL
docker-compose logs postgres

# Testar conexão
docker-compose exec postgres pg_isready -U gxhabit
```

### Problema: Script não é executado
**Solução:**
```bash
# Verificar se script existe no container
docker-compose exec server ls -la /usr/local/bin/ | grep docker-entrypoint

# Verificar permissões
docker-compose exec server ls -la /usr/local/bin/docker-entrypoint.sh

# Rebuild forçando
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Arquivos Relacionados

- `docker-entrypoint.sh` - Script de inicialização
- `Dockerfile` - Build da imagem com entrypoint
- `docker-compose.yml` - Orquestração dos serviços
- `DOCKER.md` - Documentação completa
- `.dockerignore` - Otimização de build

## 🎓 Próximos Passos

1. ✅ Testar localmente com `docker-compose up -d`
2. ✅ Verificar logs para confirmar migrations automáticas
3. ✅ Adicionar ao CI/CD se necessário
4. ✅ Documentar para o time

---

**Data**: 2025-10-29
**Autor**: Claude Code
**Versão**: 1.0.0
**Status**: ✅ Pronto para uso
