export default function (selector, color) {
    return `.${selector}
    {
        background-color: ${color};
        pointer-events: none;
    }`;
}
