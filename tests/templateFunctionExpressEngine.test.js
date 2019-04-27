'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const { copy, remove }              = require('fs-extra');
const request                       = require('supertest');
const createViewEngineTestingServer = require('./support/createViewEngineTestingServer');
const { createEngine }              = require('../src/templateFunctionExpressEngine');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

describe('the Template Function Express Engine', function ()
{
	let server;

	beforeEach(async function ()
	{
		// Copy all the fixtures to a temporary directory, so we
		// can modify them.
		await copy('tests/fixtures', 'tests/views');

		// Create an Express view engine testing server and then
		// register our engine.
		server = createViewEngineTestingServer('tests/views')

			.engine(
				'js', createEngine()
			)

			.set('view engine', 'js');
	});

	afterEach(async function ()
	{
		await remove('tests/views');
	});

	it('shall render a template', async function ()
	{
		// Act & Assert.
		await request(server).get('/render/a/template').expect(200, 'This is a template.');
	});

	it('shall render a template using a provided model', async function ()
	{
		// Act & Assert.
		await request(server).get('/render/a/template/using/a/model').expect(200, 'This is a template that uses a model. This is a template model value.');
	});

	it('shall produce an error when a template does not exist', async function ()
	{
		// Act & Assert.
		await request(server).get('/render/a/template/that/does/not/exist').expect(500);
	});

	it('shall produce an error when a template is not a function', async function ()
	{
		// Act & Assert.
		await request(server).get('/render/a/template/that/is/invalid').expect(500);
	});

	it('shall produce an error when a template throws an error', async function ()
	{
		// Act & Assert.
		await request(server).get('/render/a/template/that/throws/an/error').expect(500);
	});

	describe('when the `view cache` setting is disabled', function ()
	{
		beforeEach(function ()
		{
			server.disable('view cache');
		});

		it('shall not cache a template', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template').expect(200, 'This is a template.');

			// Setup.
			await copy('tests/fixtures/templateThatIsDifferent.js', 'tests/views/template.js');

			// Act & Assert.
			await request(server).get('/render/a/template').expect(200, 'This is a different template.');
		});

		it('shall not cache a template including any partials it may use', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/using/a/partial').expect(200, 'This is a template that uses a template partial. This is a partial template.');

			// Setup.
			await copy('tests/fixtures/templateThatIsADifferentPartial.js', 'tests/views/templateThatIsAPartial.js');

			// Act & Assert.
			await request(server).get('/render/a/template/using/a/partial').expect(200, 'This is a template that uses a template partial. This is a different partial template.');
		});

		it('shall not cache a template even when it does not exist', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/that/does/not/exist').expect(500);

			// Setup.
			await copy('tests/fixtures/template.js', 'tests/views/templateThatDoesNotExist.js');

			// Act & Assert.
			await request(server).get('/render/a/template/that/does/not/exist').expect(200, 'This is a template.');
		});

		it('shall not cache a template even when it is not a function', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/that/is/invalid').expect(500);

			// Setup.
			await copy('tests/fixtures/template.js', 'tests/views/templateThatIsInvalid.js');

			// Act & Assert.
			await request(server).get('/render/a/template/that/is/invalid').expect(200, 'This is a template.');
		});

		it('shall not cache a template even when it throws an error', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/that/throws/an/error').expect(500);

			// Setup.
			await copy('tests/fixtures/template.js', 'tests/views/templateThatThrowsAnError.js');

			// Act & Assert.
			await request(server).get('/render/a/template/that/throws/an/error').expect(200, 'This is a template.');
		});
	});
});
