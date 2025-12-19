# Docker Setup Guide

## Quick Start with Docker Compose

The easiest way to run the relayer locally with Docker:

### 1. Create `.env` file

```bash
# Required
RELAYER_PRIVATE_KEY=your_private_key_without_0x_prefix
RPC_URL=https://forno.celo-sepolia.celo-testnet.org

# Optional
MIN_BALANCE_WEI=1000000000000000000
```

### 2. Start Services

```bash
# Start PostgreSQL and Relayer
docker-compose up -d

# View logs
docker-compose logs -f relayer

# Check health
curl http://localhost:3001/health
```

### 3. Run Migrations

```bash
# Run migrations inside the container
docker-compose exec relayer npm run migrate
```

### 4. Stop Services

```bash
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

## Docker Build (Standalone)

### Build Image

```bash
docker build -t motus-relayer:latest .
```

### Run Container

```bash
docker run -d \
  --name motus-relayer \
  -p 3001:3001 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=motus_relayer \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your-password \
  -e RPC_URL=https://forno.celo-sepolia.celo-testnet.org \
  -e RELAYER_PRIVATE_KEY=your_private_key \
  motus-relayer:latest
```

## Railway Deployment with Docker

Railway can automatically detect and use your `Dockerfile`:

1. Push your code to GitHub
2. Connect repository to Railway
3. Railway will detect `Dockerfile` and build automatically
4. Add environment variables in Railway dashboard
5. Add PostgreSQL service in Railway (separate from relayer)

**Note**: Railway will build using your Dockerfile, so make sure it's in the root of your relayer directory.

## Docker Compose for Development

The `docker-compose.yml` includes:
- PostgreSQL database (port 5432)
- Relayer service (port 3001)
- Health checks
- Automatic restarts
- Volume persistence for database

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs relayer

# Check database connection
docker-compose exec relayer node -e "console.log(process.env.DB_HOST)"
```

### Database connection errors
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d motus_relayer -c "SELECT 1;"
```

### Port already in use
```bash
# Change ports in docker-compose.yml
ports:
  - "3002:3001"  # Use 3002 instead of 3001
```

## Production Considerations

For production deployments:

1. **Use managed PostgreSQL** (Railway, Supabase, etc.) instead of Docker PostgreSQL
2. **Set proper environment variables** (never commit secrets)
3. **Use health checks** (already included)
4. **Monitor logs** (Railway provides this)
5. **Set resource limits** in docker-compose.yml if needed

```yaml
relayer:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
```


