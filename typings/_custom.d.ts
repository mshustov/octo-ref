declare module "react-color" {
    export var CompactPicker: any;
}

declare module "github-injection" {
    var injection: (window: Window, cb: () => void) => any;
    export = injection
}

declare module "object-assign" {
    var assign: (target: any, ...sources: any[]) => any;
    export = assign
}

declare function require(string): any;
