function tf(text, params) {
    return text.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? `{{${k}}}`);
}
let t;
async function initT() {
    t =
        process.env.NODE_ENV === 'development'
            ? (await import('./t/dev/dev')).t
            : (await import('./t/prod')).t;
}
const tPromise = initT();
export { t, tf, tPromise };
