import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ILogger, LoggerFactoryService} from '../../infrastructure/logger';
import {IEvent} from './interfaces/event.interface';

@Injectable()
export class EventBusService {
    actions$: Observable<IEvent> = new Subject();

    private logger: ILogger = this.loggerFactoryService.create('Event Bus');

    constructor(private loggerFactoryService: LoggerFactoryService) {
    }

    dispatch(event: IEvent) {
        this.logger.debug(`${event.type}`);

        (this.actions$ as Subject<IEvent>).next(event);
    }
}
