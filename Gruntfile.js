const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { execSync } = require('child_process');
const args = require('minimist')(process.argv.slice(2));

const OUTPUT_DIR = './build';
const OUTPUT_FILE = './build/twinkle.js';

function isGitWorkDirClean() {
	try {
		execSync('git diff-index --quiet HEAD --');
		return true;
	} catch (e) {
		return false;
	}
}

function makeHeader() {
	// This header comment is accurate only if grunt build is run with a clean
	// working directory.
	let includeCommitHashInComment = isGitWorkDirClean() || console.warn('\x1b[31m%s\x1b[0m', // red
		'[WARN] Git working directory is not clean.');

	let header =
`/*  _______________________________________________________________________________	
 * |                                                                               |
 * |                     === WARNING: GLOBAL GADGET FILE ===                       |
 * |                   Changes to this page affect many users.                     |
 * |  Please discuss changes on the talk page or on [[WT:Gadget]] before editing.  |
 * |_______________________________________________________________________________|
 *
 * Built from source code at GitHub repository [https://github.com/#{USER_OR_ORG}#/#{REPO_NAME}#]
 * All changes should be made in the repository. Please do not attempt to edit this file directly.
`;
	if (includeCommitHashInComment) {
		const commitSHA = execSync('git rev-parse HEAD').toString().trim();
		header +=
` * This build was generated from the source files at the repository as of the commit
 * ${commitSHA}. You can browse the repo at that point in time using this link:
 * https://github.com/#{USER_OR_ORG}#/#{REPO_NAME}#/tree/${commitSHA}
 * Changes between two commits of Twinkle can be compared using
 * https://github.com/#{USER_OR_ORG}#/#{REPO_NAME}#/compare/COMMIT_HASH_1..COMMIT_HASH_2
`;
	}

	header +=
` */
/* <nowiki> */
`;
	return header;
}

const footer = `
/* </nowiki> */`;

module.exports = function (grunt) {
	grunt.initConfig({
		// Clean build directory first
		clean: [OUTPUT_DIR],

		webpack: {
			myConfig: {
				...require('./webpack.config'),
				devtool: undefined,
				devServer: undefined,
				mode: 'production',
				plugins: [
					// specify --excludeEnglishMessages to exclude English messages (about 20 kb) in build
					// Do this ONLY if you are sure all messages have been translated into your local language,
					// otherwise users will see message keys
					new webpack.DefinePlugin({
						EXCLUDE_ENGLISH_MESSAGES: Boolean(args.excludeEnglishMessages)
					})
				],
				optimization: {
					minimizer: [
						new TerserPlugin({
							extractComments: /@preserve/,
							terserOptions: { output: { ascii_only: true } }
						}),
					],
				},
				performance: {
					hints: false,
				},
			},
		},

		// Escape any nowiki tags in code so they don't break the on-wiki gadget file
		// There's no point in writing nowiki tags as "<no" + "wiki>" in source files
		// as Webpack's Terser plugin will optimise away the string concatenation giving
		// a functional nowiki tag. So we must do this *after* webpack minimisation.
		replace: {
			nowiki: {
				options: {
					patterns: [
						{
							match: /<nowiki>/g,
							replacement: '<no"+"wiki>',
						},
						{
							match: /<\/nowiki>/g,
							replacement: '</no"+"wiki>',
						},
					],
				},
				files: [
					{
						src: [OUTPUT_FILE],
						dest: OUTPUT_FILE,
					},
				],
			},
		},

		// Concatenate the header and footer comments
		concat: {
			options: {
				separator: '\n',
				banner: makeHeader(),
				footer: footer,
				stripBanners: {
					block: true,
				},
			},
			dist: {
				src: [OUTPUT_FILE],
				dest: OUTPUT_FILE,
			},
		},

		// Copy other files to build directory (which don't need to be compiled)
		copy: {
			main: {
				files: [
					{ src: './node_modules/twinkle-core/morebits/morebits.js', dest: 'build/morebits.js' },
					{ src: './node_modules/twinkle-core/morebits/morebits.css', dest: 'build/morebits.css' },
					{ src: './css/twinkle.css', dest: 'build/twinkle.css' },
					{ src: './css/twinkle-pagestyles.css', dest: 'build/twinkle-pagestyles.css' },
				],
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('build', ['clean', 'webpack', 'replace', 'concat', 'copy']);
};
