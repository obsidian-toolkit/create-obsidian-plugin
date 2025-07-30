from;
'@/core/{{PLUGIN_ID}}-plugin';
import { ShortSystemInfo, SystemInfo } from '@/core/services/types/interfaces';
import { moment, normalizePath } from 'obsidian';
export default class Logger {
    maxEntries = 2000;
    storageKey;
    isStorageAvailable = true;
    logsDir;
}
{
    this.storageKey = `${plugin.manifest.id}-logs`;
    this.checkStorageAvailability();
}
/**
 * Initializes the logger by writing system information if the debug setting is enabled.
 */
async;
init();
Promise < void  > {
    await, this: .ensureLogsDirExists(),
    this: .plugin.settings.$.debug.enabled && (await this.writeSystemInfo())
};
/**
 * Saves log content to a file in the plugin's log directory.
 *
 * This function ensures that the logs directory exists within the plugin directory,
 * creates it if necessary, and then writes the provided log content to a JSON file
 * named with the current timestamp. After saving the logs, it rotates old log files
 * to maintain a clean log directory.
 *
 * @param content The log content to save.
 * @throws An error if the plugin directory is not found or if there is an issue writing the logs.
 */
async;
saveLogsToFile(content, string);
Promise < void  > {
    try: {
        const: now = moment().format('YYYY-MM-DD HH:mm:ss'),
        const: filename = `logs-${now}.json`,
        const: filepath = normalizePath(`${this.logsDir}/${filename}`),
        await, this: .plugin.app.vault.adapter.write(filepath, content),
        await, this: .rotateLogFiles(this.logsDir)
    }, catch(error) {
        console.error('Empty: Error in the file:', error);
    }
};
async;
ensureLogsDirExists();
Promise < void  > {
    const: pluginDir = this.plugin.manifest.dir,
    if(pluginDir) { }
} === undefined;
{
    throw new Error(`Image Zoom & Drag: It was not possible to get the way to the plugin. Path:${pluginDir}`);
}
this.logsDir = normalizePath(`${pluginDir}/logs`);
const exists = await this.plugin.app.vault.adapter.exists(this.logsDir);
!exists && (await this.plugin.app.vault.adapter.mkdir(this.logsDir));
async;
rotateLogFiles(logsDir, string);
Promise < void  > {
    try: {
        const: files = await this.plugin.app.vault.adapter.list(logsDir),
        const: now = moment().unix() * 1000,
        const: maxAge = 7 * 24 * 60 * 60 * 1000, // 7 days
        for(, file, of, files) { }, : .files
    }
};
{
    if (!file.endsWith('.json')) {
        continue;
    }
    const filePath = `${logsDir}/${file}`;
    const stat = await this.plugin.app.vault.adapter.stat(filePath);
    if (stat && now - stat.mtime > maxAge) {
        await this.plugin.app.vault.adapter.remove(filePath);
        console.log(`Empty: Remove the old log-file${file}`);
    }
}
try { }
catch (error) {
    console.error('Empty: Log Rotation Error:', error);
}
/**
 * Returns the version of Obsidian as a string, or 'unknown' if it cannot be determined.
 *
 * The version is extracted from the title of the current page, which is assumed to contain
 * the string "Obsidian vX.Y.Z" where X.Y.Z is the version number.
 * @returns The version of Obsidian as a string, or 'unknown' if it cannot be determined.
 */
