'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const templateThatIsAPartial = require('./templateThatIsAPartial');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function templateThatUsesAPartial ()
{
	return `This is a template that uses a template partial. ${ templateThatIsAPartial() }`;
};
