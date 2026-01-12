export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: 'tsconfig.jest.json'
        }]
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^.*/env$': '<rootDir>/test/__mocks__/env.ts',
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
}
