'use strict';

// --------------------------------------------------------

module.exports = function templateThatThrowsAnError ()
{
	throw new Error('An unexpected error occurred.');
};
