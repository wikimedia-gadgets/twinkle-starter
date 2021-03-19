const OUTPUT_DIR = './build';
const OUTPUT_FILE = './build/bundle.js';

const header =
`/*  _______________________________________________________________________________
 * |                                                                               |
 * |                     === WARNING: GLOBAL GADGET FILE ===                       |
 * |                   Changes to this page affect many users.                     |
 * |  Please discuss changes on the talk page or on [[WT:Gadget]] before editing.  |
 * |_______________________________________________________________________________|
 *
 * Built from source code at GitHub repository [https://github.com/wikimedia-gadgets/twinkle-enwiki]
 * All changes should be made in the repository, otherwise they will be lost.
 */
/* <nowiki> */
`;

const footer = `
/* </nowiki> */`;

module.exports = function(grunt) {
	grunt.initConfig({

		// Clean build directory first
		clean: [ OUTPUT_DIR ],

		webpack: {
			myConfig: require('./webpack.prod.config.js')
		},

		// Escape any nowiki tags in code so they don't break the on-wiki gadget file
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /<nowiki>/g,
							replacement: '<no"+"wiki>'
						},
						{
							match: /<\/nowiki>/g,
							replacement: '</no"+"wiki>'
						}
					]
				},
				files: [
					{
						src: [ OUTPUT_FILE ],
						dest: OUTPUT_FILE
					}
				]
			}
		},

		// Concatenate the header and footer comments
		concat: {
			options: {
				separator: '\n',
				banner: header,
				footer: footer,
				stripBanners: {
					block: true
				}
			},
			dist: {
				src: [ OUTPUT_FILE ],
				dest: OUTPUT_FILE
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('build', ['clean', 'webpack', 'replace', 'concat']);

};
