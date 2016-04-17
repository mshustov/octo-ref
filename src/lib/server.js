// right now it's going to work only for a file
import ts from 'typescript';
import VFS from './vfs.js';

class Server{
    constructor(options) {
        this.vfs = new VFS();
        var lsHost = {
            // getCompilationSettings : function(){ return Object.assign(ts.getDefaultCompilerOptions(), { noResolve: true }) },
            getCompilationSettings : () => {
                return Object.assign(ts.getDefaultCompilerOptions(), {
                    noResolve: true,
                    allowNonTsExtensions: true,
                    allowJs: true
                });
            },
            getScriptFileNames : () => this.vfs.getFileNames(),
            getScriptSnapshot: (filename) => {
                var content = this.vfs.getFile(filename);
                return content ? ts.ScriptSnapshot.fromString(content) : '';
            },
            getScriptVersion: () => '1',
            getScriptIsOpen: () => false,
            getCurrentDirectory: () => '',
            getDefaultLibFileName : () => ts.getDefaultLibFileName(ts.getDefaultCompilerOptions())
        }
        this.ls = ts.createLanguageService(lsHost, ts.createDocumentRegistry());
        this.linkCounter = {};
    }

    addFile(filename, content){
        this.linkCounter[filename] = (this.linkCounter[filename] || 0) + 1;
        this.vfs.addFile(filename, content);
    }

    removeFile(filename){
        this.linkCounter[filename] -= 1;
        if (this.linkCounter[filename] === 0) {
            this.vfs.removeFile(filename);
        }
    }

    getDefinition(filename, line, col){
        // line, col --> pos on github level
        var pos = ts.getPositionOfLineAndCharacter(this.ls.getSourceFile(filename), line - 1, col - 1);
        var highlights = this.ls.getDocumentHighlights(filename, pos, [filename]);
        var result = highlights ? 
            highlights[0].highlightSpans.map(({kind, textSpan}) => {
                const {line, character} = ts.getLineAndCharacterOfPosition(this.ls.getSourceFile(filename), textSpan.start);
                return {
                    kind,
                    start: {line: line + 1, character}, // ts counts from 0?
                    length: textSpan.length
                }
            }):
            null;
        return result;
    }
}

export default Server;
