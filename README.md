# Backend Express Template

A backend template built with Express.js, TypeScript, TypeORM, and JWT.

## Features

- [x] **API Documentation**: Integrated Swagger UI for easy API exploration.
- [x] **CRUD Operations**: Example CRUD APIs for user management.
- [x] **Authentication**: JWT-based authentication middleware.
- [x] **Unit Testing**: Setup with Jest for service-layer testing.
- [x] **Error Handling**: Centralized error handling middleware.
- [x] **Logging**: Structured logging with Winston and Morgan.
- [x] **Dockerize**: Ready to be containerized with Docker.
- [] **Database migrations**: Setup database with migrations.

## Getting Started

### 1. Installation

Install project dependencies.
```bash
npm install
```

### 2. Environment Setup

This project uses different `.env` files for different environments. The application will automatically load the correct file based on the script you run (`npm run dev` or `npm run start`).

#### For Development

Create a `.env.development` file by copying the example file. This will be used when you run `npm run dev`.

```bash
cp .example.env .env.development
```
Then, open `.env.development` and fill in your local database credentials.

#### For Production

Create a `.env.production` file. This will be used when you run `npm run start`.

```bash
cp .example.env .env.production
```
Then, open `.env.production` and fill in your production database credentials and a strong, unique `JWT_SECRET`.

## Local (without Docker)

### Run in Development Mode
This command starts the server with `nodemon`, which will automatically restart upon file changes.
```bash
npm run dev
```

### Run in Production Mode
This command starts the built server from `dist`. Build first if needed:
```bash
npm run build && npm run start
```

## Docker

This repo includes a multi-stage Dockerfile (targets: `dev`, `prod`) and two Compose files for development and production.

### Development (hot reload with bind mount)
- Start (loads variables from .env.development into Compose):
```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```
- Run tests inside the dev container:
```bash
docker compose -f docker-compose.dev.yml exec backend-express npm test
```
- Stop:
```bash
docker compose -f docker-compose.dev.yml down
# reset volumes (drop DB data)
docker compose -f docker-compose.dev.yml down -v
```

Notes:
- Dev uses bind mount `./:/app` and `nodemon.json` with `legacyWatch` for stable file watching on macOS.
- DB host inside containers is `backend-express-db` (service name). Locally (non-Docker) use `localhost`.

### Production (optimized image)
- Build and start:
```bash
docker compose --env-file .env.production up --build -d
```
- Logs and stop:
```bash
docker compose logs -f backend-express
docker compose down

## API Documentation

Once the server is running, you can access the interactive API documentation via Swagger UI at:

[http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)