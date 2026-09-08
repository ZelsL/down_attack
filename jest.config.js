export default {
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "^~~?/(.*)$": "<rootDir>/$1",
    "^@@?/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["<rootDir>/tests/setup.cjs"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testTimeout: 60000,
};
