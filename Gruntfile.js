const OUTPUT_DIR = './build';
const OUTPUT_FILE = './build/twinkle.js';

const header = `/*  _______________________________________________________________________________
 * |                                                                               |
 * |                     === WARNING: GLOBAL GADGET FILE ===                       |
 * |                   Changes to this page affect many users.                     |
 * |  Please discuss changes on the talk page or on [[WT:Gadget]] before editing.  |
 * |_______________________________________________________________________________|
 *
 * Built from source code at GitHub repository [https://github.com/wikimedia-gadgets/twinkle-enwiki]
 * All changes should be made in the repository. Please do not attempt to edit this file directly.
 * The latest edit summary on this page includes the commit hash of the repository from which
 * the build was generated. You can browse the repo at that point in time using this link:
 * https://github.com/wikimedia-gadgets/twinkle-enwiki/tree/<COMMIT_HASH> after replacing the 
 * placeholder at the end.  
 */
/* <nowiki> */
`;

const footer = `
/* </nowiki> */`;

module.exports = function (grunt) {
	grunt.initConfig({
		// Clean build directory first
		clean: [OUTPUT_DIR],

		webpack: {
			myConfig: require('./webpack.prod.config.js'),
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
				banner: header,
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
					{ src: '../twinkle-core/morebits/morebits.js', dest: 'build/morebits.js' },
					{ src: '../twinkle-core/morebits/morebits.css', dest: 'build/morebits.css' },
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
