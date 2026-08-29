import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

// This module is authored as ESM (package.json "type": "module"), so treat the
// .js source files as ES modules rather than the preset's CommonJS default.
export default [
	...(await generateEslintConfig({})),
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'module',
		},
	},
]
