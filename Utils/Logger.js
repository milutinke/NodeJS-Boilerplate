// Libraries
const Config = require('../Config');
const SimpleNodeLogger = require('simple-node-logger');
const FileSystem = require('fs');
const Colors = require('colors');

// Logger Class
class Logger {
    constructor() {
        if (!Config.Logging.Enabled)
            return;

        const logDirectory = __dirname + '/../' + Config.Logging.Directory;

        if (!FileSystem.existsSync(logDirectory))
            FileSystem.mkdirSync(logDirectory);

        this.logger = SimpleNodeLogger.createRollingFileLogger({
            logDirectory: logDirectory,
            fileNamePattern: Config.Logging.FileFormat,
            dateFormat: Config.Logging.DateFormat,
            timestampFormat: Config.Logging.TimeStampFormat
        });
    }

    info(message) {
        if (!Config.Logging.Enabled)
            return;

        if (!Config.Logging.Levels.includes('info'))
            return;

        this.logger.info(message);
        console.log(`${message}`.bgGreen.gray);
    }

    warn(message) {
        if (!Config.Logging.Enabled)
            return;

        if (!Config.Logging.Levels.includes('warn'))
            return;
        this.logger.warn(message);
        console.log(`${message}`.bgYellow.red);
    }

    error(message) {
        if (!Config.Logging.Enabled)
            return;

        if (!Config.Logging.Levels.includes('error'))
            return;

        this.logger.error(message);
        console.log(`${message}`.bgRed.white);
    }

    trace(message) {
        if (!Config.Logging.Enabled)
            return;

        if (!Config.Logging.Levels.includes('trace'))
            return;

        this.logger.trace(message);
        console.log(`${message}`.bgYellow.black);
    }

    debug(message) {
        if (!Config.Logging.Enabled)
            return;

        if (!Config.Logging.Levels.includes('debug'))
            return;

        this.logger.debug(message);
        console.log(`${message}`.bgMagenta.gray);
    }

    fatal(message) {
        if (!Config.Logging.Enabled)
            return;

        if (!Config.Logging.Levels.includes('fatal'))
            return;

        this.logger.fatal('FATAL: ' + message);
        console.log(`FATAL: ${message}`.bgRed.white);
    }
}

// Module exports
module.exports = new Logger();