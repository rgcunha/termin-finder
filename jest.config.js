module.exports = {
  clearMocks: true,
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["jest-extended"],
  setupFiles: ["<rootDir>/test/setup.ts"],
  testEnvironment: "node",
  verbose: true,
  coverageThreshold: {
    global: {
      lines: 95,
    },
  },
};
