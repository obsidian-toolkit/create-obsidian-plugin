import { rollup } from 'rollup';
import config from './rollup.config';
async function debug() {
    console.log('Starting rollup with config:', config);
    const bundle = await rollup(config);
    if (config.output) {
        await bundle.write(config.output);
    }
    await bundle.close();
}
debug().catch(console.error);
