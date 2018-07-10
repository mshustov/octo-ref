import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import {GITHUB} from '../src/adapter/github'
import config from '../src/config'

const definitionClass = config.className.definition
const referenceClass = config.className.reference

const pageUrl = 'https://github.com/restrry/octo-ref/blob/master/tests/fixtures/github-page.js';

const width = 1400;
const height = 1200;
jest.setTimeout(1000000);

const isCI = Boolean(process.env.CI)
const logError = err => console.error(err)
const logConsole = msg => console.log(msg.text())

describe('e2e tests', function() {
    let browser: puppeteer.Browser
    let page: puppeteer.Page
    beforeEach(async function() {
        browser = await puppeteer.launch({
            devtools: !isCI,
            // travis doesn't support to run chrome in headful mode, but extension testing is available only in headful mode
            headless: false,
            slowMo: 0,
            args: [
                ...(isCI ? [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                ] : []),
                `--window-size=${width},${height}`,

                '--disable-extensions-except=./dist/',
                '--load-extension=./dist/',
            ]
        });
        page = await browser.newPage();
        page.on('error', logError);
        page.on('pageerror', logError);
        page.on('console', logConsole);

        await page.setViewport({ width, height });
        await page.setBypassCSP(true);
        await page.goto(pageUrl);
        // some artificial delay to wait for extension to initialize
        await page.waitFor(3000)
    });

    afterEach(() => {
        page.removeListener('error', logError);
        page.removeListener('pageerror', logError);
        page.removeListener('console', logConsole);
        browser.close();
    });

    it('Highlight definition with Alt + Click combination', async function() {
        await page.keyboard.down('Alt');
        await page.click('#LC13 > .pl-smi');
        await page.keyboard.up('Alt');

        await page.waitForSelector(`.${definitionClass}`);

        function runner() {
            const elem: HTMLElement = document.querySelector('#LC13 > .pl-smi');
            return Array.from(elem.classList)
        }

        const classList = await page.evaluate(runner)
        expect(classList).toContain(definitionClass)
    });

    it('Highlight definition and references with Alt + Click combination', async function() {
        await page.keyboard.down('Alt');
        await page.click('#LC21 > .pl-smi');
        await page.keyboard.up('Alt');

        await page.waitForSelector(`.${definitionClass}`);

        function runner(definitionClass, referenceClass) {
            const defElem: HTMLElement = document.querySelector(`#LC21 > .${definitionClass}`);
            const refElem: HTMLElement = document.querySelector('#LC21 > .pl-smi');

            return [
                defElem && defElem !== refElem,
                refElem.classList.contains(referenceClass)
            ]
        }

        const [definitionFound, referenceFound] = await page.evaluate(runner, definitionClass, referenceClass)
        expect(definitionFound).toBe(true);
        expect(referenceFound).toBe(true);
    });

    it('Wrap text node in span for highlighting purposes', async function() {
        await page.keyboard.down('Alt');
        await page.click('#LC21 > .pl-smi');
        await page.keyboard.up('Alt');

        await page.waitForSelector(`.${definitionClass}`);

        function runner(definitionClass, wrapperClass) {
            const defElem: HTMLElement = document.querySelector(`#LC21 > .${definitionClass}`);

            return defElem.classList.contains(wrapperClass)
        }

        const isWrapped = await page.evaluate(runner, definitionClass, GITHUB.WRAPPER)
        expect(isWrapped).toBe(true);
    });
});

const scriptFilePath = path.resolve(__dirname, 'dist/js/adapter.js')
const scriptFile = fs.readFileSync(scriptFilePath, 'utf8')

function setSelection(window: Window, elem: Node): void {
    const rng = window.document.createRange();
    rng.selectNode(elem)
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rng);
}

function createAdapter (): GithubDomAPI {
    const Adapter = window.adapter.default
    return new Adapter(window)
}

