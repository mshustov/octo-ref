// https://github.com/Microsoft/TypeScript/blob/2.1/lib/typescript.d.ts
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

import * as ts from 'typescript';

import FileCache from './file-cache';

const getLsHost = (filecache:FileCache) : ts.LanguageServiceHost => {
    const lsHost: ts.LanguageServiceHost = {
            getCompilationSettings : () => {
                const options = ts.getDefaultCompilerOptions();
                return Object.assign(options, {
                    allowJs: true,
                    allowNonTsExtensions: true,
                    noResolve: true,
                    removeComments: false
                });
            },
            getScriptFileNames : () => filecache.getFileNames(),
            getScriptSnapshot: (filename) => {
                const content = filecache.getFile(filename);
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

    return lsHost;
}

class Server{
    filecache: FileCache
    ls: ts.LanguageService
    constructor() {
        this.filecache = new FileCache();
        const lsHost: ts.LanguageServiceHost = getLsHost(this.filecache);

        this.ls = ts.createLanguageService(lsHost, ts.createDocumentRegistry());
    }

    getDefinition(filename, line, col, content){
        try{
            this.filecache.addFile(filename, content); // kludge since sometimes browser reset content

            const sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.Latest) as ts.SourceFile;
            const pos = ts.getPositionOfLineAndCharacter(sourceFile, line, col);
            const highlights = this.ls.getDocumentHighlights(filename, pos, [filename]);

            if(!highlights){
                return null;
            }

            return highlights[0].highlightSpans.map(({kind, textSpan}) => {
                const {line, character} = ts.getLineAndCharacterOfPosition(sourceFile, textSpan.start);
                return {
                    kind,
                    start: {line, character},
                    length: textSpan.length
                }
            });
        } finally {
            this.filecache.removeFile(filename);
        }
    }
}

export default Server;
