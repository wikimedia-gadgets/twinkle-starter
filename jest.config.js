const tsJestOptions = {
	'ts-jest': {
		diagnostics: {
			warnOnly: true,
		},
	},
};

module.exports = {
	projects: [
		{
			displayName: 'unit',
			testMatch: ['<rootDir>/tests/unit/*.test.[jt]s'],
			preset: 'ts-jest',
			testEnvironment: 'jsdom',
			setupFilesAfterEnv: ['mock-mediawiki', './tests/expect-setup.ts'],
			globals: {
				...tsJestOptions,
			},
		},
		{
			displayName: 'integration',
			testMatch: ['<rootDir>/tests/integration/*.test.[jt]s'],
			preset: 'jest-playwright-preset',
			transform: {
				'^.+\\.ts$': 'ts-jest',
			},
			setupFilesAfterEnv: ['./tests/expect-setup.ts'],
			testEnvironmentOptions: {
				'jest-playwright': {
					launchOptions: {
						headless: !process.env.DEBUG,
					},
					browsers: process.env.DEBUG ? ['chromium'] : ['chromium', 'firefox', 'webkit'],
				},
			},
			globals: {
				...tsJestOptions,
			},
		},
	],
};
