'use strict';

// Dependencies
// --------------------------------------------------------

const express = require('express');

// --------------------------------------------------------

module.exports = function createTemplateEngineTestingServer (pathToTemplateDirectory)
{
	return express()

		.get('/render/a/template', function (_, response)
		{
			response.render('template');
		})

		.get('/render/a/template/using/a/model', function (_, response)
		{
			response.render('templateThatUsesAModel', {
				name : 'Luke'
			});
		})

		.get('/render/a/template/using/a/partial', function (_, response)
		{
			response.render('templateThatUsesAPartial', {
				name : 'Maria'
			});
		})

		.get('/render/a/template/that/does/not/exist', function (_, response)
		{
			response.render('templateThatDoesNotExist');
		})

		.get('/render/a/template/that/is/invalid', function (_, response)
		{
			response.render('templateThatIsInvalid');
		})

		.get('/render/a/template/that/throws/an/error', function (_, response)
		{
			response.render('templateThatThrowsAnError');
		})

		.set('views', pathToTemplateDirectory);
};
