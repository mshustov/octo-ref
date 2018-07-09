const config = {
    settings: {
        refColor: "#ffee00",
        defColor: "#e6c8ec"
    },
    className: {
        definition: "defColor",
        reference: "refColor"
    },
    ext: [".ts", ".tsx", ".js", ".jsx", ".es6"],
    getClassName (forDefinition: boolean): string{
        return forDefinition ? config.className.definition : config.className.reference;
    }
}

export default config;
