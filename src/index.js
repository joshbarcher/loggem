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
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
};

let loggerConfig = { ...defaultConfig };

export const config = (config) => {
    loggerConfig = { ...loggerConfig, ...config };
};

const logLevels = {
    info: chalk.blue('INFO'),
    warn: chalk.yellow('WARN'),
    error: chalk.red.bold('ERROR'),
    debug: chalk.green('DEBUG'),
    log: chalk.white('LOG')
};

export const logger = tracer.console({
    format: "{{title}}:{{timestamp}} {{file}} - {{message}}",
    preprocess: (data) => {
        data.title = logLevels[data.title] || data.title;
        if (!loggerConfig.includeFileInfo) {
            data.file = '';
            data.line = '';
        } else {
            data.file = chalk.green(`${data.file}:${data.line}`);
        }
        if (loggerConfig.includeTimestamp) {
            data.timestamp = ` [${chalk.orange(moment().format(loggerConfig.timestampFormat))}]`;
        }
    },
    transport: (data) => {
        console.log(data.output);
        
        if (loggerConfig.logToFile) {
            fs.appendFile(loggerConfig.logFilePath, stripAnsi(data.output) + '\n', 'utf8', (err) => {
                if (err) console.error('Failed to write to log file:', err);
            });
        }
    }
});

const blankLineLogger = tracer.console({
    format: ""
});

export const blankLine = () => {
    blankLineLogger.log();
}