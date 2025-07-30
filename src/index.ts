#!/usr/bin/env node
import { execSync } from 'child_process';
import { Command } from 'commander';
import { findUpSync } from 'find-up-simple';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '..', 'templates');

interface PluginConfig {
    pluginName: string;
    pluginId: string;
    author: string;
}

const program = new Command();
program.option('--here', 'create in current directory').parse();

const options = program.opts();

const root = findUpSync('package.json');

function toUpperCamelCase(str: string): string {
    return str.replace(/(^|-)([a-z])/g, (_, __, letter) =>
        letter.toUpperCase()
    );
}

async function getPluginConfig(): Promise<PluginConfig> {
    console.log('🚀 Creating new Obsidian plugin\n');

    const metadata = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Plugin name:',
            default: 'My plugin',
        },
        {
            type: 'input',
            name: 'id',
            message: 'Plugin id',
            default: 'my-plugin-id',
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author:',
            default: 'Empty',
        },
    ]);
    return {
        pluginName: metadata.name,
        author: metadata.author,
        pluginId: metadata.id,
    };
}

async function copyTemplate(from: string, to: string): Promise<void> {
    console.log(`📁 Copying template...`);
    await fs.cp(from, to, { recursive: true, force: true });
}

async function processAllSrcFiles(
    targetDir: string,
    config: PluginConfig
): Promise<void> {
    const srcDir = path.join(targetDir, 'src');
    const processedFile = `${config.pluginId}-plugin.ts`;

    async function processDirectory(dir: string): Promise<void> {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else if (entry.isFile() && entry.name !== processedFile) {
                // Process only text files (common extensions)
                const ext = path.extname(entry.name).toLowerCase();
                const textExtensions = [
                    '.ts',
                    '.tsx',
                    '.js',
                    '.jsx',
                    '.json',
                    '.md',
                    '.txt',
                    '.css',
                    '.scss',
                    '.html',
                ];

                if (textExtensions.includes(ext)) {
                    try {
                        await processTemplateFile(fullPath, config);
                    } catch (error) {}
                }
            }
        }
    }

    try {
        await processDirectory(srcDir);
    } catch (error) {
        console.log('⚠️  Warning: Could not process src directory');
    }
}

async function processTemplateFile(
    filePath: string,
    config: PluginConfig
): Promise<void> {
    const content = await fs.readFile(filePath, 'utf8');
    const processed = content
        .replace(/{{PLUGIN_NAME}}/g, config.pluginName)
        .replace(/{{PLUGIN_ID}}/g, config.pluginId)
        .replace(
            /{{PLUGIN_ID_UPPER_CAMEL}}/g,
            toUpperCamelCase(config.pluginId)
        )
        .replace(/{{AUTHOR}}/g, config.author);

    await fs.writeFile(filePath, processed);
}

async function renameSpecialFiles(
    targetDir: string,
    config: PluginConfig
): Promise<void> {
    // Rename empty-plugin.ts to pluginId-plugin.ts
    const oldPath = path.join(targetDir, 'src', 'core', 'empty-plugin.ts');
    const newPath = path.join(
        targetDir,
        'src',
        'core',
        `${config.pluginId}-plugin.ts`
    );

    try {
        await fs.rename(oldPath, newPath);
    } catch (error) {}
}

async function createPlugin(config: PluginConfig): Promise<void> {
    const targetDir = options.here
        ? process.cwd()
        : path.join(process.cwd(), config.pluginId);
    console.log(`\n🏗️  Creating plugin in: ${targetDir}`);

    // Check if directory exists
    if (!options.here) {
        try {
            await fs.access(targetDir);
            console.log('❌ Directory already exists!');
            process.exit(1);
        } catch {
            // Directory doesn't exist, good to proceed
        }
    }
    const baseTemplate = path.join(templatesDir, 'base');
    await copyTemplate(baseTemplate, targetDir);

    await renameSpecialFiles(targetDir, config);

    const files = [
        'package.json',
        'manifest.json',
        'rollup.config.ts',
        'tsconfig.devs.json',
        'styles.scss',
        '.gitignore',
        'README.md',
        'LICENSE',
        `src/core/${config.pluginId}-plugin.ts`,
    ];

    for (const file of files) {
        const filePath = path.join(targetDir, file);
        try {
            await processTemplateFile(filePath, config);
        } catch (error) {}
    }

    await processAllSrcFiles(targetDir, config);

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    try {
        execSync('bun install', { cwd: targetDir, stdio: 'ignore' });
    } catch (error) {
        console.log(
            '⚠️  Failed to install dependencies automatically. Run "npm install" manually.'
        );
    }

    // Success message
    console.log('\n✅ Plugin created successfully!');
    console.log('\n🚀 Next steps:');
    console.log(`   cd ${config.pluginId}`);
    console.log('   npm run dev        # Start development');
    console.log('   npm run build      # Build plugin');
}

async function main(): Promise<void> {
    try {
        const config = await getPluginConfig();
        await createPlugin(config);
    } catch (error) {
        console.error('❌ Error creating plugin:', error);
        process.exit(1);
    }
}

// Enable stdin
process.stdin.setRawMode?.(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

main().catch(console.log);
