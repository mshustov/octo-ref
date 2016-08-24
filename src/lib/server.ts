// right now it's going to work only for a file
import * as ts from 'typescript';
import * as objectAssign from 'object-assign';

import VFS from './vfs.ts';

class Server{
    vfs: VFS
    ls: ts.LanguageService
    linkCounter: { [key: string]: number }
    constructor() {
        this.vfs = new VFS();
        const lsHost: ts.LanguageServiceHost = {
            getCompilationSettings : () => {
                const options = ts.getDefaultCompilerOptions();
                return objectAssign(options, {
                    allowJs: true,
                    allowNonTsExtensions: true,
                    noResolve: true,
                    removeComments: false
                });
            },
            getScriptFileNames : () => this.vfs.getFileNames(),
            getScriptSnapshot: (filename) => {
                const content = this.vfs.getFile(filename);
                if(content) {
                    const snapshot = ts.ScriptSnapshot.fromString(content) as ts.IScriptSnapshot;
                    return snapshot;
                }
                return null;
            },
            getScriptVersion: () => '1',
            getCurrentDirectory: () => '',
            getDefaultLibFileName : () => {
                const options = ts.getDefaultCompilerOptions();
                return ts.getDefaultLibFileName(options);
            }
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

// ts.getLineAndCharacterOfPosition(this.ls.getSourceFile(filename), 1348)  - get {ch, line}
// this.ls.getDocumentHighlights(filename, 1348, [filename]) - get highlight


    getDefinition(filename, line, col){
        // line, col --> pos on github level
        const sourceFile = this.ls.getSourceFile(filename) as ts.SourceFile;
        debugger;
        const pos = ts.getPositionOfLineAndCharacter(sourceFile, line - 1, col - 1);
        const highlights = this.ls.getDocumentHighlights(filename, pos, [filename]);
        const result = highlights ?
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
