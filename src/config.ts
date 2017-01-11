const config = {
    settings: {
        refColor: "ffee00",
        defColor: "e6c8ec"
    },
    className: {
        source: "defColor",
        reference: "refColor"
    },
    ext: [".ts", ".tsx", ".js", ".jsx", ".es6"],
    getClassName (forDefinition: boolean): string{
        return forDefinition ? config.className.source : config.className.reference;
    }
}

export default config;