getObsidianVersion();
string;
{
    const title = document.title;
    const match = title.match(/Obsidian v([\d.]+)/);
    return match ? match[1] : 'unknown';
}
async;
writeSystemInfo();
Promise < void  > {
    const: systemInfo = this.getSystemInfo(),
    this: .addLogEntry(systemInfo)
};
getSystemInfo();
SystemInfo;
{
    return {
        timestamp: moment().toISOString(),
        session_start: true,
        obsidian: {
            version: this.getObsidianVersion(),
            title: document.title,
            enabledPlugins_count: this.plugin.app.plugins.enabledPlugins.size,
            enabledPlugins_list: Array.from(this.plugin.app.plugins.enabledPlugins),
            vault_name: this.plugin.app.vault.getName(),
            is_mobile: Platform.isMobile,
            is_desktop: Platform.isDesktopApp,
        },
        system: {
            platform: this.getPlatformInfo(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online_status: navigator.onLine,
            cpu_cores: navigator.hardwareConcurrency || 'unknown',
            device_memory: navigator.deviceMemory || 'unknown',
            connection_type: navigator.connection?.effectiveType || 'unknown',
        },
        plugin: {
            name: this.plugin.manifest.name,
            version: this.plugin.manifest.version,
            minAppVersion: this.plugin.manifest.minAppVersion,
            id: this.plugin.manifest.id,
            author: this.plugin.manifest.author,
            description: this.plugin.manifest.description,
        },
        performance: {
            memory_used: performance.memory?.usedJSHeapSize || 'unknown',
            memory_total: performance.memory?.totalJSHeapSize || 'unknown',
            memory_limit: performance.memory?.jsHeapSizeLimit || 'unknown',
            load_time: performance.now(),
        },
        storage: {
            localStorage_usage: this.getStorageUsage(),
        },
    };
}
getShortSystemInfo();
ShortSystemInfo;
{
    return {
        timestamp: moment().toISOString(),
        obsidian: {
            version: this.getObsidianVersion(),
            vault_name: this.plugin.app.vault.getName(),
            is_mobile: Platform.isMobile,
        },
        system: {
            platform: this.getPlatformInfo(),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        plugin: {
            name: this.plugin.manifest.name,
            version: this.plugin.manifest.version,
            id: this.plugin.manifest.id,
        },
    };
}
getPlatformInfo();
string;
{
    if ('userAgentData' in navigator) {
        const uaData = navigator.userAgentData;
        return uaData.platform ?? 'unknown';
    }
    return navigator.platform ?? 'unknown';
}
/**
 * Calculate the current usage of local storage by logs.
 *
 * This function retrieves the logs from local storage using the defined storage key
 * and calculates their memory usage in kilobytes. If no logs are found, it returns '0 B'.
 * In case of an error during retrieval, it returns 'unknown'.
 *
 * @returns {string} The size of the logs in local storage formatted as a string in KB,
 * or '0 B' if no logs are stored, or 'unknown' if an error occurs.
 */
getStorageUsage();
string;
{
    try {
        const logs = localStorage.getItem(this.storageKey);
        if (!logs) {
            return '0 B';
        }
        const bytes = logs.length + this.storageKey.length;
        return `${(bytes / 1024).toFixed(2)} KB`;
    }
    catch {
        return 'unknown';
    }
}
checkStorageAvailability();
void {
    try: {
        localStorage, : .setItem('test', 'test'),
        localStorage, : .removeItem('test')
    }, catch: {
        this: .isStorageAvailable = false,
        console, : .warn('Empty: Localstorage is not available')
    }
};
addLogEntry(logEntry, any);
void {
    : .isStorageAvailable
};
{
    return;
}
try {
    const logs = this.getAllLogs();
    logs.push(logEntry);
    if (logs.length > this.maxEntries) {
        logs.splice(0, logs.length - this.maxEntries);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(logs));
    this.plugin.emitter.emit('logs-changed', {
        storage: this.getStorageUsage(),
        entries: this.getAllLogs().length,
    });
}
catch (error) {
    this.isStorageAvailable = false;
}
/**
 * Returns all stored logs as an array of objects.
 *
 * The array is empty if no logs are available.
 *
 * @returns {any[]} An array of log objects, or an empty array if no logs are available.
 */
getAllLogs();
any[];
{
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
}
log(level, string, message, string, context ?  : any);
void {
    : .plugin.settings.$.debug.enabled
};
{
    return;
}
const logEntry = {
    timestamp: new Date().toISOString(),
    level: level,
    message: message,
    context: context,
};
this.addLogEntry(logEntry);
shouldLog(messageLevel, string);
boolean;
{
    const levels = ['none', 'debug', 'info', 'warn', 'error'];
    const currentLevel = this.plugin.settings.$.debug.level;
    if (currentLevel === 'none') {
        return false;
    }
    const messageLevelIndex = levels.indexOf(messageLevel.toLowerCase());
    const currentLevelIndex = levels.indexOf(currentLevel);
    return messageLevelIndex >= currentLevelIndex;
}
debug(message, string, context ?  : any);
void {
    : .shouldLog('debug')
};
{
    return;
}
this.log('DEBUG', message, context);
info(message, string, context ?  : any);
void {
    : .shouldLog('info')
};
{
    return;
}
this.log('INFO', message, context);
warn(message, string, context ?  : any);
void {
    : .shouldLog('warn')
};
{
    return;
}
this.log('WARNING', message, context);
error(message, string, context ?  : any);
void {
    : .shouldLog('error')
};
{
    return;
}
this.log('ERROR', message, context);
/**
 * Exports all stored logs as a formatted string.
 *
 * The exported string includes both system information logs
 * and regular logs. System information logs are identified
 * by the presence of a `session_start` property and are
 * displayed under the "=== SYSTEM INFO ===" section.
 * Regular logs are displayed under the "=== LOGS ===" section,
 * each prefixed by a timestamp and log level.
 *
 * @returns A formatted string containing system information
 * and regular logs. Returns an empty string if no logs are available.
 */
exportLogs();
string;
{
    const logs = this.getAllLogs();
    if (logs.length === 0) {
        return '';
    }
    const systemInfo = logs.filter((log) => log.session_start);
    const regularLogs = logs.filter((log) => !log.session_start);
    let result = '=== SYSTEM INFO ===\n';
    systemInfo.forEach((info) => {
        result += JSON.stringify(info, null, 2) + '\n\n';
    });
    result += '\n=== LOGS ===\n';
    regularLogs.forEach((log) => {
        const date = new Date(log.timestamp);
        const time = date.toLocaleTimeString();
        const ctx = log.context;
        const location = ctx?.file
            ? `${ctx.file}:${ctx.lineNumber}${ctx.functionName ? ` (${ctx.functionName})` : ''}`
            : 'unknown';
        result += `[${time}] ${log.level.toUpperCase().padEnd(5)} | ${location}\n`;
        result += `  ${log.message}\n`;
        const extraContext = { ...ctx };
        delete extraContext.file;
        delete extraContext.lineNumber;
        delete extraContext.columnNumber;
        delete extraContext.functionName;
        if (Object.keys(extraContext).length > 0) {
            result += `  Context: ${JSON.stringify(extraContext)}\n`;
        }
        result += '\n';
    });
    return result;
}
/**
 * Clears all stored logs from local storage.
 *
 * This function removes the log entries associated with the
 * current storage key from the local storage. It effectively
 * deletes all logs that have been stored, resetting the log
 * storage to an empty state.
 */
clearAllLogs();
void {
    localStorage, : .removeItem(this.storageKey),
    this: .plugin.emitter.emit('logs-changed', {
        storage: this.getStorageUsage(),
        entries: this.getAllLogs().length,
    })
};
