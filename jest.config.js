/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: false,
  modulePathIgnorePatterns: ['dist'],
  preset: 'ts-jest',
  restoreMocks: true,
  setupFiles: [`./jest.setup.js`],
  testEnvironment: 'node',
  testTimeout: 20000,
};
