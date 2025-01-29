import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  roots: ["<rootDir>/src"],
  //   transform: {
  //     "^.+.tsx?$": ["ts-jest", {}],
  //   }, // initialization of ts-jest: `pnpm dlx config -> ts-jest config:init`.
  //   extensionsToTreatAsEsm: [".ts"] // Suggested in the ESM section of Jest documentation.
};

export default config;
