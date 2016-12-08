/* eslint-env mocha */

'use strict';

// Dependencies
// --------------------------------------------------------

const path   = require('path');
const glob   = require('glob');
const chai   = require('chai');
const sinon  = require('sinon');
const assign = require('deep-assign');

// --------------------------------------------------------

function getFullPathToTemplateFixture (pathToTemplateFile)
{
	return path.join(__dirname, 'fixtures/templates', pathToTemplateFile);
}

// --------------------------------------------------------

function getAllTemplateFixtureFiles ()
{
	return glob.sync(
		getFullPathToTemplateFixture('**/*.js')
	);
}

// --------------------------------------------------------

describe('templateFunctionExpressEngine', function ()
{
	const templateFunctionExpressEngine = require('../src/templateFunctionExpressEngine');

	// -------------------------------------------------------

	describe('.renderTemplateFunction(template, model, rendererForPartials)', function ()
	{
		it('shall throw an error when the `template` is not a function', function ()
		{
			// Act & Assert.
			chai.expect(function ()
			{
				templateFunctionExpressEngine.renderTemplateFunction(null)

			}).to.throw(TypeError);
		});

		// ------------------------------------------------------

		describe('shall call the `template`', function ()
		{
			it('and return the result', function ()
			{
				// Setup.
				let aTemplateFunction = sinon.spy(function ()
				{
					return 'Hello World';
				});

				// Act.
				let result = templateFunctionExpressEngine.renderTemplateFunction(aTemplateFunction);

				// Assert.
				chai.expect(
					aTemplateFunction.called
				).to.be.true;

				// Assert.
				chai.expect(result).to.equal('Hello World');
			});

			// -----------------------------------------------------

			it('using the `model`', function ()
			{
				// Setup.
				let model = { name : 'World' };

				// Setup.
				let aTemplateFunctionThatNeedsAModel = sinon.spy(function ({ name })
				{
					return `Hello ${name}`;
				});

				// Act.
				let result = templateFunctionExpressEngine.renderTemplateFunction(aTemplateFunctionThatNeedsAModel, model);

				// Assert.
				chai.expect(
					aTemplateFunctionThatNeedsAModel.calledWith(model)
				).to.be.true;

				// Assert.
				chai.expect(result).to.equal('Hello World');
			});

			// -----------------------------------------------------

			it('using the `renderer` to render partial templates', function ()
			{
				// Setup.
				let aTemplateFunctionThatCallsAPartial = sinon.spy(function (model, render)
				{
					function aPartialTemplateFunction ()
					{
						return 'World';
					}

					return `Hello ${ render(aPartialTemplateFunction) }`;
				});

				// Setup.
				let reversePartialTemplateRenderer = function (template, model)
				{
					return template(model).split('').reverse().join('');
				};

				// Act.
				let result = templateFunctionExpressEngine.renderTemplateFunction(aTemplateFunctionThatCallsAPartial, null, reversePartialTemplateRenderer);

				// Assert.
				chai.expect(
					aTemplateFunctionThatCallsAPartial.calledWith(sinon.match.any, reversePartialTemplateRenderer)
				).to.be.true;

				// Assert.
				chai.expect(result).to.equal('Hello dlroW');
			});

			// -----------------------------------------------------

			it('using `templateFunctionExpressEngine.renderTemplateFunction()` by default to render partial templates when `rendererForPartials` is not provided', function ()
			{
				// Setup.
				let aTemplateFunctionThatCallsAPartial = sinon.spy(function (model, render)
				{
					function aPartialTemplateFunction ()
					{
						return 'World';
					}

					return `Hello ${ render(aPartialTemplateFunction) }`;
				});

				// Act.
				let result = templateFunctionExpressEngine.renderTemplateFunction(aTemplateFunctionThatCallsAPartial);

				// Assert.
				chai.expect(
					aTemplateFunctionThatCallsAPartial.calledWith(sinon.match.any, templateFunctionExpressEngine.renderTemplateFunction)
				).to.be.true;

				// Assert.
				chai.expect(result).to.equal('Hello World');
			});

			// -----------------------------------------------------

			it('and throw an error when said `template` throws an error', function ()
			{
				// Setup.
				let aTemplateFunctionThatFails = function ()
				{
					throw new Error('The template failed to render for some reason.');
				};

				// Act & Assert.
				chai.expect(function ()
				{
					templateFunctionExpressEngine.renderTemplateFunction(aTemplateFunctionThatFails);

				}).to.throw(Error);
			});
		});
	});

	// -------------------------------------------------------

	describe('.createEngine(options)', function ()
	{
		const aDefaultExpressModel =
		{
			settings : { 'view cache' : true, 'views' : getFullPathToTemplateFixture('') }
		};

		// ------------------------------------------------------

		describe('shall return an Express view engine function with signature: engine(pathToTemplateFile, model, callback)', function ()
		{
			it('that shall execute `callback` with an error when no template function exists at `pathToTemplateFile`', function (done)
			{
				// Setup.
				let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatDoesNotExist.js');

				// Act.
				templateFunctionExpressEngine.createEngine()(pathToTemplateFile, aDefaultExpressModel, function (error)
				{
					// Assert.
					chai.expect(error).to.be.instanceOf(Error);

					done();
				});
			});

			// -----------------------------------------------------

			it('that shall execute `callback` with an error when the template function found at `pathToTemplateFile` is not actually a function', function (done)
			{
				// Setup.
				let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatIsNotAFunction.js');

				// Act.
				templateFunctionExpressEngine.createEngine()(pathToTemplateFile, aDefaultExpressModel, function (error)
				{
					// Assert.
					chai.expect(error).to.be.instanceof(Error);

					done();
				});
			});

			// -----------------------------------------------------

			describe('that shall render the template function found at `pathToTemplateFile`', function ()
			{
				it('and execute the `callback` with the result', function (done)
				{
					// Setup.
					let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunction.js');

					// Act.
					templateFunctionExpressEngine.createEngine()(pathToTemplateFile, aDefaultExpressModel, function (error, result)
					{
						// Assert.
						chai.expect(error).to.be.null;

						// Assert.
						chai.expect(result).to.equal('Hello World');

						done();
					});
				});

				// ----------------------------------------------------

				it('using the `model`', function (done)
				{
					// Setup.
					let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatNeedsAModel.js');

					// Setup.
					let model = assign({}, aDefaultExpressModel,
					{
						name : 'World'
					});

					// Act.
					templateFunctionExpressEngine.createEngine()(pathToTemplateFile, model, function (error, result)
					{
						// Assert.
						chai.expect(result).to.equal('Hello World');

						done();
					});
				});

				// ----------------------------------------------------

				it('using `options.rendererForPartials` to render partials', function (done)
				{
					// Setup.
					let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatCallsAPartial.js');

					// Setup.
					let rendererForPartials = function (template, model)
					{
						return template(model).split('').reverse().join('');
					};

					// Act.
					templateFunctionExpressEngine.createEngine({ rendererForPartials })(pathToTemplateFile, aDefaultExpressModel, function (error, result)
					{
						// Assert.
						chai.expect(result).to.be.equal('Hello dlroW');

						done();
					});
				});

				// ----------------------------------------------------

				it('using `templateFunctionExpressEngine.renderTemplateError()` to render partials when `options.rendererForPartials` is not provided', function (done)
				{
					// Setup.
					let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatCallsAPartial.js');

					// Act.
					templateFunctionExpressEngine.createEngine()(pathToTemplateFile, aDefaultExpressModel, function (error, result)
					{
						// Assert.
						chai.expect(result).to.be.equal('Hello World');

						done();
					});
				});

				// ----------------------------------------------------

				it('executing `callback` with an error when rendering of said template function fails for some reason', function (done)
				{
					// Setup.
					let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatFails.js');

					// Act.
					templateFunctionExpressEngine.createEngine()(pathToTemplateFile, aDefaultExpressModel, function (error)
					{
						// Assert.
						chai.expect(error).to.be.instanceof(Error);

						done();
					});
				});
			});

			// -----------------------------------------------------

			it('that shall not clear the `require` cache for the view directory found at `model.settings["views"]` when `model.settings["view cache"]` is `true`', function (done)
			{
				// Setup.
				let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatCallsAPartial.js');

				// Act.
				templateFunctionExpressEngine.createEngine()(pathToTemplateFile, aDefaultExpressModel, function ()
				{
					let hasNotRemovedAllTemplateFixtureFilesFromCache = getAllTemplateFixtureFiles()

						.some(function (templateFixtureFile)
						{
							return require.cache[
								path.normalize(templateFixtureFile)
							] !== undefined;
						});

					// Assert.
					chai.expect(hasNotRemovedAllTemplateFixtureFilesFromCache).to.be.true;

					done();
				});
			});

			// -----------------------------------------------------

			it('that shall clear the `require` cache for the view directory found at `model.settings["views"]` when `model.settings["view cache"]` is `false`', function (done)
			{
				// Setup.
				let pathToTemplateFile = getFullPathToTemplateFixture('aTemplateFunctionThatCallsAPartial.js');

				// Setup.
				let model = assign({}, aDefaultExpressModel,
				{
					settings :
					{
						'view cache' : false
					}
				});

				// Act.
				templateFunctionExpressEngine.createEngine()(pathToTemplateFile, model, function ()
				{
					let hasRemovedAllTemplateFixtureFilesFromCache = getAllTemplateFixtureFiles()

						.every(function (templateFixtureFile)
						{
							return require.cache[
								path.normalize(templateFixtureFile)
							] === undefined;
						});

					// Assert.
					chai.expect(hasRemovedAllTemplateFixtureFilesFromCache).to.be.true;

					done();
				});
			});
		});
	});
});
