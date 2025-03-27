import chalk from '@jarcher/enhanced-chalk';
import fs from 'fs';
import stripAnsi from 'strip-ansi';
import moment from 'moment';

const defaultConfig = {
    logToFile: true,
    includeTimestamp: true,
    includeFileInfo: true,
    logFilePath: 'server.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss'
};

let loggerConfig = { ...defaultConfig };

const logLevels = {
    info: chalk.blue('INFO'),
    warn: chalk.yellow('WARN'),
    error: chalk.red.bold('ERROR'),
    debug: chalk.green('DEBUG'),
    log: chalk.white('LOG')
};

function getCallerLocation() {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack;
    Error.prepareStackTrace = originalPrepareStackTrace;

    for (let i = 0; i < stack.length; i++) {
        const frame = stack[i];
        const filename = frame.getFileName();
        if (filename && !filename.includes('loggem') && !filename.includes('node_modules')) {
            return {
                file: filename.split('/').pop(),
                line: frame.getLineNumber()
            };
        }
    }
    return { file: 'unknown', line: 0 };
}

function formatArgs(args) {
    return args.map(arg =>
        typeof arg === 'string'
            ? arg
            : arg instanceof Error
                ? arg.stack
                : JSON.stringify(arg)
    ).join(' ');
}

function outputLog(level, ...args) {
    const { file, line } = getCallerLocation();
    const timestamp = loggerConfig.includeTimestamp ? chalk.orange(`[${moment().format(loggerConfig.timestampFormat)}]`) : '';
    const fileInfo = loggerConfig.includeFileInfo ? chalk.green(`${file}:${line}`) : '';
    const title = logLevels[level] || level.toUpperCase();
    const message = formatArgs(args);

    const finalOutput = [timestamp, fileInfo, `${title}: ${message}`].filter(Boolean).join(' ');

    console._nativeLog(finalOutput);

    if (loggerConfig.logToFile) {
        fs.appendFile(loggerConfig.logFilePath, stripAnsi(finalOutput) + '\n', 'utf8', (err) => {
            if (err) console._nativeError('Failed to write to log file:', err);
        });
    }
}

export const logger = {
    config: (newConfig) => {
        loggerConfig = { ...loggerConfig, ...newConfig };
    },

    log: (...args) => outputLog('log', ...args),
    info: (...args) => outputLog('info', ...args),
    warn: (...args) => outputLog('warn', ...args),
    error: (...args) => outputLog('error', ...args),
    debug: (...args) => outputLog('debug', ...args),

    blank: () => {
        console._nativeLog('');
        if (loggerConfig.logToFile) {
            fs.appendFile(loggerConfig.logFilePath, '\n', 'utf8', (err) => {
                if (err) console._nativeError('Failed to write blank line to log file:', err);
            });
        }
    }
};

// 🔒 Monkey-patch console — preserve native methods first
console._nativeLog = console.log;
console._nativeInfo = console.info;
console._nativeWarn = console.warn;
console._nativeError = console.error;

// Use logger under the hood
console.log = (...args) => {
    if (args.length === 1 && args[0] === '') {
        logger.blank();
    } else {
        logger.info(...args);
    }
};
console.info = (...args) => logger.info(...args);
console.warn = (...args) => logger.warn(...args);
console.error = (...args) => logger.error(...args);

// ✅ Allow config via console.config()
console.config = (newConfig) => {
    logger.config(newConfig);
};