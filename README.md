# Template Function Express Engine

[![Available from NPM](https://img.shields.io/npm/v/template-function-express-engine.svg?maxAge=900)](https://www.npmjs.com/package/template-function-express-engine)
[![Built using Travis](https://img.shields.io/travis/lsphillips/TemplateFunctionExpressEngine/master.svg?maxAge=900)](https://travis-ci.org/lsphillips/TemplateFunctionExpressEngine)

A simple Express engine for template functions.

## What is a template function?

A template function is just a function that returns a string:

``` js
function sayHelloAndIntroduceMyself (name)
{
	return `Hello. My name is ${name}`;
}
```

Template functions are effective because they are just ordinary functions written in JavaScript; partials and layouts are achieved simply by calling another function that you can bring in using `require()` (which comes with the benefit of a free cache).

Furthermore they remove the performance overhead introduced by compiling and additional complexity introduced by learning a new syntax.

## Usage

You can hook up this engine into Express using `express#engine()`.

``` js
const path                          = require('path');
const express                       = require('express');
const templateFunctionExpressEngine = require('template-function-express-engine');

express()

	.engine(
		'js', templateFunctionExpressEngine.createEngine()
	)

	.set(
		'views', path.join(__dirname, 'path/to/templates')
	)

	.set('view engine', 'js');
```

Your template functions must be synchronous and accept at least one argument which will be an object map containing the template variables. For example:

``` js
module.exports = function (model)
{
	return `Hello, my name is ${model.name}`;
};
```

### Partials

You may be tempted to call your partial template functions directly (as mentioned above), like so:

``` js
const address = require('./partials/adress');

module.exports = function (model)
{
	return `Hello, my name is ${model.name}, I live at ${ address(model.address) }`;
};
```

This does the job, but it hurts the testability of the template function; you can't completely unit test it without knowing what the `address` partial returns.

It is recommended to use the renderer provided to each template function instead:

``` js
const address = require('./partial/address');

module.exports = function (model, render)
{
	return `Hello, my name is ${model.name}, ${ render(address, model.address) }`;
};
```

It is a subtle change, but you can now test the template function by executing it with a renderer of your own, allowing you to assert that the `address` partial was rendered without knowing what is returned.

The default renderer provided by the engine is `templateFunctionExpressEngine.renderTemplateFunction()` (the same method that renders your template functions). You can provide your own partial template renderer at engine creation:

``` js
templateFunctionExpressEngine.createEngine(
{
	rendererForPartials (template, model)
	{
		// ...
	}
});
```

This is useful if you want to render specific partials using a different rendering technology, i.e. `React`.

``` js
templateFunctionExpressEngine.createEngine(
{
	rendererForPartials : function rendererForPartials (template, model)
	{
		if (template.prototype instanceof React.Component)
		{
			return ReactDOM.renderToString(
				React.createElement(template, model)
			);
		}

		return templateFunctionExpressEngine.renderTemplateFunction(template, model, rendererForPartials);
	}
});
```

### A note on caching

For development, it is useful to update your templates without restarting your application. You can do this with Express:

``` js
anExpressApplication.disable('view cache');
```

This engine will respect this setting; as it uses `require()` it will clear the `require` cache for files in the view directory (specified by the Express `views` setting).

## Getting started

This project is available through the Node Package Manager (NPM), so you can install it like so:

``` sh
npm install template-function-express-engine
```

**Please Note:** Versions of Node lower than v6.0.0 are not supported, this is because it is written using ECMAScript 6 features.

## Development

This project doesn't have much of a build process. It does have tests though; which you can run through NPM like so:

``` sh
npm test
```

This also runs code quality checks using ESLint. Please refer to the `.eslintrc` file to familiar yourself with the rules.

**Please Note:** This requires a POSIX compliant environment to run.

## License

This project is released under the MIT license.
