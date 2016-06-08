# Template Function Express Engine

![Travis Build Status](https://travis-ci.org/lsphillips/TemplateFunctionExpressEngine.svg?branch=master)

A simple Express engine for function templates.

## What is a function template?

A function template is just a function that returns a string:

``` js
function sayHelloAndIntroduceMyself (name)
{
	return `Hello. My name is ${name}`;
}
```

Function templates are effective because they are just ordinary functions written in JavaScript; partials and layouts are achieved simply by calling another function that you can bring in using `require()` (which comes with the benefit of a free cache).

Furthermore they remove the performance overhead introduced by compiling. They also remove additional complexity introduced by learning a new syntax and bespoke pattern(s) to extend a template language.

## Usage

You can hook up this engine into Express like any other engine:

``` js
const path                          = require('path');
const express                       = require('express');
const templateFunctionExpressEngine = require('template-function-express-engine');

express()

	.engine('js', templateFunctionExpressEngine)

	.set(
		'views', path.join(__dirname, 'path/to/templates')
	)

	.set('view engine', 'js');
```

Your function templates must be synchronous and accept a single argument which will be an object map containing the template variables:

``` js
module.exports = function (data)
{
	return `Hello, my name is ${data.name}`;
};
```

### A note on caching

For development, it is useful to update your templates without restarting your application. You can do this with Express:

``` js
anExpressApplication.disable('view cache');
```

This engine will honour this setting; as it uses `require()`, it will clear the `require` cache for files in the view directory (specified by the Express `views` setting).

## Getting started

This project is available through the Node Package Manager (NPM), so you can install it like so:

``` sh
npm install template-function-express-engine
```

**Please Note:** Versions of Node lower than v4.0.0 are not supported, this is because it is written using ECMAScript 6 features.

## Development

This project doesn't have much of a build process. It does have tests though; which you can run through NPM like so:

``` sh
npm test
```

This also runs code quality checks using ESLint. Please refer to the `.eslintrc` file to familiar yourself with the rules.

## License

This project is released under the MIT license.
