/***************************************************************************************************************************************************************
 *
 * docs.js unit tests
 *
 * @file - src/docs.js
 *
 * Tested methods:
 * Ipsum
 * GetCategories
 * GetCss
 * BuildPropsYaml
 * ParseExample
 * ReplaceMagic
 * MakePartials
 * MakeIpsum
 * vocabulary
 *
 **************************************************************************************************************************************************************/


import { Ipsum, GetCategories, GetCss, BuildPropsYaml, ParseExample, ReplaceMagic, MakePartials, MakeIpsum, vocabulary } from '../../src/docs';
import { ParseMD } from '../../src/parse';
import { Path } from '../../src/path';
import React from 'react';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Ipsum
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Ipsum - Is a string', () => {
	expect( typeof Ipsum ).toBe( 'string' );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetCategories
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetCategories() - Gets all categories from an array', () => {
	expect( GetCategories( ['one/two.js'] ) ).toEqual( expect.arrayContaining( ['one'] ) );
	expect( GetCategories( ['index/one/two.js'] ) ).toEqual( expect.arrayContaining( ['index/one'] ) );
	expect( GetCategories( ['one/two.js', 'three/four.js', 'one.js'] ) ).toEqual( expect.arrayContaining( ['one', 'three', '.'] ) );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetCss
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetCss() - Gets all css files from mock folder', () => {
	const folders = [
		Path.normalize(`${ __dirname }/mocks/assets/nesting/nested/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/nesting/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/test/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/test/style2.css`),
	];

	expect( GetCss( Path.normalize(`${ __dirname }/mocks/assets`) ) ).toEqual( expect.arrayContaining( folders ) );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// BuildPropsYaml
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('BuildPropsYaml() - Parse examples without props correctly', () => {
	const props = {
		file: 'somefile.js',
		infos: {
			description: '',
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: somefile</span>\n`
		} } />,
	};

	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse string prop correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				title: {
					type: {
						name: 'string',
					},
					required: true,
					description: 'title: Headline',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			title: 'Headline',
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: file</span>\n` +
				`<span class=\"cuttlebelle-yaml-line\">${ props.infos.props.title.description }</span>\n`
		} } />,
	};

	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse array correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				items: {
					type: {
						name: 'array',
					},
					required: true,
					description: 'items:\n  - one\n  - two',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			items: [ 'one', 'two' ],
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: file</span>\n` +
				`<span class=\"cuttlebelle-yaml-line\">${ props.infos.props.items.description }</span>\n`
		} } />,
	};

	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse object correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				items: {
					type: {
						name: 'object',
					},
					required: true,
					description: 'items:\n  one: one\n  two: two',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			items: { one: 'one', two: 'two' },
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: file</span>\n` +
				`<span class=\"cuttlebelle-yaml-line\">${ props.infos.props.items.description }</span>\n`
		} } />,
	};

	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse array object correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				items: {
					type: {
						name: 'object',
					},
					required: true,
					description: 'items:\n  - one: one\n  - two: two',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			items: [ { one: 'one' }, { two: 'two' } ],
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: file</span>\n` +
				`<span class=\"cuttlebelle-yaml-line\">${ props.infos.props.items.description }</span>\n`
		} } />,
	};

	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse body correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				_body: {
					type: {
						name: 'node',
					},
					required: true,
					description: '_body: (text)(2)',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			_body: MakeIpsum( 2 ),
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `---\n<span class="cuttlebelle-yaml-line">layout: file</span>\n---\n\n` +
				`${ Ipsum.split('.').slice(0, 4).join('.') }...`
		} } />,
	};


	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse partial node correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				partials: {
					type: {
						name: 'node',
					},
					required: true,
					description: 'partials: (partials)(4)',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			partials: MakePartials( 4 ),
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: file</span>\n` +
				`<span class=\"cuttlebelle-yaml-line\">partials: ${ vocabulary[ 0 ].replacement }</span>\n`
		} } />,
	};


	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


test('BuildPropsYaml() - Parse text node correctly', () => {
	const props = {
		file: 'file.js',
		infos: {
			description: '',
			props: {
				text: {
					type: {
						name: 'node',
					},
					required: true,
					description: 'text: (text)(4)',
				},
			},
		},
	};
	const outcome = {
		file: props.file,
		infos: props.infos,
		props: {
			text: MakeIpsum( 4 ),
		},
		disabled: undefined,
		yaml: <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
			__html: `<span class="cuttlebelle-yaml-line">layout: file</span>\n` +
				`<span class=\"cuttlebelle-yaml-line\">text: ${ vocabulary[ 1 ].replacement }</span>\n`
		} } />,
	};


	return BuildPropsYaml( props ).then( data => {
		expect( data ).toMatchObject( outcome );
	});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ParseExample
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ParseExample() - An object without magic stays the same', () => {
	const example = {
		something: 'Some text',
		another: [ 'one', 'two' ],
		more: {
			one: '(text)(2)',
		},
		lastthing: 'Last',
	};
	const outcome = {
		something: 'Some text',
		another: [ 'one', 'two' ],
		more: {
			one: '(text)(2)', // no recursiveness just yet
		},
		lastthing: 'Last',
	};

	expect( ParseExample( example ) ).toMatchObject( outcome );
});


