module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/client/src/$1',
      '^@shared/(.*)$': '<rootDir>/shared/$1',
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testMatch: ['**/test/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  };