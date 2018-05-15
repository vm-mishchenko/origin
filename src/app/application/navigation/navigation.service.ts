import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {LoginDataStreams} from '../../features/login';
import {ILogger, LoggerFactoryService} from '../../infrastructure/logger';
import {EventBusService} from '../event-bus/event-bus.service';
import {NavigateToDefaultPageEvent} from './events/navigate-to-default-page.event';
import {NavigateToPageEvent} from './events/navigate-to-page.event';
import {NAVIGATION} from './navigation.constant';

@Injectable()
export class NavigationService {
    private logger: ILogger;

    constructor(private router: Router,
                private loginDataStreams: LoginDataStreams,
                private eventBusService: EventBusService,
                private loggerFactoryService: LoggerFactoryService) {
        this.logger = this.loggerFactoryService.create('Navigation');

        this.loginDataStreams.user$.pipe(
            filter((user) => user === null)
        ).subscribe(() => {
            this.toLoginPage();
        });

        this.loginDataStreams.user$.pipe(
            filter((user) => user && this.router.url === NAVIGATION.urls.login)
        ).subscribe(() => {
            this.toDefaultPage();
        });

        this.eventBusService.actions$.subscribe((action) => {
            if (action instanceof NavigateToPageEvent) {
                this.toPage(action.pageId);
            }

            if (action instanceof NavigateToDefaultPageEvent) {
                this.toDefaultPage();
            }
        });
    }

    toDefaultPage() {
        this.to(`${NAVIGATION.urls.defaultPage}`);
    }

    toPage(id: string) {
        this.to(`${NAVIGATION.urls.page}/${id}`);
    }

    toLoginPage() {
        this.to(NAVIGATION.urls.login);
    }

    private to(path: string) {
        this.logger.debug(`to ${path}`);

        this.router.navigate([path]);
    }
}
