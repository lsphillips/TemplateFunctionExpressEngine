# Template Function Express Engine

[![Available from NPM](https://img.shields.io/npm/v/template-function-express-engine.svg?maxAge=900)](https://www.npmjs.com/package/template-function-express-engine)
[![Built using Travis](https://img.shields.io/travis/com/lsphillips/TemplateFunctionExpressEngine/master.svg?maxAge=900)](https://travis-ci.com/lsphillips/TemplateFunctionExpressEngine)

An Express engine for template functions.

## What is a template function?

A template function is just a function that returns a string:

``` js
function anExampleTemplateFunction ()
{
	return 'I am a template function.';
}
```

Template functions are useful because they are just ordinary functions written in JavaScript; partials and layouts are achieved simply by calling another function and there is no performance overhead by introducing a new syntax.

## Usage

You can hook up this engine into Express using `express#engine()`:

``` js
const express          = require('express');
const { createEngine } = require('template-function-express-engine');

express()

	.engine(
		'js', createEngine()
	)

	.set('view engine', 'js');
```

Your template file must export a synchronous function that returns a string and accepts one argument which will be representing the model. For example:

``` js
module.exports = function greetings ({ firstName, lastName })
{
	return `Hello, my name is ${firstName} ${lastName}.`;
};
```

### Caching

For development, it is useful to update your templates without restarting the web server. This engine will respect the `view cache` setting.

## Getting started

This project is available through the Node Package Manager (NPM), so you can install it like so:

``` sh
npm install template-function-express-engine
```

**Please Note:** Versions of Node lower than **v7.0.0** are not supported.

## Development

This project doesn't have much of a build process. It does have tests though; which you can run like so:

``` sh
npm test
```

This also runs code quality checks using ESLint. Please refer to the `.eslintrc` files to familiar yourself with the rules.

## License

This project is released under the MIT license.
