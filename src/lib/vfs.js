class VFS{
    constructor() {
        this.cache = {};
    }

    getFileNames(){
        return Object.keys(this.cache);
    }

    addFile(filename, content, isDefaultLib) {
        this.cache[filename] = content;
    }

    removeFile(filename) {
        delete this.cache[filename];
    }

    getFile(filename) {
        return this.cache[filename];
    }
}

export default VFS;
