export interface Module {
    readonly name : string,
    readonly source : {}[],
    readonly dependencies : string[],
    readonly sourceMap? : {}
}

export interface File {
    readonly name : string,
    readonly contents : string,
    readonly sourceMap? : {}
}

export interface Dependency {
    readonly name : string,
    readonly requiredBy : string,
    readonly path : string
}