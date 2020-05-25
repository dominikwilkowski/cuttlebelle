/***************************************************************************************************************************************************************
 *
 * Parsing different languages
 *
 * ParseContent - Parsing the content of a file into an object
 * ParseMD      - Parsing markdown into HTML
 * ParseYaml    - Parsing yaml into an object
 * ParseHTML    - Clean react output of any silly wrapping divs
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Fs from 'fs';
import Remark from 'remark';
import HTML from 'remark-html';
import visit from 'unist-util-visit';
import is from 'unist-util-is';
import YAML from 'js-yaml';
import React from 'react';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style, Slug } from './helper';
import { SETTINGS } from './settings';
import { Path } from './path';


/**
 * Parsing the content of a file into an object
 *
 * @param  {string} content - The content of a partial with or without front matter
 * @param  {string} file    - The path of the file to determine what extension this is, optional, default: 'partial.md'
 * @param  {string} props   - An object of all props being passed to the markdown renderer, optional
 *
 * @return {object}         - An object with parsed out front matter and it’s parsed yaml and the body. format: { frontmatter: {}, body: '' }
 */
export const ParseContent = ( content, file = 'partial.md', props = {} ) => {
	Log.verbose(`Parsing content for ${ Style.yellow( file ) }`);

	if( typeof content === 'string' ) {
		const _isIndex = Path.extname( file ) === '.yml';
		const parsedBody = {};
		let frontmatter = '';
		let markdown = '';

		if( _isIndex ) {                         // if this is a yml file
			parsedBody.frontmatter = ParseYaml( content, file );
			parsedBody.body = '';
		}
		else if( /^---(?:\r\n|\r|\n)/.test( content ) ) { // if this is another file that has frontmatter
			const bodyParts = content.split(/---(?:\r\n|\r|\n)/);

			parsedBody.frontmatter = bodyParts[1] ? ParseYaml( bodyParts[1], file ) : {};
			parsedBody.body = ParseMD( bodyParts.slice( 2 ).join('---\n'), file, props );
		}
		else {                                   // in all other cases (markdown without frontmatter)
			parsedBody.frontmatter = {};
			parsedBody.body = ParseMD( content, file, props );
		}

		return parsedBody;
	}
	else {
		return content;
	}
}


/**
 * Parsing markdown into HTML using https://github.com/chjj/marked
 *
 * @param  {string} markdown - The markdown string
 * @param  {string} file     - The file where this markdown comes from for error handling
 * @param  {string} props    - An object of all props for the custom renderer
 *
 * @return {string}          - HTML rendered from the given markdown
 */
export const ParseMD = ( markdown, file, props ) => {
	if( typeof markdown === 'string' ) {
		const mdSettings = SETTINGS.get().site.markdown;

		const md = new Remark()
			.use( HTML );

		// Add IDs to headings
		if( mdSettings.headingIds === true ) {
			md.use(
				() => ( tree ) => {
					visit( tree, 'heading', node => {
						if( !node.children || node.children.length < 1 ) {
							return;
						}

						let text = [];
						node.children.forEach( child => {
							if( is( child, 'text' ) ) {
								text.push( child.value );
							}
						} );

						let data = node.data || ( node.data = {} );
						let hProperties = data.hProperties || ( data.hProperties = {} );
						let id = hProperties.id;

						if( id ) {
							data.id = id;
							return;
						}

						if( !text ) {
							return;
						}

						id = Slug( text.join(' ') );
						data.id = id;
						hProperties.id = id;
					} );
				}
			);
		}

		let plugins = mdSettings.plugins;
		if( plugins ) {
			if( typeof plugins === 'string' ) {
				plugins = [ plugins ];
			}

			if( Array.isArray( plugins ) && plugins.length > 0 ) {
				plugins.forEach( plugin => {
					// First check the path
					let pluginPath = Path.normalize( `${ process.cwd() }/${ plugin }` );

					if( !Fs.existsSync( pluginPath ) ) {
						// Null the path as it was not found
						pluginPath = null;
					}

					// Only continue if there is a plugin file found, fail silently
					if( pluginPath ) {
						try {
							// Require the plugin so that we can inspect it
							const pluginRequire = require(pluginPath);
							if( pluginRequire ) {
								if( typeof pluginRequire === 'function' ) {
									// Looks like a custom plugin, provide props to it
									// If it's a simple NPM plugin, passing props shouldn't hurt
									md.use(pluginRequire, props);
								}
								else if( Array.isArray(pluginRequire) && pluginRequire[0] && typeof pluginRequire[0] === 'function' ) {
									// It's an array, and so is an NPM plugin with options provided
									// Add the plugin using the handy `use(array)`` feature of Remark
									md.use([pluginRequire]);
								}
							}
						}
						catch( error ) {
							// Fail loudly if the plugin won't load properly
							Log.error(`Using the plugin for markdown caused an error at ${ Style.yellow( pluginPath ) }`);
							Log.error( error );

							if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
								process.exit( 1 );
							}
						}
					}
				} );
			}
		}

		let processed;
		md.process( markdown, ( error, result ) => {
			if( error ) {
				Log.error(`Rendering markdown caused an error in ${ Style.yellow( file ) }`);
				Log.error( String( error ) );

				if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
					process.exit( 1 );
				}
				return;
			}

			processed = String( result );
		} );

		return processed;
	}
	else {
		return markdown;
	}
}


/**
 * Parsing yaml into an object using https://github.com/jeremyfa/yaml.js
 *
 * @param  {string} yaml - A yaml string
 * @param  {string} file - The file where this yaml comes from for error handling
 *
 * @return {object}      - The parsed yaml
 */
export const ParseYaml = ( yaml, file ) => {
	if( typeof yaml === 'string' ) {
		try {
			return YAML.safeLoad( yaml, warning => Log.error( warning ) ) || {};
		}
		catch( error ) {
			Log.error(`Rendering yaml caused an error in ${ Style.yellow( file ) }`);
			Log.error( error );

			if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
				process.exit( 1 );
			}
		}
	}
	else {
		return yaml;
	}
}


/**
 * Clean react output of any silly wrapping divs
 *
 * @param  {string} html - The HTML generated with react
 *
 * @return {string}      - The cleaned HTML
 */
export const ParseHTML = ( html ) => {
	if( typeof html === 'string' ) {
		return html
			.replace(/<cuttlebellesillywrapper>/g, '')
			.replace(/<\/cuttlebellesillywrapper>/g, '');
	}
	else {
		return html;
	}
}
