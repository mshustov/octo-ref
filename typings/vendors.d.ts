declare module "react-color" {
    export var CompactPicker: any;
}

declare module "github-injection" {
    var injection: (window: Window, cb: () => void) => any;
    export = injection
}

declare module "object-assign" {
    var assign: (target: any, ...sources: any[]) => any;
    export = assign
}

declare function require(string): any;

declare interface OctoRef {
    // root: HTMLElement;
    constructor(root: HTMLElement, Adapter: GihubDomAPI, config: any)
    addHandlers(): void
    removeHandlers(): void
    _handleMousedown(e: MouseEvent): void
    _handleClick(e: MouseEvent): void
    _handleKeyup(e: KeyboardEvent): void
    clean(): void
    findDefinition(shouldJumpToDefinition: boolean): void
    send(cmd: string, data: any, cb: () => void)
    showDefinition(shouldJumpToDefinition: boolean, data: Highlight[])
}

declare interface Syncer {
    getData(rule: string, cb: (data: any) => void): void
    setData(any, cb: () => void): void
    getDataSetDefault(rule: string, defaultValue: any, cb: (data: any) => void): void
    subscribe(rule: string, cb: (data: any) => void): void
}

declare interface GetTemplate {
    (selector: string, color: string): string
}

declare interface File {
    selector: string,
    color: string
}

declare interface VFS {
    cache: {[key: string]: string}
    getFileNames(): string[]
    addFile(filename: string, content: string): void // switch to File
    removeFile(filename: string): void
    getFile(filename: string): void
}


declare interface Styler {
    sheet: CSSStyleSheet
    getTemplate: GetTemplate
    constructor(getTemplate: GetTemplate)
    updateStyle(styles: { refColor : string, defColor: string}): void
    removeRules(): void
}

interface Location {
    line: number;
    character: number;
}

interface Highlight {
    kind: string;
    length: number;
    start: Location
}

interface OffsetElem {
    elem: HTMLElement;
    offset: number;
}

declare interface Server {
    constructor()
    vfs: VFS
    linkCounter: { [key: string]: number }
    // ls: typescript.LanguageService
    addFile(filename: string, content: string): void
    removeFile(filename: string): void
    getDefinition(filename: string, line: number, col: number): Highlight[]
}

declare interface GihubDomAPI {
    constructor(window: Window)
    window: Window
    root: HTMLElement
    fileContent: string
    fileName: string
    getRoot(): HTMLElement
    isCodePage(): boolean
    getFileContent(): string
    getFilename(): string
    subscribe(event: string, fn: (e: Event) => void): void
    unsubscribe(event: string, fn: (e: Event) => void): void
    clean(selectors: string[]): void
    getElem(): HTMLElement
    getElemLength(elem: HTMLElement): number
    getElemPosition (elem: HTMLElement): Location
    getLineNumber(elem: HTMLElement): number
    getEndColumnPosition(elem: HTMLElement): number

    _iterateUnitlOffset(root: HTMLElement, endOffset: number): OffsetElem
    _createDOMWrapper(className: string): HTMLElement
    _createHighlightDOMWrapper(elem: HTMLElement, position: Location, className: string): void
    _getDOMMappring(data: Highlight): OffsetElem
    highlight(data: Highlight, {className: string}): void
    jumpToDefinition(data: Highlight): void
}
