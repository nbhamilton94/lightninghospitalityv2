const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    moduleNameMapper: {
        '^@salesforce/apex/(.*)$': '<rootDir>/force-app/main/default/lwc/__mocks__/$1',
        '^lightning/navigation$': '<rootDir>/force-app/test/jest-mocks/lightning/navigation'
    }
    
};
