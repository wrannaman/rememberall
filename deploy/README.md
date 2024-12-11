# Rememberall Deployment

This directory contains the deployment configuration for the Rememberall application stack.

## Prerequisites

- Docker and Docker Compose installed
- Access to required environment variables

## Stack Components

- **Milvus** (Vector Database) - Port `19530`
- **PostgreSQL** (Relational Database) - Port `5432`
- **Redis** (Cache & Queue) - Port `6379`
- **API** (Backend Service) - Port `3001`
- **App** (Frontend Service) - Port `3000`

## Environment Variables

Create a `.env` file in this directory with the following variables:

### PostgreSQL

### PostgreSQL
```plaintext
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=your_db_name
PG_SSL=false
ENV=production
```
# Health Checks

- **Milvus**: [http://localhost:9091/healthz](http://localhost:9091/healthz)
- **API**: [http://localhost:3001/health](http://localhost:3001/health)
- **App**: [http://localhost:3000](http://localhost:3000)

# Data Persistence

Data is persisted in Docker volumes:
- `milvus_data`: Milvus data
- `postgres_data`: PostgreSQL data
- `redis_data`: Redis data

# Troubleshooting

## 1. Service won't start:
- Check logs: `docker-compose logs <service_name>`
- Verify environment variables
- Ensure ports are not in use

## 2. Database connection issues:
- Verify PostgreSQL credentials
- Check if the database is initialized
- Ensure services are on the same network

## 2. Database connection issues:
- Verify PostgreSQL credentials
- Check if the database is initialized
- Ensure services are on the same network

## 3. Memory errors:
- Increase Docker memory limit
- Check service resource usage

# Development

For local development without Docker:

1. Install dependencies in both `api/` and `app/` directories.
2. Run services individually using their respective npm scripts.
3. Configure environment variables for local development.

