import { pino } from "pino";
import Locals from './Locals';
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

export default class Logger {
    public readonly logger;
    constructor(){
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const rootDirectory = path.join(__dirname, '..', '..');
        const logDirectory = path.join(rootDirectory, 'logs', today);
        
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }

        const rotatingStream = rfs.createStream('file.log', {
            size: '10M',             // Rotate when file exceeds 10MB
            interval: '1d',          // (Optional) Rotate daily, if desired
            path: logDirectory,
            maxFiles: 10,            // Keep up to 10 rotated files
            compress: 'gzip'         // Compress rotated files (optional)
        });

        this.logger = pino(
            {
                name: Locals.config().name,
                timestamp: pino.stdTimeFunctions.isoTime,
                formatters: {
                    level: (label) => ({ level: label.toUpperCase() })
                },
                level: 'debug'
            },
            rotatingStream
        );
    }

    public error(message: string, ...args: any[]): void {
        this.logger.error(message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        this.logger.info(message, ...args);
    }

    public debug(message: string, ...args: any[]): void {
        this.logger.debug(message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.logger.warn(message, ...args);
    }
}