import tracer from 'tracer';
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

function buildLogger() {
    const formatParts = [];

    if (loggerConfig.includeTimestamp) formatParts.push("{{timestamp}}");
    if (loggerConfig.includeFileInfo) formatParts.push("{{file}}");
    formatParts.push("{{title}}: {{message}}");

    return tracer.console({
        format: formatParts.join(' '),
        preprocess: (data) => {
            data.title = logLevels[data.title] || data.title;

            if (loggerConfig.includeFileInfo && data.file && data.line) {
                data.file = chalk.green(`${data.file}:${data.line}`);
            } else {
                data.file = '';
            }

            if (loggerConfig.includeTimestamp) {
                data.timestamp = chalk.orange(`[${moment().format(loggerConfig.timestampFormat)}]`);
            } else {
                data.timestamp = '';
            }
        },
        transport: (data) => {
            console._nativeLog(data.output); // bypass the monkey-patch
            if (loggerConfig.logToFile) {
                fs.appendFile(loggerConfig.logFilePath, stripAnsi(data.output) + '\n', 'utf8', (err) => {
                    if (err) console._nativeError('Failed to write to log file:', err);
                });
            }
        }
    });
}

let tracerLogger = buildLogger();

export const logger = {
    config: (newConfig) => {
        loggerConfig = { ...loggerConfig, ...newConfig };
        tracerLogger = buildLogger(); // rebuild with new config
    },

    log: (...args) => tracerLogger.log(...args),
    info: (...args) => tracerLogger.info(...args),
    warn: (...args) => tracerLogger.warn(...args),
    error: (...args) => tracerLogger.error(...args),
    debug: (...args) => tracerLogger.debug(...args),

    blank: () => {
        console._nativeLog('');
        if (loggerConfig.logToFile) {
            fs.appendFile(loggerConfig.logFilePath, '\n', 'utf8', (err) => {
                if (err) console._nativeError('Failed to write blank line to log file:', err);
            });
        }
    }
};

// 🐒 Monkey-patch console — preserve native methods first
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
