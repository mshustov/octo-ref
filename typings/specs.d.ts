interface Window {
    adapter: {
        default: new (window: Window) => GithubDomAPI;
    }
    setSelection(window: Window, elem: Node): void
    createAdapter(): GithubDomAPI
}
