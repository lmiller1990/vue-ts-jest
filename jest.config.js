module.exports = {
  preset: 'ts-jest',
  transform: {
    '.*\\.(vue)$': '<rootDir>/dist/index.js',
  },
  globals: {
    "ts-jest": {
      isolatedModules: false,
      tsConfig: require.resolve("./tsconfig.json"),
    }
  }
}
