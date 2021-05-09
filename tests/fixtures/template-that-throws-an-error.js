'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function templateThatThrowsAnError ()
{
	throw new Error('This is a template that throws an error.');
};
