export const controlKey = {
    alt: { value: 'altKey', name: 'Alt' },
    cmd: { value: 'metaKey', name: 'Cmd' },
    ctrl: { value: 'ctrlKey', name: 'Ctrl' }
}

// kludge until decide better usage pattern
const isMac = /^mac/i.test(window.navigator.platform);

export const controls = {
    highlight: controlKey.alt,
    jump: isMac ? controlKey.cmd : controlKey.ctrl
}

export enum keyCode {
    ESC = 27
}
