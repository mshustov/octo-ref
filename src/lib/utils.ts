// kludge until decide better usage pattern
const isMac = /^mac/i.test(window.navigator.platform);
const cmdKey = isMac ? 'metaKey' : 'ctrlKey';

export const controlKey = {
    alt: 'altKey',
    cmd: cmdKey
}

export enum keyCode {
    ESC = 27
}
