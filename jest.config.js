module.exports = {
  preset: 'ts-jest',
  transform: {
    '.*\\.(vue)$': '<rootDir>/dist/index.js',
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsConfig: require.resolve("./tsconfig.json"),
    }
  }
}
