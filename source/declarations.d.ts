declare module "recast" {
    class Types{
        builders: {
            program(source : {}) : {}
            literal(value : string | null) : {},
            identifier(value : string) : {},
            memberExpression(method : {}, target : {}, b : boolean) : {},
            callExpression(value : {}, arguments : {}[]) : {}
        }
    }

    export function parse(source : string, options : any) : {}
    export function print(ast : {}, options : any) : {code : string, map : {}}
    export const types : Types;
}

declare module "slash" {
    const slash : (input : string) => string;
    export = slash
}

declare module "strip-bom" {
    const strip : (input : string) => string;
    export = strip
}

declare module "toposort" {
    export function array(nodes : string[], edges : [string, string][]) : string[]
}

declare module "ast-traverse" {
    const traverse : (astExpression : any, options : {}) => void;
    export = traverse;
}

declare module "requirejs" {
    interface Context {
        toUrl(path : string) : string
    }
    const requirejs : (config : {}) => Context;
    export = requirejs
}