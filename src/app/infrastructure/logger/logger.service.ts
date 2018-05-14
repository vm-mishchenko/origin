import { ILogger } from './interfaces/logger.interface';

export class LoggerService implements ILogger {
    constructor(private moduleName: string) {
    }

    debug(message) {
        if (!process.env.isProduction) {
            /* tslint:disable:no-console */
            console.log(`Debug: ${this.moduleName} : ${message}`);
        }
    }

    log(message) {
        /* tslint:disable:no-console */
        console.log(`${this.moduleName} : ${message}`);
    }

    warning(message: string) {
        /* tslint:disable:no-console */
        console.warn(message);
    }
}
