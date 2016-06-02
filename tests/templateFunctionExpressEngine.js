/* eslint-env mocha */

'use strict';

// Dependencies
// --------------------------------------------------------

const glob = require('glob');
const chai = require('chai');
const path = require('path');

// --------------------------------------------------------

function getFullPathToTemplateFixture (pathToTemplateFile)
{
	return path.join(__dirname, 'fixtures/templates', pathToTemplateFile);
}

function getAllTemplateFixtureFiles ()
{
	return glob.sync(
		getFullPathToTemplateFixture('**/*.js')
	);
}

// --------------------------------------------------------

describe('templateFunctionExpressEngine(pathToTemplateFile, options, callback)', function ()
{
	const templateFunctionExpressEngine = require('../src/templateFunctionExpressEngine');

	// -------------------------------------------------------

	const defaultRenderOptions =
	{
		cache : true, settings : { 'views' : getFullPathToTemplateFixture(''), 'view engine' : 'js' }
	};

	// -------------------------------------------------------

	it('is a function expecting 3 arguments: the full template file path, the render options and the callback function', function ()
	{
		// Assert.
		chai.expect(
			templateFunctionExpressEngine
		).to.be.instanceOf(Function);

		// Assert.
		chai.expect(
			templateFunctionExpressEngine.length
		).to.equal(3);
	});

	// -------------------------------------------------------

	it('shall render the template function provided at path `pathToTemplateFile`', function (done)
	{
		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateWithNoParameters.js'), defaultRenderOptions, function (error, result)
		{
			chai.expect(result).to.be.equal('This is an example template function.');

			done();
		});
	});

	// -------------------------------------------------------

	it('shall render the template function provided at path `pathToTemplateFile` using the `options`', function (done)
	{
		let renderOptions = Object.assign(
		{
			name : 'World'

		}, defaultRenderOptions);

		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateWithParameters.js'), renderOptions, function (error, result)
		{
			chai.expect(result).to.be.equal('Hello World');

			done();
		});
	});

	// -------------------------------------------------------

	it('shall throw an error when the `pathToTemplateFile` does not exist', function (done)
	{
		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateThatDoesNotExist.js'), defaultRenderOptions, function (error)
		{
			chai.expect(error).to.be.instanceOf(Error);

			done();
		});
	});

	// -------------------------------------------------------

	it('shall throw a type error when the `pathToTemplateFile` does not export a function', function (done)
	{
		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateThatIsNotAFunction.js'), defaultRenderOptions, function (error)
		{
			chai.expect(error).to.be.instanceOf(TypeError);

			done();
		});
	});

	// -------------------------------------------------------

	it('shall throw an error when the template function throws an error', function (done)
	{
		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateThatThrowsAnError.js'), defaultRenderOptions, function (error)
		{
			chai.expect(error).to.be.instanceOf(Error);

			done();
		});
	});

	// -------------------------------------------------------

	it('shall not clear the `require` cache for the view directory (`options.settings.views`) when caching is enabled', function (done)
	{
		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateThatCallsAPartial.js'), defaultRenderOptions, function ()
		{
			chai.expect(
				getAllTemplateFixtureFiles().some(function (templateFixtureFile)
				{
					return require.cache[templateFixtureFile] !== undefined;
				})
			).to.be.true;

			done();
		});
	});

	// -------------------------------------------------------

	it('shall clear the `require` cache for the view directory (`options.settings.views`) when caching is disabled', function (done)
	{
		let renderOptions = Object.assign({}, defaultRenderOptions,
		{
			cache : false
		});

		// Act & Assert.
		templateFunctionExpressEngine(getFullPathToTemplateFixture('templateThatCallsAPartial.js'), renderOptions, function ()
		{
			chai.expect(
				getAllTemplateFixtureFiles().every(function (templateFixtureFile)
				{
					return require.cache[templateFixtureFile] === undefined;
				})
			).to.be.true;

			done();
		});
	});
});
