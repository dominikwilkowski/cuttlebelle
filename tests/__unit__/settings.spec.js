/***************************************************************************************************************************************************************
 *
 * settings.js unit tests
 *
 * @file - src/settings.js
 *
 * Tested methods:
 * SETTINGS
 *
 **************************************************************************************************************************************************************/


import { SETTINGS } from '../../src/settings';
import { Path } from '../../src/path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SETTINGS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('SETTINGS.get() - The default settings are correct', () => {
	const defaults = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			code: Path.normalize(`${ process.cwd() }/code/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdown: {
				headingIds: true
			},
			watchTimeout: 400,
			browserSync: {},
			globalProp: {},
		},
		docs: {
			root: 'files/',
			index: Path.normalize(`${ __dirname }/../../.template/docs/layout/index.js`),
			category: Path.normalize(`${ __dirname }/../../.template/docs/layout/category.js`),
			IDProp: 'page2',
			navProp: {
				index: {
					page1: 'page1',
					page2: {
						'page2/nested': 'page2/nested',
					},
					page3: 'page3',
				},
			},
			pagesProp: {
				page1: {
					_url: '/page1',
					title: 'Page 1',
				},
				page2: {
					_url: '/page2',
					title: 'Page 2',
				},
				'page2/nested': {
					_url: '/page2/nested',
					title: 'Nested in page 2',
				},
				page3: {
					_url: '/page3',
					title: 'Page 3',
				},
				index: {
					_url: '/',
					title: 'Homepage',
				},
			},
		},
	};

	expect( SETTINGS.get() ).toMatchObject( defaults );
});


test('SETTINGS.set() - Not setting anything will merge default correctly', () => {
	const changes = undefined;
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			code: Path.normalize(`${ process.cwd() }/code/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdown: {
				headingIds: true
			},
			watchTimeout: 400,
			browserSync: {},
			globalProp: {},
		},
		docs: {
			root: 'files/',
			index: Path.normalize(`${ __dirname }/../../.template/docs/layout/index.js`),
			category: Path.normalize(`${ __dirname }/../../.template/docs/layout/category.js`),
			IDProp: 'page2',
			navProp: {
				index: {
					page1: 'page1',
					page2: {
						'page2/nested': 'page2/nested',
					},
					page3: 'page3',
				},
			},
			pagesProp: {
				page1: {
					_url: '/page1',
					title: 'Page 1',
				},
				page2: {
					_url: '/page2',
					title: 'Page 2',
				},
				'page2/nested': {
					_url: '/page2/nested',
					title: 'Nested in page 2',
				},
				page3: {
					_url: '/page3',
					title: 'Page 3',
				},
				index: {
					_url: '/',
					title: 'Homepage',
				},
			},
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - An empty object as settings folder will merge default correctly', () => {
	const changes = {};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			code: Path.normalize(`${ process.cwd() }/code/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdown: {
				headingIds: true
			},
			watchTimeout: 400,
			browserSync: {},
			globalProp: {},
		},
		docs: {
			root: 'files/',
			index: Path.normalize(`${ __dirname }/../../.template/docs/layout/index.js`),
			category: Path.normalize(`${ __dirname }/../../.template/docs/layout/category.js`),
			IDProp: 'page2',
			navProp: {
				index: {
					page1: 'page1',
					page2: {
						'page2/nested': 'page2/nested',
					},
					page3: 'page3',
				},
			},
			pagesProp: {
				page1: {
					_url: '/page1',
					title: 'Page 1',
				},
				page2: {
					_url: '/page2',
					title: 'Page 2',
				},
				'page2/nested': {
					_url: '/page2/nested',
					title: 'Nested in page 2',
				},
				page3: {
					_url: '/page3',
					title: 'Page 3',
				},
				index: {
					_url: '/',
					title: 'Homepage',
				},
			},
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Prevent cwd from being set', () => {
	const changes = {
		folder: {
			cwd: 'test',
		},
	};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			code: Path.normalize(`${ process.cwd() }/code/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdown: {
				headingIds: true
			},
			watchTimeout: 400,
			browserSync: {},
			globalProp: {},
		},
		docs: {
			root: 'files/',
			index: Path.normalize(`${ __dirname }/../../.template/docs/layout/index.js`),
			category: Path.normalize(`${ __dirname }/../../.template/docs/layout/category.js`),
			IDProp: 'page2',
			navProp: {
				index: {
					page1: 'page1',
					page2: {
						'page2/nested': 'page2/nested',
					},
					page3: 'page3',
				},
			},
			pagesProp: {
				page1: {
					_url: '/page1',
					title: 'Page 1',
				},
				page2: {
					_url: '/page2',
					title: 'Page 2',
				},
				'page2/nested': {
					_url: '/page2/nested',
					title: 'Nested in page 2',
				},
				page3: {
					_url: '/page3',
					title: 'Page 3',
				},
				index: {
					_url: '/',
					title: 'Homepage',
				},
			},
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Set settings correctly', () => {
	const changes = {
		folder: {
			content: 'test',
		},
		layouts: {
			page: 'test',
		},
		site: {
			root: 'test',
		},
		docs: {
			root: 'test',
		},
	};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/test/`),
			code: Path.normalize(`${ process.cwd() }/code/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'test',
			partial: 'partial',
		},
		site: {
			root: 'test',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdown: {
				headingIds: true
			},
			watchTimeout: 400,
			browserSync: {},
			globalProp: {},
		},
		docs: {
			root: 'test',
			index: Path.normalize(`${ __dirname }/../../.template/docs/layout/index.js`),
			category: Path.normalize(`${ __dirname }/../../.template/docs/layout/category.js`),
			IDProp: 'page2',
			navProp: {
				index: {
					page1: 'page1',
					page2: {
						'page2/nested': 'page2/nested',
					},
					page3: 'page3',
				},
			},
			pagesProp: {
				page1: {
					_url: '/page1',
					title: 'Page 1',
				},
				page2: {
					_url: '/page2',
					title: 'Page 2',
				},
				'page2/nested': {
					_url: '/page2/nested',
					title: 'Nested in page 2',
				},
				page3: {
					_url: '/page3',
					title: 'Page 3',
				},
				index: {
					_url: '/',
					title: 'Homepage',
				},
			},
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Set all settings correctly', () => {
	const changes = {
		folder: {
			cwd: 'test',
			content: 'test',
			code: 'test',
			assets: 'test/test/',
			site: 'test/',
			docs: 'test/',
			index: 'test',
			homepage: 'test',
		},
		layouts: {
			page: 'test',
			partial: 'test',
		},
		site: {
			root: 'test',
			doctype: 'test',
			redirectReact: 'test',
			markdown: {
				headingIds: true,
				plugins: [
					'test'
				]
			},
			watchTimeout: 100,
			browserSync: {
				port: 1337,
			},
			globalProp: 'foo',
		},
		docs: {
			root: 'test',
			index: 'test.js',
			category: 'test.js',
			IDProp: 'test',
			navProp: { test: 'test' },
			pagesProp: { test: 'test' },
		},
	};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/test/`),
			code: Path.normalize(`${ process.cwd() }/test/`),
			assets: Path.normalize(`${ process.cwd() }/test/test/`),
			site: Path.normalize(`${ process.cwd() }/test/`),
			docs: Path.normalize(`${ process.cwd() }/test/`),
			index: 'test',
			homepage: 'test',
		},
		layouts: {
			page: 'test',
			partial: 'test',
		},
		site: {
			root: 'test',
			doctype: 'test',
			redirectReact: 'test',
			markdown: {
				headingIds: true,
				plugins: [
					'test'
				]
			},
			watchTimeout: 100,
			browserSync: {
				port: 1337,
			},
			globalProp: 'foo',
		},
		docs: {
			root: 'test',
			index: Path.normalize(`${ process.cwd() }/test.js`),
			category: Path.normalize(`${ process.cwd() }/test.js`),
			IDProp: 'test',
			navProp: { test: 'test' },
			pagesProp: { test: 'test' },
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Merge docs "nav" and "pages" object correctly', () => {
	const changes = {
		docs: {
			navProp: {
				test: 'test',
				test2: {
					test3: 'test3',
				},
			},
			pagesProp: { test2: 'test2' },
		},
	};
	const settings = {
		root: 'test',
		index: Path.normalize(`${ process.cwd() }/test.js`),
		category: Path.normalize(`${ process.cwd() }/test.js`),
		navProp: {
			test: 'test',
			test2: {
				test3: 'test3',
			},
		},
		pagesProp: { test2: 'test2' },
	};

	expect( SETTINGS.set( changes ).docs ).toMatchObject( settings );
});
