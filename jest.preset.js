const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['json'],
  collectCoverageFrom: ['src/**/*.ts'],
};
