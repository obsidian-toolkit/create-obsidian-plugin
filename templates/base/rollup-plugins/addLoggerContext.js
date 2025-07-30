import { from, toArray } from 'ix/iterable';
import { filter, map } from 'ix/iterable/operators';
import path from 'node:path';
import { Node, Project, SyntaxKind, } from 'ts-morph';
function findFunctionName(currentNode) {
    const parent = currentNode.getFirstAncestor((node) => Node.isFunctionDeclaration(node) ||
        Node.isMethodDeclaration(node) ||
        Node.isFunctionExpression(node) ||
        Node.isArrowFunction(node));
    if (!parent)
        return 'global';
    if (Node.isFunctionDeclaration(parent) ||
        Node.isMethodDeclaration(parent)) {
        return parent.getName() ?? 'anonymous';
    }
    if (Node.isFunctionExpression(parent) || Node.isArrowFunction(parent)) {
        const varDecl = parent.getFirstAncestor(Node.isVariableDeclaration);
        if (varDecl) {
            return varDecl.getName();
        }
        return 'anonymous';
    }
    return 'global';
}
function extendNode(node) {
    const logText = node.getArguments()[0];
    if (!logText) {
        return node;
    }
    const originalContext = node.getArguments()[1]?.getFullText() ?? '{}';
    const fileName = path.relative(process.cwd(), node.getSourceFile().getFilePath());
    const functionName = findFunctionName(node);
    const lineNumber = node.getStartLineNumber();
    const columnNumber = node.getStartLinePos();
    const newContext = `{ ...${originalContext}, functionName: ${JSON.stringify(functionName)}, lineNumber: ${lineNumber}, columnNumber: ${columnNumber}, fileName: ${JSON.stringify(fileName)} }`;
    const args = node.getArguments();
    if (args.length >= 2) {
        args[1].replaceWithText(newContext);
    }
    else {
        const functionName = node.getExpression().getText();
        const firstArg = logText.getFullText();
        node.replaceWithText(`${functionName}(${firstArg}, ${newContext})`);
    }
    return node;
}
function extendLoggerCalls(source) {
    const loggerMethods = new Set(['debug', 'warn', 'error', 'info']);
    const loggerRegexp = new RegExp(`.logger.(${Array.from(loggerMethods).join('|')})`);
    const nodes = toArray(from(source.getDescendants()).pipe(filter((node) => node.isKind(SyntaxKind.CallExpression)), map((node) => ({ node, expression: node.getExpression() })), filter((nodeData) => nodeData.expression.isKind(SyntaxKind.PropertyAccessExpression)), map((nodeData) => ({
        ...nodeData,
        methodName: nodeData.expression.getName(),
    })), filter(({ methodName }) => loggerMethods.has(methodName)), filter(({ expression }) => !!loggerRegexp.test(expression.getText()))));
    for (const node of nodes) {
        extendNode(node.node);
    }
}
export default function addLoggerContext() {
    const project = new Project({
        useInMemoryFileSystem: true,
    });
    return {
        name: 'add-logger-context',
        transform(code, id) {
            if (!id.match(/(ts|tsx)$/))
                return;
            const sourceFile = project.createSourceFile(id, code, {
                overwrite: true,
            });
            extendLoggerCalls(sourceFile);
            const result = sourceFile.getFullText();
            project.removeSourceFile(sourceFile);
            return { code: result, map: null };
        },
    };
}