test('ParseExample() - Replace magic text correctly', () => {
	const example = {
		something: '(text)(2)',
		another: [ 'one', 'two' ],
		lastthing: 'Last',
	};
	const outcome = {
		something: MakeIpsum( 2 ),
		another: [ 'one', 'two' ],
		lastthing: 'Last',
	};

	expect( ParseExample( example ) ).toMatchObject( outcome );
});


test('ParseExample() - Replace magic partials correctly', () => {
	const example = {
		something: 'Some text',
		another: [ 'one', 'two' ],
		lastthing: '(partials)(3)',
	};
	const outcome = {
		something: 'Some text',
		another: [ 'one', 'two' ],
		lastthing: MakePartials( 3 ),
	};

	expect( ParseExample( example ) ).toMatchObject( outcome );
});


test('ParseExample() - Replace many magic correctly', () => {
	const example = {
		something: 'Some text',
		another: [ 'one', 'two' ],
		somemore: '(text)(1)',
		onemore: '(text)(5)',
		more: '(partials)(8)',
		lastthing: '(partials)(3)',
	};
	const outcome = {
		something: 'Some text',
		another: [ 'one', 'two' ],
		somemore: MakeIpsum( 1 ),
		onemore: MakeIpsum( 5 ),
		more: MakePartials( 8 ),
		lastthing: MakePartials( 3 ),
	};

	expect( ParseExample( example ) ).toMatchObject( outcome );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ReplaceMagic
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ReplaceMagic() - A string without magic stays the same', () => {
	const example = 'Some text';
	const outcome = 'Some text';

	expect( ReplaceMagic( example ) ).toBe( outcome );
});


test(`ReplaceMagic() - A string with magic text get’s replacement`, () => {
	const example = 'Some (text)(8) text';
	const outcome = `Some ${ vocabulary[ 1 ].replacement } text`;

	expect( ReplaceMagic( example ) ).toBe( outcome );
});


test(`ReplaceMagic() - A string with magic partials get’s replacement`, () => {
	const example = 'Some (partials)(1) text';
	const outcome = `Some ${ vocabulary[ 0 ].replacement } text`;

	expect( ReplaceMagic( example ) ).toBe( outcome );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// MakePartials
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test(`MakePartials() - The partials are duplicated correctly`, () => {
	const outcome1 = <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
		__html: '<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> '
	} } />;
	const outcome2 = <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
		__html: '<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> ' +
			'<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> ' +
			'<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> ' +
			'<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> ' +
			'<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> '
	} } />;
	const outcome3 = <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
		__html: '<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> ' +
			'<img src="http://via.placeholder.com/700x100?text=partial" class="cuttlebelle-partial" /> '
	} } />;

	expect( MakePartials( 1 ) ).toMatchObject( outcome1 );
	expect( MakePartials( 5 ) ).toMatchObject( outcome2 );
	expect( MakePartials( 2 ) ).toMatchObject( outcome3 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// MakePartials
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test(`MakeIpsum() - The partials are duplicated correctly`, () => {
	const outcome1 = <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
		__html: '<p>The year 1866 was signalised by a remarkable incident, a mysterious and puzzling phenomenon, which doubtless no one has yet forgotten.</p> '
	} } />;
	const outcome2 = <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
		__html: '<p>The year 1866 was signalised by a remarkable incident, a mysterious and puzzling phenomenon, which doubtless no one has yet forgotten. ' +
			'Not to mention rumours which agitated the maritime population and excited the public mind, even in the interior of continents, seafaring men were ' +
			'particularly excited. Merchants, common sailors, captains of vessels, skippers, both of Europe and America, naval officers of all countries, and the ' +
			'Governments of several States on the two continents, were deeply interested in the matter.</p> <p>For some time past vessels had been met by "an ' +
			'enormous thing," a long object, spindle-shaped, occasionally phosphorescent, and infinitely larger and more rapid in its movements than a ' +
			'whale.</p> <p>The facts relating to this apparition (entered in various log-books) agreed in most respects as to the shape of the object or creature ' +
			'in question, the untiring rapidity of its movements, its surprising power of locomotion, and the peculiar life with which it seemed endowed.</p> '
	} } />;
	const outcome3 = <cuttlebellesillywrapper dangerouslySetInnerHTML={ {
		__html: ParseMD(
				`${ Ipsum }\nThe year 1866 was signalised by a remarkable incident, a mysterious and puzzling phenomenon, which doubtless no one has ` +
				`yet forgotten.`
			).replace(/(?:\r\n|\r|\n)/g, ' ')
	} } />;

	expect( MakeIpsum( 1 ) ).toMatchObject( outcome1 );
	expect( MakeIpsum( 5 ) ).toMatchObject( outcome2 );
	expect( MakeIpsum( 70 ) ).toMatchObject( outcome3 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// vocabulary
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('vocabulary - The vocabulary has the right amount of object bits', () => {
	expect( vocabulary ).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				name: expect.any( String ),
				func: expect.any( Function ),
				replacement: expect.any( String ),
			})
		])
	);
});
