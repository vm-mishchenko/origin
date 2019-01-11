import {NgModule} from '@angular/core';
import {FileUploaderModule, FileUploaderService} from 'ngx-wall';
import {filter} from 'rxjs/operators';
import {IUserData, LOGIN_GUEST_UID, LoginDataStreams, LoginServiceModule} from '../../features/login-service';
import {ILogger, LoggerFactoryService} from '../../infrastructure/logger';
import {StorageService} from '../../infrastructure/storage';

@NgModule({
    imports: [
        LoginServiceModule,
        FileUploaderModule
    ],
})
export class OriginModule {
    private logger: ILogger = this.loggerFactoryService.create('Navigation');

    constructor(private loginDataStreams: LoginDataStreams,
                private fileUploaderService: FileUploaderService,
                private loggerFactoryService: LoggerFactoryService,
                private storageService: StorageService) {
        this.loginDataStreams.user$.pipe(
            filter((user) => Boolean(user))
        ).subscribe((user: IUserData) => {
            if (user.uid === LOGIN_GUEST_UID) {
                this.logger.debug('Switch to local storage');

                this.fileUploaderService.disable();
                this.storageService.switchToLocalStorage();
            } else {
                this.logger.debug('Switch to remote storage');

                this.fileUploaderService.enable();
                this.storageService.switchToRemoteStorage();
            }
        });
    }
}
