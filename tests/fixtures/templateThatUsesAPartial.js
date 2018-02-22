'use strict';

// Dependencies
// --------------------------------------------------------

const templateThatIsAPartial = require('./templateThatIsAPartial');

// --------------------------------------------------------

module.exports = function templateThatUsesAPartial ({ name })
{
	return `Hello ${name}. ${ templateThatIsAPartial() }`;
};
