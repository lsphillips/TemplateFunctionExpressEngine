'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const express = require('express');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function createViewEngineTestingServer (pathToViewDirectory)
{
	return express()

		.get('/render/a/template', function (request, response)
		{
			response.render('template');
		})

		.get('/render/a/template/using/a/model', function (request, response)
		{
			response.render('template-that-uses-a-model', {
				value : 'This is a template model value.'
			});
		})

		.get('/render/a/template/using/a/partial', function (request, response)
		{
			response.render('template-that-uses-a-partial');
		})

		.get('/render/a/template/that/does/not/exist', function (request, response)
		{
			response.render('template-that-does-not-exist');
		})

		.get('/render/a/template/that/is/invalid', function (request, response)
		{
			response.render('template-that-is-invalid');
		})

		.get('/render/a/template/that/throws/an/error', function (request, response)
		{
			response.render('template-that-throws-an-error');
		})

		// Miss.
		.use(function (request, response)
		{
			response.status(404).send();
		})

		// Error.
		.use(function (error, request, response, next) // eslint-disable-line no-unused-vars
		{
			response.status(500).send();
		})

		.set('views', pathToViewDirectory);
};
