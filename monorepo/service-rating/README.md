# service-rating

> IMPORTANT: Make sure to use Node >= 23!
> Otherwise you'll get an `ERR_UNKNOWN_FILE_EXTENSION` error.

## Contract Testing

```bash
# 0. Build Specmatic image (only once)
(cd ../utils && docker build -t shopping-list-monorepo-specmatic . -f Dockerfile.specmatic)

# 1. Run contract tests
npm run contract:test
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
