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

declare interface ActionsToDo {
    highlightOnly: boolean,
    jumpToNextUsage: boolean,
    jumpToDefinition: boolean
}

declare interface OctoRef {
    // root: HTMLElement;
    constructor(root: HTMLElement, Adapter: GithubDomAPI, config: any)
    addHandlers(): void
    removeHandlers(): void
    handleMousedown(e: MouseEvent): void
    handleClick(e: MouseEvent): void
    handleKeyup(e: KeyboardEvent): void
    clean(): void
    findDefinition(shouldJumpToDefinition: boolean): void
    send(cmd: string, data: any, cb: () => void)
    highlight(actionsToDo: ActionsToDo, data: Highlight[], position: Location)
}

declare interface Syncer {
    remove(rule: string): void
    getData(rule: string, cb: (data: any) => void): void
    setData(rule: string, data: any, cb?: () => void): void
    subscribe(rule: string, cb: (data: any) => void): void
}

declare interface GetTemplate {
    (selector: string, color: string): string
}

declare interface File {
    selector: string,
    color: string
}

declare interface FileCache {
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
    filecache: FileCache
    // ls: typescript.LanguageService
    addFile(filename: string, content: string): void
    removeFile(filename: string): void
    getDefinition(filename: string, line: number, col: number, content: string): Highlight[]
}

declare interface GithubDomAPI {
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
    getSelectedElemPosition():Location

    getElem(): Element
    getElemLength(elem: Node): number
    getElemPosition (elem: Element): Location
    getLineNumber(elem: Element): number
    getEndColumnPosition(elem: Element): number

    _iterateUnitlOffset(root: Element, endOffset: number): OffsetElem
    _createDOMWrapper(className: string): Element
    _createHighlightDOMWrapper(elem: Element, position: Location, className: string): void
    _getDOMMappring(data: Highlight): OffsetElem
    highlight(data: Highlight, {className: string}): void
    jumpToDefinition(data: Highlight): void

    checkIsNextUsage (item: Highlight, currentPosition: Location): boolean
    normalizeToAdapterFormat(data: Highlight) :Highlight
    normalizeFromAdapterFormat(data: Highlight) :Highlight
}
