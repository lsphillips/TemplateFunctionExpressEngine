'use strict';

// Dependencies
// --------------------------------------------------------

const glob = require('glob');
const path = require('path');

// --------------------------------------------------------

function clearRequireCacheInDirectory (directory)
{
	glob.sync(
		path.join(directory, '**/*')
	).forEach(function (file)
	{
		delete require.cache[
			path.normalize(file)
		];
	});
}

// --------------------------------------------------------

function render (template, model, renderer = render)
{
	// Ensure the template is a function, otherwise throw a
	// complaint.
	if (typeof template !== 'function')
	{
		throw new TypeError(`The provided function template is not valid. It must be a function.`);
	}

	let result;

	try // to render template with data.
	{
		result = template(model, renderer);
	}
	catch (renderTemplateError)
	{
		throw new Error(`An error occurred whilst rendering the template function with name ${template.name}. ${renderTemplateError}`);
	}

	return result;
}

// --------------------------------------------------------

function create (options = {})
{
	let rendererToUseForPartials = options.renderer;

	if (rendererToUseForPartials !== undefined && typeof rendererToUseForPartials !== 'function')
	{
		throw new Error('Partial renderer must be a function.');
	}

	return (pathToTemplateFile, model, callback) =>
	{
		function done (error, result)
		{
			// If caching is disabled, we need to clear the
			// `require` cache for all the files in the Express
			// view folder.
			if (model.settings['view cache'] === false)
			{
				clearRequireCacheInDirectory(
					model.settings['views']
				);
			}

			callback(error, result);
		}

		let template;

		try // to require template file.
		{
			template = require(pathToTemplateFile);
		}
		catch (requireTemplateError)
		{
			done(
				new Error(`An error occurred whilst fetching the function template at "${pathToTemplateFile}". ${requireTemplateError}`)
			);

			return;
		}

		let result;

		try // to render template with data.
		{
			result = this.render(template, model, rendererToUseForPartials);
		}
		catch (renderTemplateError)
		{
			done(
				new Error(`An error occurred whilst rendering the function template found at ${pathToTemplateFile}. ${renderTemplateError}`)
			);

			return;
		}

		done(null, result);
	};
}

// --------------------------------------------------------

module.exports = { create, render };
