import path from "node:path";

export type SpecmaticConfig = {
  contracts: {
    filesystem: {
      directory: string;
    };
    provides?: `${string}.yaml`[];
    consumes?: `${string}.yaml`[];
  }[];
};

export const getSpecmaticConfig = async (): Promise<SpecmaticConfig> => {
  return (
    await import(path.join(process.cwd(), `specmatic.json`), {
      with: { type: "json" },
    })
  ).default;
};

export const getProvidersAndConsumers = async ({
  config,
}: {
  config: SpecmaticConfig;
}) => {
  const providers: string[] = [];
  const consumers: string[] = [];
  for (const contract of config.contracts) {
    if (contract.provides)
      providers.push(
        ...contract.provides.map((p) =>
          path.join(contract.filesystem.directory, p)
        )
      );
    if (contract.consumes)
      consumers.push(
        ...contract.consumes.map((c) =>
          path.join(contract.filesystem.directory, c)
        )
      );
  }

  return [providers, consumers] satisfies [string[], string[]];
};
