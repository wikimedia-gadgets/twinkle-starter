const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const args = require('minimist')(process.argv.slice(2));

module.exports = {
	mode: 'production',
	entry: './src/twinkle.ts',
	target: ['web', 'es5'],
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts'],
	},
	plugins: [
		// specify --excludeEnglishMessages to exclude English messages (about 20 kb) in build
		// Do this ONLY if you are sure all messages have been translated into your local language,
		// otherwise users will see message keys
		new webpack.DefinePlugin({
			EXCLUDE_ENGLISH_MESSAGES: Boolean(args.excludeEnglishMessages)
		})
	],
	output: {
		filename: 'twinkle.js',
		path: path.resolve(__dirname, 'build'),
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: /@preserve/,
			}),
		],
	},
	performance: {
		hints: false,
	},
};
