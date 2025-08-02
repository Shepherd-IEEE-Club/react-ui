/** @type {import('jest').Config} */
export default {
    // preset: 'ts-jest/presets/default-esm',   // <- let ts-jest load its own preset
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    setupFiles: [
        '<rootDir>/jest.env.js',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,

            experimentalTLA: true,
            tsconfig: '<rootDir>/tsconfig.json',
        }],
    },

    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    verbose: true,
};
