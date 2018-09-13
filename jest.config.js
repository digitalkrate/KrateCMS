const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/tests/**/*.test.(ts|js)'
	],
	testEnvironment: 'node',
	moduleNameMapper
};
