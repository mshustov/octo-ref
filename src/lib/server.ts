// right now it's going to work only for a file
import * as ts from 'typescript';

import VFS from './vfs';

const getLsHost = (vfs:VFS) : ts.LanguageServiceHost => {
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
            getScriptFileNames : () => vfs.getFileNames(),
            getScriptSnapshot: (filename) => {
                const content = vfs.getFile(filename);
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
    vfs: VFS
    ls: ts.LanguageService
    linkCounter: { [key: string]: number }
    constructor() {
        this.vfs = new VFS();
        const lsHost: ts.LanguageServiceHost = getLsHost(this.vfs);

        this.ls = ts.createLanguageService(lsHost, ts.createDocumentRegistry());
        this.linkCounter = {};
    }

    getDefinition(filename, line, col, content){
        this.vfs.addFile(filename, content); // kludge since sometimes browser reset content;

        const sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.Latest) as ts.SourceFile;
        const pos = ts.getPositionOfLineAndCharacter(sourceFile, line, col);
        const highlights = this.ls.getDocumentHighlights(filename, pos, [filename]);

        // const result = null;
        const result = highlights 
            ? highlights[0].highlightSpans.map(({kind, textSpan}) => {
                const {line, character} = ts.getLineAndCharacterOfPosition(
                    // this.ls.getSourceFile(filename),
                    sourceFile,
                    textSpan.start
                );
                return {
                    kind,
                    start: {line, character}, // ts counts from 0?
                    length: textSpan.length
                }
            })
            : null;
        return result;
    }
}

export default Server;
