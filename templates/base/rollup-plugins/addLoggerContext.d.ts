export default function addLoggerContext(): {
    name: string;
    transform(code: string, id: string): {
        code: any;
        map: null;
    } | undefined;
};
