import type { Config } from "jest";

const config: Config = {
  testMatch: ["<rootDir>/src/__test__/**/*.test.ts"],
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "ts", "node", "json"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
};

export default config;
