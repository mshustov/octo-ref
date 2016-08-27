/// <reference path="../../typings/vendors.d.ts" />

export const endsWith = (str:string, end:string) : boolean=> {
    const index = str.lastIndexOf(end);
    return str.slice(index) === end;
}

export const toArray = (iterable: any): any[] =>
    Array.prototype.slice.apply(iterable);

// NOTE: late could be moved in settings
export const controlKey = {
    alt: 'altKey',
    cmd: 'metaKey'
}

export enum keyCode {
    ESC = 27
}
