import type { Plugin } from 'rollup';
export default function replaceDevLocaleSystemWithProd(options: {
    enLocalePath: string;
    verbose?: boolean;
}): Plugin;
