import path from "node:path";

const DEFAULT_APP_NAME = path.basename(process.cwd());
const DEFAULT_APP_PORT = 8080;
const DEFAULT_APP_HEALTH_ENDPOINT = undefined;
const DEFAULT_PROJECT_NAME = "contract-testing-project";
const DEFAULT_CONTRACT_DIR = path.join(".", "contract");
const DEFAULT_CONTRACT_DEPENDENCIES_FOLDER = "dependencies";
const DEFAULT_DEPENDENT_EXAMPLES_DIR = path.join(
  DEFAULT_CONTRACT_DIR,
  ".dependent-examples"
);
const DEFAULT_REPOSITORY_DIR = path.join("..", "__contract-repository__");
const DEFAULT_SEED_FILE_GLOB = "*.seed*";

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

export type Config = {
  appName: string;
  appPort: number;
  appHealthEndpoint?: string;
  projectName: string;
  contractDir: string;
  contractDependenciesFolder: string;
  dependentExamplesDir: string;
  repositoryDir: string;
  seedFileGlob: string;
};

export type ConfigPartial = RecursivePartial<Config>;

export const defineConfig = (config?: ConfigPartial) => {
  const configWithDefaults = {
    appName: config?.appName || DEFAULT_APP_NAME,
    appPort: config?.appPort || DEFAULT_APP_PORT,
    appHealthEndpoint: config?.appHealthEndpoint || DEFAULT_APP_HEALTH_ENDPOINT,
    projectName: config?.projectName || DEFAULT_PROJECT_NAME,
    contractDir: config?.contractDir || DEFAULT_CONTRACT_DIR,
    contractDependenciesFolder:
      config?.contractDependenciesFolder ||
      DEFAULT_CONTRACT_DEPENDENCIES_FOLDER,
    dependentExamplesDir:
      config?.dependentExamplesDir || DEFAULT_DEPENDENT_EXAMPLES_DIR,
    repositoryDir: config?.repositoryDir || DEFAULT_REPOSITORY_DIR,
    seedFileGlob: config?.seedFileGlob || DEFAULT_SEED_FILE_GLOB,
  } satisfies Config;

  return configWithDefaults;
};
