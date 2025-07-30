declare const config: {
    output: {
        dir: string;
        sourcemap: boolean;
        format: string;
        exports: string;
        inlineDynamicImports: boolean;
    };
    plugins: any[];
    input: string;
    external: string[];
};
export default config;
