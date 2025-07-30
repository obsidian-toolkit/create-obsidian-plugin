export class LocaleProxy {
    currentLocale;
    fallbackLocale;
    constructor(currentLocale, fallbackLocale) {
        this.currentLocale = currentLocale;
        this.fallbackLocale = fallbackLocale;
    }
    createProxy(path = []) {
        return new Proxy({}, {
            get: (_, key) => {
                const fullPath = [...path, key];
                const val = this.getValue(fullPath, this.currentLocale);
                if (this.isEmpty(val)) {
                    return this.handleMissing(fullPath);
                }
                if (this.isObject(val)) {
                    return this.createProxy(fullPath);
                }
                return val;
            },
        });
    }
    getValue(path, locale) {
        return path.reduce((acc, key) => acc?.[key], locale);
    }
    isEmpty(val) {
        return (val === undefined ||
            val === null ||
            val === '' ||
            (Array.isArray(val) && val.length === 0));
    }
    isObject(val) {
        return val !== null && typeof val === 'object' && !Array.isArray(val);
    }
    handleMissing(path) {
        const fallbackVal = this.getValue(path, this.fallbackLocale);
        if (!this.isEmpty(fallbackVal)) {
            return this.isObject(fallbackVal)
                ? this.createProxy(path)
                : fallbackVal;
        }
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Missing locale key: ${path.join('.')}`);
        }
        return `[missing: ${path.join('.')}]`;
    }
}
