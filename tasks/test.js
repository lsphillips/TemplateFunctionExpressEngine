/* eslint no-console: 0 */

'use strict';

// Dependencies
// --------------------------------------------------------

const eslint = require('eslint');
const Mocha  = require('mocha');
const colors = require('colors');

// --------------------------------------------------------

Promise.resolve()

// Static Analysis
// --------------------------------------------------------

	.then(function ()
	{
		console.log(
			colors.underline('Running static analysis (eslint)')
		);

		let engine = new eslint.CLIEngine(
		{
			useEslintrc : true
		});

		let report = engine.executeOnFiles(
		[
			'tasks/test.js', 'src/templateFunctionExpressEngine.js', 'tests/templateFunctionExpressEngine.test.js'
		]);

		console.log(
			engine.getFormatter('stylish')(report.results)
		);

		if (report.errorCount > 0)
		{
			throw new Error('Static analysis has found some problems that are requiring your immediate attention.');
		}
	})

// Unit Tests
// --------------------------------------------------------

	.then(function ()
	{
		console.log(
			colors.underline('Running unit tests (mocha)')
		);

		return new Promise(function (success, failure)
		{
			let suiteOfTests = new Mocha(
			{
				ui : 'bdd', reporter : 'spec'
			});

			// Add.
			suiteOfTests.addFile('tests/templateFunctionExpressEngine.test.js');

			// Run.
			suiteOfTests.run(function (mochaTestErrors)
			{
				if (mochaTestErrors)
				{
					failure(
						new Error('Some tests have failed and are requiring your immediate attention.')
					);

					return;
				}

				success();
			});
		});
	})

// --------------------------------------------------------

	.then(function ()
	{
		process.exit(0);
	})

// --------------------------------------------------------

	.catch(function ()
	{
		process.exit(1);
	});
