export default {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/**/*.routes.js'],
  clearMocks: true,
  verbose: true,
};
