const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: './src/twinkle.ts',
	target: ['web', 'es5'],
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true
				}
			},
		],
	},
	resolve: {
		extensions: [ '.ts' ],
	},
	output: {
		filename: 'twinkle.js',
		path: path.resolve(__dirname, 'build')
	},
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		port: 5500
	}
};
