'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const path = require('path');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function removeTemplateFromCache (pathToTemplateFile)
{
	function removeModuleFromCache (module)
	{
		delete require.cache[module.id];

		module.children.forEach(childModule =>
		{
			if (require.cache[childModule.id] && path.extname(childModule.filename) !== '.node')
			{
				removeModuleFromCache(childModule);
			}
		});
	}

	let cachedModule = require.cache[
		require.resolve(pathToTemplateFile)
	];

	if (cachedModule)
	{
		removeModuleFromCache(cachedModule);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function createEngine ()
{
	return (pathToTemplateFile, model, callback) =>
	{
		function done (error, result)
		{
			if (!model.settings['view cache'])
			{
				removeTemplateFromCache(pathToTemplateFile);
			}

			callback(error, result);
		}

		let template;

		try // to load the template.
		{
			template = require(pathToTemplateFile); // eslint-disable-line node/global-require, import/no-dynamic-require
		}
		catch (loadTemplateError)
		{
			done(
				new Error(`Could not load the template at ${pathToTemplateFile}. ${loadTemplateError}`)
			);

			return;
		}

		if (typeof template !== 'function')
		{
			done(
				new TypeError(`Could not render the template at ${pathToTemplateFile}. It is not a function.`)
			);

			return;
		}

		let result;

		try // to render the template.
		{
			result = template(model);
		}
		catch (renderTemplateError)
		{
			done(
				new Error(`An error occurred whilst rendering the template at ${pathToTemplateFile}. ${renderTemplateError}`)
			);

			return;
		}

		done(null, result);
	};
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = { createEngine };
