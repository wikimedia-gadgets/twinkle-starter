const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const corePath = args.core || './node_modules/twinkle-core';

let fileCache = {};

// For the css files and twinkle-core files, don't read from file system on
// every page load. Rather load them just once, if they change the server
// needs to be restarted for the changes to take effect. Use --nocache argument
// to actually cause the files to be read from filesystem every time - this may
// slow down things. This is not applicable for the typescript sources which
// are always refreshed on every code change.
function readFile(file) {
	if (fileCache[file] && !args.nocache) {
		return fileCache[file];
	}
	return (fileCache[file] = fs.readFileSync(file).toString());
}

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
					transpileOnly: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts'],
	},
	output: {
		filename: 'twinkle.js',
		path: path.resolve(__dirname, 'build'),
	},
	devServer: {
		before: function (app, server, compiler) {
			app.get('/core/*', function (req, response) {
				let path = req.url.slice('/core'.length);
				let ctype = req.url.endsWith('.js')
					? 'text/javascript'
					: req.url.endsWith('.css')
					? 'text/css'
					: 'text/plain';
				response.writeHead(200, { 'Content-Type': `${ctype}; charset=utf-8` });
				response.end(readFile(corePath + path), 'utf-8');
			});
			app.get('/css', function (req, response) {
				response.writeHead(200, { 'Content-Type': `text/css; charset=utf-8` });
				response.end(readFile('./css/twinkle.css'), 'utf-8');
			});
			app.get('/', function (req, response) {
				response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
				response.end(readFile('./dev-loader.js'), 'utf-8');
			});
		},
		contentBase: path.join(__dirname, 'build'),
		port: 5500,
	},
};
