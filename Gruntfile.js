/**
 * ----------------------------------------
 * @description grunt setup (main wrapper)
 * ----------------------------------------
 */
module.exports = ( grunt ) => {
	'use strict';

	const projectConfig = {
		name: 'gutenway', // should be the text domain of the project (todo: spilt it)
		srcDir: './', // the source directory of the plugin
		distDir: `../dist/gutenway/`,
		version: '1.0.0', // where to save the built file
	};

	grunt.initConfig( {
		// clean dist directory file
		clean: {
			options: { force: true },
			dist: [
				projectConfig.distDir + '/**',
				projectConfig.distDir.replace( /\/$/, '' ) + '.zip',
			],
		},

		// Copying project files to ../dist/ directory
		copy: {
			dist: {
				files: [
					{
						expand: true,
						src: [
							'' + projectConfig.srcDir + '**',
							'!' + projectConfig.srcDir + 'Gruntfile.js',
							'!' + projectConfig.srcDir + 'scripts/**',
							'!' + projectConfig.srcDir + 'package.json',
							'!' + projectConfig.srcDir + 'package-lock.json',
							'!' + projectConfig.srcDir + 'node_modules/**',
							'!' + projectConfig.srcDir + '**/dev-*/**',
							'!' + projectConfig.srcDir + '**/*-test/**',
							'!' + projectConfig.srcDir + '**/*-beta/**',
							'!' + projectConfig.srcDir + '**/scss/**',
							'!' + projectConfig.srcDir + '**/sass/**',
							'!' + projectConfig.srcDir + '**/src/**',
							'!' + projectConfig.srcDir + '**/.*',
							'!' + projectConfig.srcDir + '**/build/*.txt',
							'!' + projectConfig.srcDir + '**/*.map',
							'!' + projectConfig.srcDir + '**/*.config',
							'!' + projectConfig.srcDir + 'tsconfig.json',
							'!' + projectConfig.srcDir + 'build-package/**',
							'!' + projectConfig.srcDir + 'none',
							'!' + projectConfig.srcDir + 'Installable',
							'!' + projectConfig.srcDir + 'mix-manifest.json',
							'!' + projectConfig.srcDir + 'postcss.config.js',
							'!' + projectConfig.srcDir + 'README.md',
							'!' + projectConfig.srcDir + 'readme.md',
							'!' + projectConfig.srcDir + 'tailwind.config.js',
							'!' + projectConfig.srcDir + 'webpack.mix.js',
							'!' + projectConfig.srcDir + 'webpack.config.js',
						],
						dest: projectConfig.distDir,
					},
				],
			},
		},

		// Compress Build Files into ${project}.zip
		compress: {
			dist: {
				options: {
					force: true,
					mode: 'zip',
					archive:
						projectConfig.distDir.replace(
							projectConfig.name,
							''
						) +
						projectConfig.name +
						'-' +
						projectConfig.version +
						'.zip',
				},
				expand: true,
				cwd: projectConfig.distDir,
				src: [ '**' ],
				dest: '../' + projectConfig.name,
			},
		},

		// generate pot file
		makepot: {
			target: {
				options: {
					cwd: projectConfig.srcDir,
					domainPath: '/languages',
					potHeaders: {
						poedit: true, // Includes common Poedit headers.
						'x-poedit-keywordslist': true, // Include a list of all possible gettext functions.
					}, // Headers to add to the generated POT file.
					type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
					updateTimestamp: true, // Whether the POT-Creation-Date should be updated without other changes.
					updatePoFiles: true, // Whether to update PO files in the same directory as the POT file.
				},
			},
		},
		// fix textdomain
		addtextdomain: {
			target: {
				options: {
					textdomain: projectConfig.name, // Project text domain.
					updateDomains: true,
				},
				files: {
					src: [
						'*.php',
						'**/*.php',
						'!node_modules/**',
						'!tests/**',
					],
				},
			},
		},

		checktextdomain: {
			standard: {
				options: {
					text_domain: projectConfig.name,
					keywords: [
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d',
					],
				},
				files: [
					{
						src: [
							'*.php',
							'**/*.php',
							'!node_modules/**',
							'!tests/**',
						],
						expand: true,
					},
				],
			},
		},

		/**
		 * -------------------------------------
		 * @description print ASCII text
		 * @see https://fsymbols.com/generators/carty/
		 * -------------------------------------
		 */

		screen: {
			begin: `
	Premio Automatic Tool
	# Project   : ${ projectConfig.name }
	# Dist      : ${ projectConfig.distDir }
	# Version   : ${ projectConfig.version }`.cyan,
			textdomainchecking: `Checking textdomain [${ projectConfig.name }]`
				.cyan,
			textdomainfixing: `Fixing textdomain [${ projectConfig.name }]`
				.cyan,
			minifying: `Minifying js & css files.`.cyan,
			pot: `Generating pot file [languages/${ projectConfig.name }.pot]`
				.cyan,
			finish: `
╭─────────────────────────────────────────────────────────────────╮
│                                                                 │
│                      All tasks completed.                       │
│   Built files & Installable zip copied to the dist directory.   │
│                   ~ Gutenway Automatic Tool ~                   │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯
`.green,
		},
	} );

	/**
	 * ----------------------------------
	 * @description Register grunt tasks
	 * ----------------------------------
	 */
	require( 'load-grunt-tasks' )( grunt );
	grunt.registerMultiTask( 'screen', function () {
		grunt.log.writeln( this.data );
	} );
	grunt.registerTask( 'ctextdomain', [
		'screen:textdomainchecking',
		'checktextdomain',
	] );
	grunt.registerTask( 'ftextdomain', [
		'screen:textdomainfixing',
		'addtextdomain',
	] );
	grunt.registerTask( 'minify', [ 'cssmin' ] );
	grunt.registerTask( 'uglify', [ 'uglify' ] );
	grunt.registerTask( 'pot', [ 'ctextdomain', 'screen:pot', 'makepot' ] );
	grunt.registerTask( 'build', [
		'screen:begin',
		'pot',
		'clean',
		'copy',
		'compress',
		'screen:finish',
	] );
};