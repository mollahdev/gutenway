/**
 * compile es6 and gutenberg to vanilla js
 * @module webpack.config.js
 *
 * @copyright Gutenway
 * @package Gutenway WordPress Plugin
 * @author ashraf<mollah.dev@gmail.com>
 */

const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		blocks: './src/blocks.js',
		admin: './src/admin.js',
		dashboard: './src/dashboard.js',
	},
	output: {
		path: path.resolve( __dirname, 'build/' ),
		filename: '[name].js',
		clean: false,
	},
	resolve: {
		alias: {
			'@': path.resolve( __dirname, './src' ),
			'@blocks': path.resolve( __dirname, './blocks' ),
		},
		extensions: [
			'.ts',
			'.tsx',
			...( defaultConfig.resolve
				? defaultConfig.resolve.extensions || [ '.js', '.jsx' ]
				: [] ),
		],
	},
};
