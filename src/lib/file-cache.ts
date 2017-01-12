///<reference path="../../typings/vendors.d.ts"/>

class FileCache implements FileCache{
    cache: {[key: string]: string}

    constructor() {
        this.cache = {};
    }

    getFileNames(){
        return Object.keys(this.cache);
    }

    addFile(filename, content) {
        this.cache[filename] = content;
    }

    removeFile(filename) {
        delete this.cache[filename];
    }

    getFile(filename) {
        return this.cache[filename];
    }
}

export default FileCache;
