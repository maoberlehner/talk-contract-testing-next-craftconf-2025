#!/usr/bin/env node

import path from "node:path";
import { program } from "commander";

import { exec } from "../lib/exec.ts";
import { glob } from "node:fs/promises";
import { defineConfig, type Config } from "../lib/config.ts";

const SPECMATIC_CMD = "shopping-list-monorepo-specmatic";

program
  .name("contract-test")
  .option("-p, --app-port <port>")
  .option("--app-health-endpoint <endpoint>");
program.parse();

const buildApp = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  log("Build the app...");
  await exec(`docker build -t ${config.appName} .`);
  log("✅ Build succeeded!");
};

const seedApp = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  const seedFiles = await Array.fromAsync(
    glob(path.join(config.contractDir, "*_examples", config.seedFileGlob))
  );
  if (seedFiles.length) log("Seed the app...");

  for (const file of seedFiles) {
    await exec(file);
    log(`✅ Seed: ${file}`);
  }
};

const startApp = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  const dockerComposeProjectName = `${config.projectName}-${config.appName}`;
  const healthEndpoint = `http://localhost:8080${
    config.appHealthEndpoint || "/health"
  }`;

  log("Start the app...");
  await exec(
    `APP_PORT=${config.appPort} APP_IMAGE=${config.appName} APP_HEALTH_ENDPOINT=${healthEndpoint} SPECMATIC_IMAGE=${SPECMATIC_CMD} docker compose --project-directory . -f ../utils/docker-compose.yaml -p ${dockerComposeProjectName} up -d --wait`
  );
  log("✅ App started!");
};

const stopApp = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  const dockerComposeProjectName = `${config.projectName}-${config.appName}`;

  log("Teardown...");
  await exec(
    `APP_IMAGE=${config.appName} SPECMATIC_IMAGE=${SPECMATIC_CMD} docker compose --project-directory . -f ../utils/docker-compose.yaml -p ${dockerComposeProjectName} stop`
  );
  log("✅ App stopped!");
};

const runTests = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  log("Test app contract...");
  await exec(
    `docker run --rm -v \${PWD}/:/app ${SPECMATIC_CMD} test --testBaseURL="http://host.docker.internal:${config.appPort}"`
  );
  log("✅ App contract is valid!");
};

const main = async () => {
  const options = program.opts();
  const config = defineConfig({
    appPort: options.appPort,
    appHealthEndpoint: options.appHealthEndpoint,
  });

  let finalError: Error | undefined;

  try {
    console.log("");
    await buildApp({ config, log: console.log });
    console.log("");
    await startApp({ config, log: console.log });
    console.log("");
    await seedApp({ config, log: console.log });
    console.log("");
    await runTests({ config, log: console.log });
    console.log("");
  } catch (error) {
    finalError = error instanceof Error ? error : new Error(String(error));
  } finally {
    await stopApp({ config, log: console.log });
    if (finalError) throw finalError;
  }
};

await main();
