/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: false,
  preset: 'ts-jest',
  restoreMocks: true,
  setupFiles: [`./jest.setup.js`],
  testEnvironment: 'node',
  testTimeout: 20000,
};
