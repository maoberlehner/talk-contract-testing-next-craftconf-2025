#!/usr/bin/env node

import path from "node:path";
import { cp, glob, mkdir, rm, stat } from "node:fs/promises";

import {
  getProvidersAndConsumers,
  getSpecmaticConfig,
} from "../lib/specmatic.ts";
import { defineConfig, type Config } from "../lib/config.ts";

/**
 * We remove all examples from dependent services to ensure that we don't have
 * old examples lying around.
 */
const prepare = async ({ config }: { config: Config }) => {
  if (await stat(config.dependentExamplesDir).catch(() => false))
    await rm(config.dependentExamplesDir, { recursive: true });
  await mkdir(config.dependentExamplesDir, { recursive: true });
};

/**
 * We pull the examples from dependent services so we can validate that the
 * latest version of our spec does not break any contracts with those services.
 */
const pullExamplesFromDependentServices = async ({
  config,
  log,
}: {
  config: Config;
  log: (text: string) => void;
}) => {
  const examplesDirs = await Array.fromAsync(
    glob(
      path.join(
        config.repositoryDir,
        "**",
        config.contractDependenciesFolder,
        `${config.appName}_examples`
      )
    )
  );

  if (examplesDirs.length) log("Pull examples from dependent services...");

  for (const examplesDir of examplesDirs) {
    const dependentName = examplesDir
      .replace(config.repositoryDir, "")
      .split(path.sep)
      .filter(Boolean)[0];
    if (!dependentName)
      throw new Error("Could not determine dependent service name!");

    await cp(
      examplesDir,
      path.join(config.dependentExamplesDir, dependentName),
      {
        recursive: true,
      }
    );

    log(`✅ Pulled "${examplesDir}"`);
  }
};

/**
 * We pull all the specs of services we depend on so we can use those specs to
 * run a stub server for testing.
 */
const pullDependencySpecs = async ({
  config,
  consumers,
  log,
}: {
  config: Config;
  consumers: string[];
  log: (text: string) => void;
}) => {
  if (consumers.length) log("Pull dependency specs...");

  for (const consumer of consumers) {
    const consumerFileName = path.basename(consumer);
    const consumerName = consumerFileName.replace(".yaml", "");
    const repoConsumerFileName = path.join(
      config.repositoryDir,
      consumerName,
      consumerFileName
    );
    await cp(
      repoConsumerFileName,
      path.join(
        config.contractDir,
        config.contractDependenciesFolder,
        consumerFileName
      )
    );
    log(`✅ Pulled "${repoConsumerFileName}"`);
  }
};

const main = async () => {
  const output: string[][] = [];
  const config = defineConfig();
  const specmaticConfig = await getSpecmaticConfig();
  const [_, consumers] = await getProvidersAndConsumers({
    config: specmaticConfig,
  });

  await prepare({ config });

  const outputGroupPullExamplesFromDependentServices: string[] = [];
  output.push(outputGroupPullExamplesFromDependentServices);
  await pullExamplesFromDependentServices({
    config,
    log: (s) => outputGroupPullExamplesFromDependentServices.push(s),
  });

  const outputGroupPullDependencySpecs: string[] = [];
  output.push(outputGroupPullDependencySpecs);
  await pullDependencySpecs({
    config,
    consumers,
    log: (s) => outputGroupPullDependencySpecs.push(s),
  });

  console.log(
    output
      .filter((x) => x.length > 0)
      .map((x) => x.join("\n"))
      .join("\n")
  );
};

await main();
