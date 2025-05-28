#!/usr/bin/env node

import { glob } from "node:fs/promises";
import path from "node:path";

import { exec } from "../lib/exec.ts";
import { defineConfig, type Config } from "../lib/config.ts";

const SPECMATIC_CMD = "shopping-list-monorepo-specmatic";

/**
 * Validate that the examples of how the tested service uses other services
 * match the specifications of those services.
 */
const validateDependencies = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  log(`Validate dependency contracts...`);
  await exec(
    `docker run --rm -v \${PWD}/:/app ${SPECMATIC_CMD} examples validate --specs-dir "${path.join(
      config.contractDir,
      config.contractDependenciesFolder
    )}"`
  );
  log("✅ Dependency contracts are valid!");
};

/**
 * Validate that the examples of how other services use the tested service match
 * the specifications of the tested service.
 */
const validateDependents = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  log(`Test contracts with dependent services...`);
  const dependentServices = glob(path.join(config.dependentExamplesDir, "*"));
  for await (const dependentService of dependentServices) {
    await exec(
      `docker run --rm -v \${PWD}/:/app ${SPECMATIC_CMD} examples validate --spec-file "${path.join(
        config.contractDir,
        `${config.appName}.yaml`
      )}" --examples-dir "${dependentService}"`
    );
  }
  log("✅ Contracts with dependent services are valid!");
};

const main = async () => {
  const config = defineConfig();

  console.log("");
  await validateDependencies({ config, log: console.log });
  console.log("");
  await validateDependents({ config, log: console.log });
};

await main();
