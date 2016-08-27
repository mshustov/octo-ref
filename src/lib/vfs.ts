///<reference path="../../typings/vendors.d.ts"/>

class VFS implements VFS{
    cache: {[key: string]: string}

    constructor() {
        this.cache = {};
    }

    getFileNames(){
        return Object.keys(this.cache);
    }

    addFile(filename, content) {
        console.log('---ADD---', filename);
        this.cache[filename] = content;
    }

    removeFile(filename) {
        console.log('---REMOVE---', filename);
        delete this.cache[filename];
    }

    getFile(filename) {
        return this.cache[filename];
    }
}

export default VFS;
