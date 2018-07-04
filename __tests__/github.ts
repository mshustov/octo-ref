import * as puppeteer from 'puppeteer';
import * as fs from 'fs'

const pageUrl = 'https://github.com/restrry/octo-ref/blob/master/tests/fixtures/github-page.js';
const scriptFile = fs.readFileSync('./dist/js/contentscript.js', 'utf8')
let browser
let page

const width = 1400;
const height = 1200;
jest.setTimeout(1000000);

describe('unit tests', function() {
    beforeEach(async function() {
        browser = await puppeteer.launch({
            // devtools: true,
            headless: true,
            // slowMo: 250, // for debug purposes
            args: [
                // TODO add them for Travis only
                '--no-sandbox',
                '--disable-setuid-sandbox',

                `--window-size=${width},${height}`,
                // '--disable-extensions-except=dist/',
                // '--load-extension=dist/',
            ]
        });
        page = await browser.newPage();
        await page.setViewport({ width, height });

        // we want to inject our script on the page, so we disable CSP
        await page.setBypassCSP(true);
        await page.goto(pageUrl);
        page.addScriptTag({
            content: scriptFile
        });
        // some artificial delay to initialize script 
        await page.waitFor(3500)
    });

    afterEach(() => {
        browser.close();
    });

    describe('github api', function() {
        it.only('#getRoot should return root html element', async function() {
            function extractItems() {
                debugger
                const root = window.adapter.getRoot()
                return root instanceof HTMLElement
            }
            const rootIsInstanceOfHTML = await page.evaluate(extractItems)
            expect(rootIsInstanceOfHTML).toBe(true);
        })

        it('#getFilename should resolve filename', async function() {
            function getFilename() {
                const filename = window.adapter.getFilename();
                const fnBeginsAt = filename.lastIndexOf('/');
                return filename.slice(fnBeginsAt)
            }

            const filename = await page.evaluate(getFilename)
            expect(filename).toBe('/github-page.js');
        })

        it('#getLineNumber should return line number', async function() {
            function getLineNumber() {
                const elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
                const lineNumber = window.adapter.getLineNumber(elem);
                return lineNumber
            }

            const lineNumber = await page.evaluate(getLineNumber)
            expect(lineNumber).toBe(13);
        })

        it.skip('#getElem should return the deepest selected element', async function() {
            function getIsDeepestElementReturned() {
                function setSelection(window, elem){
                    const rng = window.document.createRange();
                    rng.selectNode(elem)
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }

                const elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
                setSelection(window, elem);
                debugger
                const selectedElem = window.adapter.getElem(); // textNode, childNode of elem

                return selectedElem === elem.childNodes[0]
            }

            const isDeepestElementReturned = await page.evaluate(getIsDeepestElementReturned)
            expect(isDeepestElementReturned).toBe(true);
        })

        it('#getElemPosition should return object with position on element. shape {line, character}', async function() {
            function getElemPosition() {
                const elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet

                const selectedElem = window.adapter.getElemPosition(elem);
                return selectedElem
            }

            const elemPosition = await page.evaluate(getElemPosition)
            expect(elemPosition).toEqual({ line: 13, character: 15 });
        });

        it('#getEndColumnPosition should return end last position for element', async function() {
            // TODO use one setSelection function
            function getPositions() {
                function setSelection(window, elem){
                    const rng = window.document.createRange();
                    rng.selectNode(elem)
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }
        
                const elem = window.document.getElementById('LC21').querySelector('.pl-c1'); // join
                const charNumberWithoutSelection = window.adapter.getEndColumnPosition(elem);
        
                setSelection(window, elem);
                const charNumberWithSelection = window.adapter.getEndColumnPosition(elem);
                return {
                    charNumberWithoutSelection,
                    charNumberWithSelection
                }
            }

            const positions = await page.evaluate(getPositions)
            expect(positions).toEqual({
                charNumberWithoutSelection: 19,
                charNumberWithSelection: 27 // TODO check why 27, not 23
            });
        });


        it('#getElemLength should return length of elem content', async function() {
            function getLength() {
                const elem: HTMLElement = window.document.getElementById('LC21').querySelector('.pl-c1'); // join
                const contentLengthForELEM_NODE = window.adapter.getElemLength(elem);
                const contentLengthForTEXT_NODE = window.adapter.getElemLength(elem.nextSibling);

                return {
                    contentLengthForELEM_NODE,
                    contentLengthForTEXT_NODE
                }
            }

            const lengths = await page.evaluate(getLength)
            expect(lengths).toEqual({
                contentLengthForELEM_NODE: 4, // 'null'
                contentLengthForTEXT_NODE: 11 // ', options);'
            });
        });
        it('#subscribe/#unsubscribe should subscribe/unsubscribe on event ', async function() {
            function getCalledCounter() {
                let counter = 0
                const callback = () => counter++
                const elem = window.document.getElementById('LC17').querySelector('.pl-c1') as HTMLElement;
        
                window.adapter.subscribe('click', callback);
                elem.click();
        
                window.adapter.unsubscribe('click', callback);
                elem.click();
                return counter
            }

            const calledCounter = await page.evaluate(getCalledCounter)
            expect(calledCounter).toBe(1);
        });
        it('#show should add class name (wrap text node)', async function() {
            function getNodes() {
                const refsTextNode = {
                    kind: 'writternReference',
                    start: {character: 4, line: 2} as Location, // hello
                    length: 5
                };
                const optionsTextNode = {className: 'test-classname1'};
        
                window.adapter.highlight(refsTextNode, optionsTextNode);
                const selectedTextNode = window.document.querySelector('.test-classname1') as HTMLElement;
                const textTextNode = selectedTextNode.innerText
                // assert.equal(selectedElem.innerText, 'hello', 'wrap textNode');

                const refsElemNode = {
                    kind: 'writternReference',
                    start: {character: 8, line: 21} as Location, // greet
                    length: 5
                }
                const optionsElemNode = {className: 'test-classname2'};
                window.adapter.highlight(refsElemNode, optionsElemNode);
                const selectedElemNode = window.document.querySelector('.test-classname2') as HTMLElement;
                const textElemNode = selectedElemNode.innerText
                // assert.equal(selectedElemNode.innerText, 'greet', 'add className to element node');
                return {
                    textTextNode,
                    textElemNode
                }
            }

            const nodes = await page.evaluate(getNodes)
            expect(nodes).toEqual({
                textTextNode: 'hello',
                textElemNode: 'greet'
            });
        });

        it('#clean should remove all class names', async function() {
            function checkClean() {
                const refs = {
                    kind: 'writternReference',
                    start: {character: 4, line: 1} as Location, // hello
                    length: 5
                };
                const options = {className: 'test-classname1'};
                window.adapter.highlight(refs, options);
                const beforeClean = window.document.getElementsByClassName('test-classname1').length;
                // assert.equal(elems.length, 1, 'add class name');
                window.adapter.clean(['test-classname1'])
                const afterClean = window.document.getElementsByClassName('test-classname1').length;
                // assert.equal(elems.length, 0, 'remove class name');
                return {beforeClean, afterClean}
            }

            const cleanResult = await page.evaluate(checkClean)
            expect(cleanResult).toEqual({
                beforeClean: 1,
                afterClean: 0
            });
        });
    });
    describe('integration tests', function() {
        it('Highlight definition with Alt + Click combination', async function() {

            await page.keyboard.down('Alt');
            await page.click('#LC13 > .pl-smi');
            await page.keyboard.up('Alt');

            function extractItems() {
                const elem: HTMLElement = document.querySelector('#LC13 > .pl-smi');
                return elem.classList.contains('defColor')
            }

            const definitionIsFound = await page.evaluate(extractItems)
            expect(definitionIsFound).toBe(true);
        });
        it('Highlight definition and references with Alt + Click combination', async function() {
            await page.keyboard.down('Alt');
            await page.click('#LC21 > .pl-smi');
            await page.keyboard.up('Alt');

            function extractItems() {
                const defElem: HTMLElement = document.querySelector('#LC21 > .defColor');
                const refElem: HTMLElement = document.querySelector('#LC21 > .pl-smi');

                return [
                    defElem && defElem !== refElem,
                    refElem.classList.contains('refColor')
                ]
            }

            const [definitionFound, referenceFound] = await page.evaluate(extractItems)
            expect(definitionFound).toBe(true);
            expect(referenceFound).toBe(true);
        });
    })
});
