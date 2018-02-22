'use strict';

// Dependencies
// --------------------------------------------------------

const path             = require('path');
const { copy, remove } = require('fs-extra');
const request          = require('supertest');

// Support
// --------------------------------------------------------

const createTemplateEngineTestingServer = require('./support/createTemplateEngineTestingServer');

// Subjects
// --------------------------------------------------------

const { createEngine } = require('../src/templateFunctionExpressEngine');

// --------------------------------------------------------

const pathToFixturesDirectory = path.join(__dirname, 'fixtures');
const pathToTemplateDirectory = path.join(__dirname, 'tmp');

// --------------------------------------------------------

describe('the Template Function Express Engine', function ()
{
	let server;

	beforeEach(async function ()
	{
		// Copy all the fixtures to a temporary directory, so we
		// can modify them.
		await copy(pathToFixturesDirectory, pathToTemplateDirectory);

		// Create an Express template engine testing server and
		// register our engine.
		server = createTemplateEngineTestingServer(pathToTemplateDirectory)

			.engine(
				'js', createEngine()
			)

			.set('view engine', 'js');
	});

	afterEach(function ()
	{
		return remove(pathToTemplateDirectory);
	});

	it('shall render the template', function ()
	{
		// Act & Assert.
		return request(server).get('/render/a/template').expect(200, 'Hello World.');
	});

	it('shall render the template using a provided model', function ()
	{
		// Act & Assert.
		return request(server).get('/render/a/template/using/a/model').expect(200, 'Hello Luke.');
	});

	it('shall produce an error when the template does not exist', function ()
	{
		// Act & Assert.
		return request(server).get('/render/a/template/that/does/not/exist').expect(500);
	});

	it('shall produce an error when the template is not a function', function ()
	{
		// Act & Assert.
		return request(server).get('/render/a/template/that/is/invalid').expect(500);
	});

	it('shall produce an error when the template throws an error', function ()
	{
		// Act & Assert.
		return request(server).get('/render/a/template/that/throws/an/error').expect(500);
	});

	describe('when the `view cache` setting is disabled', function ()
	{
		beforeEach(function ()
		{
			server.disable('view cache');
		});

		it('shall not cache the provided template', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template').expect(200, 'Hello World.');

			// Setup.
			await copy(
				path.join(pathToFixturesDirectory, 'templateThatIsDifferent.js'),
				path.join(pathToTemplateDirectory, 'template.js')
			);

			// Act & Assert.
			return request(server).get('/render/a/template').expect(200, 'Goodbye World.');
		});

		it('shall not cache the provided template including any partials it loads', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/using/a/partial').expect(200, 'Hello Maria. Goodbye.');

			// Setup.
			await copy(
				path.join(pathToFixturesDirectory, 'templateThatIsADifferentPartial.js'),
				path.join(pathToTemplateDirectory, 'templateThatIsAPartial.js')
			);

			// Act & Assert.
			return request(server).get('/render/a/template/using/a/partial').expect(200, 'Hello Maria. Hello Again.');
		});

		it('shall not cache the provided template even when the template is not a function', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/that/is/invalid').expect(500);

			// Setup.
			await copy(
				path.join(pathToFixturesDirectory, 'template.js'),
				path.join(pathToTemplateDirectory, 'templateThatIsInvalid.js'),
			);

			// Act & Assert.
			return request(server).get('/render/a/template/that/is/invalid').expect(200, 'Hello World.');
		});

		it('shall not cache the provided template even when the template throws an error', async function ()
		{
			// Act & Assert.
			await request(server).get('/render/a/template/that/throws/an/error').expect(500);

			// Setup.
			await copy(
				path.join(pathToFixturesDirectory, 'template.js'),
				path.join(pathToTemplateDirectory, 'templateThatThrowsAnError.js'),
			);

			// Act & Assert.
			return request(server).get('/render/a/template/that/throws/an/error').expect(200, 'Hello World.');
		});
	});
});
