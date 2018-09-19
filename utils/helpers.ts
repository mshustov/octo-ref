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

function inlineHelpers(...fns){
    return fns.map(fn => fn.toString()).join(';')
}

export default function getInlinedHelpers() {
    return inlineHelpers(setSelection, createAdapter)
}
