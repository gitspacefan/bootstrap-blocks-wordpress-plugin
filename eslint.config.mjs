import wordpress from '@wordpress/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig( [
	...wordpress.configs.recommended,
	globalIgnores( [
		'node_modules',
		'vendor',
		'build',
		'!.*.js',
		'release/',
	] ),
	{
		files: [ 'playwright/**/*.ts' ],
		rules: {
			'react-hooks/rules-of-hooks': 'off',
		},
	},
] );
