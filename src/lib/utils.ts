export const controlKey = {
    alt: { value: 'altKey', name: 'Alt' },
    mac: { value: 'metaKey', name: 'Cmd' },
    win: { value: 'ctrlKey', name: 'Win' }
}

// kludge until decide better usage pattern
const isMac = /^mac/i.test(window.navigator.platform);

export const controls = {
    highlight: controlKey.alt,
    jump: isMac ? controlKey.mac : controlKey.win
}

export enum keyCode {
    ESC = 27
}
