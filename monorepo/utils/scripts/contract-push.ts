#!/usr/bin/env node

import path from "node:path";
import { cp, mkdir, rm, stat, glob } from "node:fs/promises";

import {
  getProvidersAndConsumers,
  getSpecmaticConfig,
} from "../lib/specmatic.ts";
import { defineConfig, type Config } from "../lib/config.ts";

/**
 * We remove the old contracts from the repository to ensure that we don't have
 * old specs and examples lying around.
 */
const prepare = async ({ config }: { config: Config }) => {
  const repoPath = path.join(config.repositoryDir, config.appName);
  if (await stat(repoPath).catch(() => false))
    await rm(repoPath, { recursive: true });
  await mkdir(repoPath, { recursive: true });
};

/**
 * We push app contracts consisting of a spec and (optional) examples so that
 * other services can pull the spec to use it to start a stub server.
 */
const pushAppContracts = async ({
  config,
  log,
  providers,
}: {
  config: Config;
  log: (text: string) => void;
  providers: string[];
}) => {
  const repoPath = path.join(config.repositoryDir, config.appName);
  if (providers.length) log("Push app contracts and examples...");

  for (const provider of providers) {
    // Specs
    const providerFileName = path.basename(provider);
    const providerName = providerFileName.replace(".yaml", "");
    await cp(provider, path.join(repoPath, providerFileName));

    // Examples
    const providerExamples = path.join(
      config.contractDir,
      `${providerName}_examples`
    );
    const jsonFiles = await glob("*.json", { cwd: providerExamples });
    const destExamplesDir = path.join(repoPath, `${providerName}_examples`);
    await mkdir(destExamplesDir, { recursive: true });

    for await (const jsonFile of jsonFiles) {
      await cp(
        path.join(providerExamples, jsonFile),
        path.join(destExamplesDir, jsonFile)
      );
    }

    log(`✅ Pushed "${provider}"`);
  }
};

/**
 * We push examples for dependencies so they can validate their spec against all
 * examples from dependent services.
 */
const pushDependencyExamples = async ({
  config,
  consumers,
  log,
}: {
  config: Config;
  consumers: string[];
  log: (text: string) => void;
}) => {
  const repoPath = path.join(config.repositoryDir, config.appName);
  if (consumers.length) log("Push dependency examples...");

  for (const consumer of consumers) {
    const consumerFileName = path.basename(consumer);
    const consumerName = consumerFileName.replace(".yaml", "");
    const consumerExamples = path.join(
      config.contractDir,
      config.contractDependenciesFolder,
      `${consumerName}_examples`
    );
    const jsonFiles = await glob("*.json", { cwd: consumerExamples });
    const destExamplesDir = path.join(
      repoPath,
      config.contractDependenciesFolder,
      `${consumerName}_examples`
    );
    await mkdir(destExamplesDir, { recursive: true });

    for await (const jsonFile of jsonFiles) {
      await cp(
        path.join(consumerExamples, jsonFile),
        path.join(destExamplesDir, jsonFile)
      );
    }
    log(`✅ Pushed "${consumer}"`);
  }
};

const main = async () => {
  const output: string[][] = [];
  const config = defineConfig();
  const specmaticConfig = await getSpecmaticConfig();
  const [providers, consumers] = await getProvidersAndConsumers({
    config: specmaticConfig,
  });

  await prepare({ config });

  const outputGroupPushAppContracts: string[] = [];
  output.push(outputGroupPushAppContracts);
  await pushAppContracts({
    config,
    log: (s) => outputGroupPushAppContracts.push(s),
    providers,
  });

  const outputGroupPushDependencyExamples: string[] = [];
  output.push(outputGroupPushDependencyExamples);
  await pushDependencyExamples({
    config,
    log: (s) => outputGroupPushDependencyExamples.push(s),
    consumers,
  });

  console.log(
    output
      .filter((x) => x.length > 0)
      .map((x) => x.join("\n"))
      .join("\n")
  );
};

await main();
