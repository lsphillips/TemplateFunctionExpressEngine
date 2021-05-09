'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const templateThatIsAPartial = require('./template-that-is-a-partial');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function templateThatUsesAPartial ()
{
	return `This is a template that uses a template partial. ${ templateThatIsAPartial() }`;
};
