# app

> IMPORTANT: Make sure to use Node >= 23!
> Otherwise you'll get an `ERR_UNKNOWN_FILE_EXTENSION` error.

## Application Testing

```bash
# 0. Build Specmatic image (only once)
(cd ../utils && docker build -t shopping-list-monorepo-specmatic . -f Dockerfile.specmatic)

# 1. Pull latest contracts
npm run contract:pull

# 2. Run tests
# a) in dev-mode:
docker compose up specmatic
SERVICE_GATEWAY_URL=http://localhost:3010 npm run dev
npm run test # or npm run test:ui
# b) in production-mode:
docker build -t shopping-list-monorepo-app
docker compose up
npm run test # or npm run test:ui
```

## Working with Contracts

```bash
# Pull contracts with dependencies
npm run contract:pull

# Push the contract
npm run contract:push

# Generate the TypeScript schema for contracts with dependencies
npm run contract:schema

# Validate the contract
npm run contract:validate
```
