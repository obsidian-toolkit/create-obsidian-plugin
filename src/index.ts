#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '..', 'templates');

interface PluginConfig {
    packageName: string;
    pluginName: string;
    pluginId: string;
    useReact: boolean;
    usePreact: boolean;
    useI18n: boolean;
    useReactiveSettings: boolean;
}

async function prompt(question: string): Promise<string> {
    process.stdout.write(question);
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

async function confirm(question: string): Promise<boolean> {
    const answer = await prompt(`${question} (y/N): `);
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

function validatePluginName(name: string): boolean {
    return /^[a-z][a-z0-9-]*$/.test(name) && name.length >= 2;
}

function validatePluginId(id: string): boolean {
    return /^[a-z][a-z0-9-]*$/.test(id) && id.length >= 2;
}

async function getPluginConfig() {
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
            name: 'packageName',
            message: 'Package name:',
            default: (answers) =>
                `obsidian-${answers.name.toLowerCase().trim().replace(/\s+/g, '-')}`,
        },
        {
            type: 'input',
            name: 'id',
            message: 'Plugin id',
            default: 'my-plugin-id',
        },
    ]);

    const reactFeature = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'reactEnabled',
            message: 'Include React features?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'preactEnabled',
            message: 'Replace React with Preact on bundling?',
            default: true,
            when: (answ) => answ.reactEnabled,
        },
    ]);

    const i18nFeature = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'i18nEnabled',
            message: 'Enable i18n features?',
            default: false,
        },
    ]);

    // TODO написать Obsidian Events враппер для нативных настроек, потипу EventEmitter2
    const reactiveSettingsSystemFeature = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'reactiveSettings',
            message: 'Enable reactive settings system?',
            default: false,
        },
        {
            type: 'list',
            name: 'eventSystem',
            message: 'Event system for reactive settings:',
            choices: [
                {
                    name: 'EventEmitter2 (full features)',
                    value: 'eventemitter2',
                },
                {
                    name: 'Obsidian Events (custom wrapper)',
                    value: 'obsidian-wrapper',
                },
                { name: 'No reactive settings', value: 'none' },
            ],
            default: 'none',
            when: (ans) => ans.reactiveSettings,
        },
    ]);

    const bundler = await inquirer.prompt([
        {
            type: 'list',
            name: 'bundler',
            message: 'Bundler:',
            choices: ['esbuild', 'rollup'],
            default: 'rollup',
        },
    ]);

    const cssPreprocessing = await inquirer.prompt([
        {
            type: 'list',
            name: 'css',
            message: 'CSS:',
            choices: ['vanilla', 'scss', 'postcss'],
            default: 'vanilla',
        },
    ]);
}

async function copyTemplate(from: string, to: string): Promise<void> {
    console.log(`📁 Copying ${path.basename(from)} template...`);

    // DRY RUN - just log what would be copied
    console.log(`   Would copy: ${from} -> ${to}`);

    // Real implementation would be:
    // await fs.cp(from, to, { recursive: true, force: true });
}

async function processTemplateFile(
    filePath: string,
    config: PluginConfig
): Promise<void> {
    console.log(`🔄 Processing ${path.basename(filePath)}...`);

    // DRY RUN - just log what would be processed
    console.log(`   Would replace variables in: ${filePath}`);
    console.log(`   Variables: ${JSON.stringify(config, null, 2)}`);

    // Real implementation would be:
    // const content = await fs.readFile(filePath, 'utf8');
    // const processed = content
    //     .replace(/{{PACKAGE_NAME}}/g, config.packageName)
    //     .replace(/{{PLUGIN_NAME}}/g, config.pluginName)
    //     .replace(/{{PLUGIN_ID}}/g, config.pluginId);
    // await fs.writeFile(filePath, processed);
}

async function createPlugin(config: PluginConfig): Promise<void> {
    const targetDir = path.join(process.cwd(), config.packageName);

    console.log(`\n🏗️  Creating plugin in: ${targetDir}`);

    // Check if directory exists
    try {
        await fs.access(targetDir);
        console.log('❌ Directory already exists!');
        process.exit(1);
    } catch {
        // Directory doesn't exist, good to proceed
    }

    // DRY RUN - just log what would be created
    console.log(`📁 Would create directory: ${targetDir}`);

    // Copy base template
    const defaultTemplate = path.join(templatesDir, 'default');
    await copyTemplate(defaultTemplate, targetDir);

    // Apply feature templates
    const features: string[] = [];

    if (config.useReact) {
        features.push('react');
        const reactTemplate = path.join(templatesDir, 'react');
        await copyTemplate(reactTemplate, targetDir);

        if (config.usePreact) {
            features.push('preact');
            const preactTemplate = path.join(templatesDir, 'preact');
            await copyTemplate(preactTemplate, targetDir);
        }
    }

    if (config.useI18n) {
        features.push('i18n');
        const i18nTemplate = path.join(templatesDir, 'i18n');
        await copyTemplate(i18nTemplate, targetDir);
    }

    if (config.useReactiveSettings) {
        features.push('reactive-settings');
        const reactiveTemplate = path.join(templatesDir, 'reactive-settings');
        await copyTemplate(reactiveTemplate, targetDir);
    }

    // Process template variables in all files
    console.log('\n🔄 Processing template variables...');
    const files = ['package.json', 'manifest.json', 'src/main.ts', 'README.md'];

    for (const file of files) {
        const filePath = path.join(targetDir, file);
        await processTemplateFile(filePath, config);
    }

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    console.log(`   Would run: cd ${config.packageName} && npm install`);

    // Success message
    console.log('\n✅ Plugin created successfully!');
    console.log(`\n📝 Features enabled: ${features.join(', ')}`);
    console.log('\n🚀 Next steps:');
    console.log(`   cd ${config.packageName}`);
    console.log('   npm run dev        # Start development');
    console.log('   npm run build      # Build plugin');
    if (config.useI18n) {
        console.log(
            '   npm run locale-tool template <lang>  # Add translation'
        );
    }
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
