export interface Module {
    readonly name : string,
    readonly source : {}[],
    readonly dependencies : string[],
    readonly file : File
}

export interface File {
    readonly name : string,
    readonly contents : string,
    readonly relative : string,
    readonly source : string,
    readonly sourceMap : {}
}

export interface Dependency {
    readonly name : string,
    readonly requiredBy : string,
    readonly path : string
}