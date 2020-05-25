const visit = require( 'unist-util-visit' );

const attacher = ({
	_ID = null,          // The ID of the current page
	_self = null,        // The relative path to the content file; can be md or yaml file
	_isDocs = false,     // A boolean value, true in docs context only
	_parents = null,     // An array of all parent pages IDs
	_pages = null,       // An object of all pages and their props; with ID as key
	_storeSet = null,    // The store setter
	_store = null,       // The store getter
	_nav = null,         // A nested object of your site structure
	_relativeURL = null, // A helper function to make an absolute URL relative
	_parseYaml = null,   // The YAML parsing function
	_parseReact = null,  // A function that parses React to static markup
	_globalProp = null   // A prop that can be set globally from the `package.json`
} = {}) => {
	const transformer = ( tree, _file ) => {
		const headingLevels = {
			1: 'display-1',
			2: 'display-2',
			3: 'display-3',
			4: 'display-4',
			5: 'display-5',
			6: 'display-6',
		};

		// Remove IDs from headings - this should really be done via the setting
		visit( tree, 'heading', node => {
			let data = node.data || ( node.data = {} );
			if( node.data.id ) {
				delete node.data.id;
			}
			let hProperties = data.hProperties || ( data.hProperties = {} );
			if( hProperties && hProperties.id ) {
				delete node.data.hProperties.id;
			}
		} );

		// Then selectively change them where required
		visit( tree, 'linkReference', ( node, _index, parent ) => {
			if( !parent.type || parent.type !== 'heading' ) {
				return;
			}

			if( node !== parent.children[0] ) {
				return;
			}

			if( !node.label || ! /[0-9]+/.test( node.label ) ) {
				return;
			}

			let data = parent.data || ( parent.data = {} );
			let hProperties = data.hProperties || ( data.hProperties = {} );

			let newClass = headingLevels[ node.label ];
			if( newClass ) {
				parent.data.hProperties.class = newClass;
				parent.children.shift();
			}
		} );

		visit( tree, 'link', node => {
			if( !node.url ) {
				return;
			}

			if( node.url.startsWith('http://') || node.url.startsWith('https://') ) {
				let data = node.data || ( node.data = {} );
				let hProperties = data.hProperties || ( data.hProperties = {} );
				node.data.hProperties.rel = 'external';
			}
			else if( !node.url.startsWith('#') && typeof _relativeURL === 'function' && _ID ) {
				node.url = _relativeURL( node.url, _ID );
			}
		} );

		// Unicode object keys?… that's alright I guess…
		const entities = {
			'—': {
				pattern: '\\—',
				encoded: '&mdash;'
			},
			'–': {
				pattern: '\\–',
				encoded: '&ndash;'
			},
			'"': {
				pattern: '\\"',
				encoded: '&quot;'
			},
			"'": {
				pattern: "\\'",
				encoded: '&apos;'
			},
			'...': {
				pattern: '\\.\\.\\.',
				encoded: '&hellip;'
			}
		};
		const entitiesJoined = Object.values(entities).map(entity => entity.pattern).join('|');
		const entitiesTest = new RegExp(`(${entitiesJoined})`);
		const entitiesSplit = new RegExp( entitiesTest.source, entitiesTest.flags + 'g' );

		visit( tree, 'text', ( node, _index, parent ) => {
			if( [ 'code', 'inlineCode', 'fencedCode' ].includes( parent.type ) ) {
				return;
			}

			if( !node.value ) {
				return;
			}

			if( !entitiesTest.test( node.value ) ) {
				return;
			}

			const newChildren = [];
			parent.children.forEach(child => {
				if (child !== node || !child.value ) {
					if( child.position ) {
						delete child.position;
					}
					newChildren.push( child );
					return;
				}

				child.value.split( entitiesSplit ).forEach(part => {
					if( Object.keys( entities ).includes( part ) ) {
						newChildren.push( {
							type: 'html',
							value: entities[part].encoded
						} );
					}
					else {
						newChildren.push( {
							type: 'text',
							value: part
						} );
					}
				});
			});

			parent.children = newChildren;
		} );
	}

	return transformer;
};

module.exports = attacher;
