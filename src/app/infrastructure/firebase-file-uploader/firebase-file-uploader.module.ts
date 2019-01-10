import {NgModule} from '@angular/core';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {FileUploaderModule, FileUploaderService} from 'ngx-wall';
import {LoginServiceModule} from '../../features/login-service';
import {LoggerModule} from '../logger';
import {FIREBASE_FILE_UPLOADER_TYPE} from './firebase-file-uploader.constant';
import {FirebaseFileUploaderService} from './firebase-file-uploader.service';

@NgModule({
    imports: [
        AngularFireStorageModule,
        FileUploaderModule,
        LoginServiceModule,
        LoggerModule
    ],
    exports: [],
    declarations: [],
    providers: [
        FirebaseFileUploaderService
    ]
})
export class FirebaseFileUploaderModule {
    constructor(private fileUploaderService: FileUploaderService,
                private firebaseFileUploaderService: FirebaseFileUploaderService) {
        this.fileUploaderService.registerUploadService(FIREBASE_FILE_UPLOADER_TYPE, firebaseFileUploaderService);
    }
}
