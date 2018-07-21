import {Injectable} from '@angular/core';
import {AngularFireStorage} from 'angularfire2/storage';
import {IFileUploader, IFileUploadTask} from 'ngx-wall';
import {forkJoin, from, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {IUserData, LoginDataStreams} from '../../features/login';
import {ILogger, LoggerFactoryService} from '../logger';
import {FIREBASE_LOCAL_STORAGE_KEY} from './firebase-file-uploader.constant';

@Injectable()
export class FirebaseFileUploaderService implements IFileUploader {
    private user: IUserData;

    private fileReferenceHooks: Array<(filePath: string) => string> = [];

    private logger: ILogger = this.loggerFactoryService.create('Firebase File Uploader Service');

    constructor(private storage: AngularFireStorage,
                private loggerFactoryService: LoggerFactoryService,
                private loginDataStreams: LoginDataStreams) {
        this.loginDataStreams.user$.subscribe((currentUser) => {
            this.user = currentUser;

            if (this.user) {
                // check whether for current user exists files that were not deleted on previous session
                const userFilePathsMarkedToRemove = this.getUserFilePathsMarkedToRemove();

                forkJoin(userFilePathsMarkedToRemove
                    .map((userFilePathMarkedToRemove) => this.removeFile(userFilePathMarkedToRemove)))
                    .subscribe(() => {
                        this.logger.debug(
                            `${userFilePathsMarkedToRemove.length} files were remove from firebase storage`
                        );
                    });
            }
        });
    }

    upload(filePath: string, file: File): IFileUploadTask {
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, file);

        return {
            snapshotChanges: () => {
                // wait until download will be finished
                return from(uploadTask.then(() => {
                    // only after file is uploaded we could get downloaded url
                    return fileRef.getDownloadURL()
                        .toPromise()
                        .then(function (downloadURL) {
                            return {
                                downloadURL
                            };
                        });
                }));
            },

            percentageChanges: uploadTask.percentageChanges
        };
    }

    /**
     * Critical operation! In unsuccessful scenario may leave dead file in storage!
     */
    remove(filePath: string): Observable<void> {
        this.persistFilePathToRemove(filePath);

        return this.removeFile(filePath);
    }

    registerFileReferenceHook(fn: (filePath: string) => string) {
        this.fileReferenceHooks.push(fn);
    }

    getFileReference(filePath: string) {
        this.fileReferenceHooks.forEach((fileReferenceHook) => {
            filePath = fileReferenceHook(filePath);
        });

        return filePath;
    }

    private removeFile(filePath: string): Observable<void> {
        return this.storage.ref(filePath)
            .delete()
            .pipe(
                tap(() => {
                    this.removeFilePath(filePath);
                })
            );
    }

    private persistFilePathToRemove(filePath: string): void {
        const filePaths = this.getFilePathsMarkedToRemove();

        filePaths.push(filePath);

        localStorage.setItem(FIREBASE_LOCAL_STORAGE_KEY, JSON.stringify(filePaths));
    }

    private removeFilePath(filePath: string) {
        const filePaths = this.getFilePathsMarkedToRemove();

        const filePathIndex = filePaths.findIndex((currentFilePath) => currentFilePath === filePath);

        if (filePathIndex !== -1) {
            filePaths.splice(filePathIndex, 1);
        } else {
            this.logger.warning(`Cannot find ${filePath} file path`);
        }

        localStorage.setItem(FIREBASE_LOCAL_STORAGE_KEY, JSON.stringify(filePaths));
    }

    private getFilePathsMarkedToRemove(): string[] {
        return JSON.parse(localStorage.getItem(FIREBASE_LOCAL_STORAGE_KEY)) || [];
    }

    private getUserFilePathsMarkedToRemove(): string[] {
        const filePaths = this.getFilePathsMarkedToRemove();

        return filePaths.filter((filePath) => {
            const filePathArr = filePath.split('/');

            return filePathArr[0] === this.user.uid;
        });
    }
}
