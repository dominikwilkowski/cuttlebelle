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
    visit( tree, 'text', ( node, _index, parent ) => {
      if( [ 'code', 'inlineCode' ].includes( parent.type ) ) {
        return;
      }

      if( !node.value ) {
        return;
      }

      if( !/—/.test( node.value ) ) {
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

        child.value.split( /(—)/g ).forEach(part => {
          if( part === '—' ) {
            newChildren.push( {
              type: 'html',
              value: '&mdash;'
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

  return transformer
};

module.exports = attacher;
