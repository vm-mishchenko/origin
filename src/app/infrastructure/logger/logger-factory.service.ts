import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';

@Injectable()
export class LoggerFactoryService {
    constructor() {
    }

    create(moduleName: string) {
        return new LoggerService(moduleName);
    }
}
