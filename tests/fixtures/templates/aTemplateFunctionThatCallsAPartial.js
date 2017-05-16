'use strict';

// Partials
// --------------------------------------------------------

const aPartialTemplateFunction = require('./partials/aPartialTemplateFunction');

// --------------------------------------------------------

module.exports = function (model, render)
{
	return `Hello ${ render(aPartialTemplateFunction) }`;
};
