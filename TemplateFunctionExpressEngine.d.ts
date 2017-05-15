// Type definitions for TemplateFunctionExpressEngine
// --------------------------------------------------------

export interface PartialRenderingFunction
{
	(template : any, model : any, rendererForPartials? : PartialRenderingFunction) : string;
}

// --------------------------------------------------------

export interface TemplateFunction
{
	(model : any, rendererForPartials : PartialRenderingFunction) : string;
}

// --------------------------------------------------------

export interface EngineOptions
{
	rendererForPartials? : PartialRenderingFunction;
}

// --------------------------------------------------------

export function createEngine(options? : EngineOptions) : Function;

// --------------------------------------------------------

export function renderTemplateFunction(template : TemplateFunction, model : any, rendererForPartials? : PartialRenderingFunction) : string;
