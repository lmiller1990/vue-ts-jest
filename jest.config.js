module.exports = {
  preset: 'ts-jest',
  transform: {
    '.*\\.(vue)$': '<rootDir>/dist/index.js',
  },
};
