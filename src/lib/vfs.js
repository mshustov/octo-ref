function VFS() {
    this.cache = {};
}

VFS.prototype.getFileNames = function(){
    return Object.keys(this.cache);
}

VFS.prototype.addFile = function(filename, content, isDefaultLib) {
    this.cache[filename] = content;
}

VFS.prototype.removeFile = function(filename) {
    delete this.cache[filename];
}

VFS.prototype.getFile = function(filename) {
    return this.cache[filename];
}

module.exports = VFS
