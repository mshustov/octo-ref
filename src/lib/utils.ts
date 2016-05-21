/// <reference path="../../typings/vendors.d.ts" />

export const endsWith = (str:string, end:string) : boolean=> {
    const index = str.lastIndexOf(end);
    return str.slice(index) === end;
}

export const toArray = (iterable: any): any[] =>
    Array.prototype.slice.apply(iterable);
