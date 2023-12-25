const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  coverageReporters: ['json'],
  collectCoverageFrom: ['src/**/*.ts'],
};
