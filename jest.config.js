module.exports = {
  // Define el entorno de prueba
  testEnvironment: 'node',

  // Configuración de cobertura de código
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}', // Ajusta los patrones de los archivos a incluir para la cobertura
    '!src/**/*.test.js', // Excluye los archivos de prueba de la cobertura
    '!src/config/**', // Excluye archivos de configuración
  ],

  // Configuración de los módulos
  moduleFileExtensions: ['js', 'json', 'node'],

  // Configuración de los transformadores de archivos
  transform: {
    '^.+\\.js$': 'babel-jest', // Usa babel-jest para transformar archivos JS
  },

  // Configuración de las pruebas
  testMatch: [
    '**/test/**/*.test.js', // Ruta donde se encuentran los archivos de prueba
  ],

  // Configuración de los informes
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }], // Genera resultados de prueba en formato JUnit
  ],

  // Configuración adicional
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'], // Archivo para configuración de pruebas (como mocks globales)
  globalSetup: '<rootDir>/test/globalSetup.js', // Configuración global antes de ejecutar las pruebas
  globalTeardown: '<rootDir>/test/globalTeardown.js', // Configuración global después de ejecutar las pruebas
};
