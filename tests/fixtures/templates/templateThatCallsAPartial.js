'use strict';

// Partials
// --------------------------------------------------------

const partialTemplateWithNoParameters = require('./partials/partialTemplateWithNoParameters.js');

// --------------------------------------------------------

module.exports = function ()
{
	return `This is a template. ${ templatePartialWithNoParameters() }`;
};
