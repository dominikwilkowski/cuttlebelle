/***************************************************************************************************************************************************************
 *
 * BUILD MAN PAGE
 *
 * Injecting the current version of cuttlebelle into our man page
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { spawnSync } = require( 'child_process' );
const PGK = require('../package.json');
const Chalk = require('chalk');
const Path = require('upath');
const Fs = require('fs');
const Remark = require('remark');
const Man = require('remark-man');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Generating man page
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const manOptions = {
	name: 'CUTTLEBELLE',
	version: PGK.version,
	manual: 'Cuttlebelle Help',
	section: 1
};

const md = new Remark().use( Man, manOptions );

md.process( Fs.readFileSync( Path.normalize(`${ __dirname }/man.md`) ), ( error, result ) => {
	if( error ) {
		console.log(`An error occured when building from: ${ Chalk.yellow('man.md') } inside: ${ Chalk.yellow( __dirname ) }`);
		console.error( Chalk.red( error.toString() ) );

		process.exit( 1 );
		return;
	}

	const manpage = String( result );
	const manfile = Path.normalize(`${ __dirname }/cuttlebelle.1`);

	Fs.writeFileSync( manfile, manpage, `utf-8`, ( error ) => {
		if( error ) {
			console.log(`An error occured when writing: ${ Chalk.yellow( manfile ) }`);
			console.error( Chalk.red( error ) );
			process.exit( 1 );
		}
		else {
			console.log( Chalk.green(`✔︎ man page successfully compiled\n`) );
			process.exit( 0 );
		}
	});
});
