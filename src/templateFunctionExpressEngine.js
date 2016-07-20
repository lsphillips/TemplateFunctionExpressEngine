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

module.exports = function (pathToTemplateFile, options, callback)
{
	function done (error, result)
	{
		// If caching is disabled, we need to clear the `require`
		// cache for all the files in the Express view folder.
		if (options.cache === false)
		{
			clearRequireCacheInDirectory(options.settings.views);
		}

		callback(error, result);
	}

	// 1) Require
	// -------------------------------------------------------

	let template;

	try // to require template file.
	{
		template = require(pathToTemplateFile);
	}
	catch (requireTemplateError)
	{
		done(
			new Error(`An error occurred whilst fetching the function template at ${pathToTemplateFile}. ${requireTemplateError}`)
		);

		return;
	}

	// Ensure the template is a function, otherwise throw a
	// complaint.
	if (typeof template !== 'function')
	{
		done(
			new TypeError(`The function template found at ${pathToTemplateFile} is not valid. It must be a function.`)
		);

		return;
	}

	// 2) Render
	// -------------------------------------------------------

	let result;

	try // to render template with data.
	{
		result = template(options);
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