describe('unit tests', function() {
    let browser: puppeteer.Browser
    let page: puppeteer.Page
    beforeEach(async function() {
        browser = await puppeteer.launch({
            devtools: !isCI,
            // travis doesn't support to run chrome in headful mode, but extension testing is available only in headful mode
            headless: isCI,
            slowMo: 0,
            args: [
                ...(isCI ? [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                ] : []),
                `--window-size=${width},${height}`
            ]
        });
        page = await browser.newPage();
        page.on('error', logError);
        page.on('pageerror', logError);
        page.on('console', logConsole);

        await page.setViewport({ width, height });
        // we want to inject our script on the page, so we disable CSP
        await page.setBypassCSP(true);
        await page.goto(pageUrl);

        page.addScriptTag({
            content: scriptFile
        });

        // add helpers
        page.addScriptTag({
            content: [
                setSelection,
                createAdapter
            ].map(f => f.toString()).join(';')
        });

        // some artificial delay to wait for injected script to initialize
        await page.waitFor(3000)
    });

    afterEach(() => {
        page.removeListener('error', logError);
        page.removeListener('pageerror', logError);
        page.removeListener('console', logConsole);
        browser.close();
    });

    it('#getRoot should return root html element', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const root = adapter.getRoot()
            return root instanceof HTMLElement
        }
        const rootIsInstanceOfHTML = await page.evaluate(runner)
        expect(rootIsInstanceOfHTML).toBe(true);
    })

    it('#getFilename should resolve filename', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const filename = adapter.getFilename();
            const fnBeginsAt = filename.lastIndexOf('/');
            return filename.slice(fnBeginsAt)
        }

        const filename = await page.evaluate(runner)
        expect(filename).toBe('/github-page.js');
    })

    it('#getLineNumber should return line number', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
            const lineNumber = adapter.getLineNumber(elem);
            return lineNumber
        }

        const lineNumber = await page.evaluate(runner)
        expect(lineNumber).toBe(13);
    })

    it.skip('#getElem should return the deepest selected element', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
            window.setSelection(window, elem);
            const selectedElem = adapter.getElem(); // textNode, childNode of elem

            return selectedElem === elem.childNodes[0]
        }

        const isDeepestElementReturned = await page.evaluate(runner)
        expect(isDeepestElementReturned).toBe(true);
    })

    it('#getElemPosition should return object with position on element. shape {line, character}', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
            const selectedElem = adapter.getElemPosition(elem);
            return selectedElem
        }

        const elemPosition = await page.evaluate(runner)
        expect(elemPosition).toEqual({ line: 13, character: 15 });
    });

    it('#getEndColumnPosition should return end last position for element', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const elem = window.document.getElementById('LC13').querySelector('.pl-en'); // greet
            const charNumberWithoutSelection = adapter.getEndColumnPosition(elem);

            window.setSelection(window, elem);
            const charNumberWithSelection = adapter.getEndColumnPosition(elem);

            return {
                charNumberWithoutSelection,
                charNumberWithSelection
            }
        }
        const positions = await page.evaluate(runner)
        expect(positions).toEqual({
            charNumberWithoutSelection: 9,
            charNumberWithSelection: 12
        });
    });

    it('#getElemLength should return length of elem content', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const elem: HTMLElement = window.document.getElementById('LC21').querySelector('.pl-c1'); // join
            const contentLengthForELEM_NODE = adapter.getElemLength(elem);
            const contentLengthForTEXT_NODE = adapter.getElemLength(elem.nextSibling);

            return {
                contentLengthForELEM_NODE,
                contentLengthForTEXT_NODE
            }
        }

        const lengths = await page.evaluate(runner)
        expect(lengths).toEqual({
            contentLengthForELEM_NODE: 4, // 'null'
            contentLengthForTEXT_NODE: 11 // ', options);'
        });
    });

    it('#subscribe/#unsubscribe should subscribe/unsubscribe on event ', async function() {
        function runner() {
            const adapter = window.createAdapter()

            let counter = 0
            const callback = () => counter++
            const elem = window.document.getElementById('LC17').querySelector('.pl-c1') as HTMLElement;
    
            adapter.subscribe('click', callback);
            elem.click();
    
            adapter.unsubscribe('click', callback);
            elem.click();
            return counter
        }

        const calledCounter = await page.evaluate(runner)
        expect(calledCounter).toBe(1);
    });

    it('#show should add class name (wrap text node)', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const refsTextNode = {
                kind: 'writtenReference',
                start: {character: 4, line: 2} as Location, // hello
                length: 5
            };
            const optionsTextNode = {className: 'test-classname1'};
    
            adapter.highlight(refsTextNode, optionsTextNode);
            const selectedTextNode = window.document.querySelector('.test-classname1') as HTMLElement;
            const textTextNode = selectedTextNode.innerText

            const refsElemNode = {
                kind: 'writtenReference',
                start: {character: 8, line: 21} as Location, // greet
                length: 5
            }
            const optionsElemNode = {className: 'test-classname2'};
            adapter.highlight(refsElemNode, optionsElemNode);
            const selectedElemNode = window.document.querySelector('.test-classname2') as HTMLElement;
            const textElemNode = selectedElemNode.innerText

            return {
                textTextNode,
                textElemNode
            }
        }

        const nodes = await page.evaluate(runner)
        expect(nodes).toEqual({
            textTextNode: 'hello',
            textElemNode: 'greet'
        });
    });

    it('#clean should remove all class names', async function() {
        function runner() {
            const adapter = window.createAdapter()

            const refs = {
                kind: 'writternReference',
                start: {character: 4, line: 1} as Location, // hello
                length: 5
            };
            const options = {className: 'test-classname1'};
            adapter.highlight(refs, options);
            const beforeClean = window.document.getElementsByClassName('test-classname1').length;

            adapter.clean(['test-classname1'])
            const afterClean = window.document.getElementsByClassName('test-classname1').length;

            return {beforeClean, afterClean}
        }

        const cleanResult = await page.evaluate(runner)
        expect(cleanResult).toEqual({
            beforeClean: 1,
            afterClean: 0
        });
    });
});
