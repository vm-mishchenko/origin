import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FirebaseStorage } from '../firebase-storage/firebase-storage.class';
import { LocalStorage } from '../local-storage/local-storage.class';
import { IStorage } from './storage.interface';

@Injectable()
export class StorageService implements IStorage {
    saving$: Observable<boolean> = new Subject();

    private currentStorage: IStorage;

    constructor(private localStorage: LocalStorage,
                private firebaseStorage: FirebaseStorage) {
    }

    setItem(key: string, value: any): Promise<any> {
        this.updateSavingStatus(true);

        return this.currentStorage.setItem.apply(this.currentStorage, arguments)
            .then(() => {
                this.updateSavingStatus(false);
            }).catch(() => {
                this.updateSavingStatus(false);
            });
    }

    getItem(key: string) {
        return this.currentStorage.getItem.apply(this.currentStorage, arguments);
    }

    getList(listName: string, queryFn: (ref: any) => {}) {
        return this.currentStorage.getList.apply(this.currentStorage, arguments);
    }

    removeItem(key: string): Promise<void> {
        this.updateSavingStatus(true);

        return this.currentStorage.removeItem.apply(this.currentStorage, arguments)
            .then(() => {
                this.updateSavingStatus(false);
            }).catch(() => {
                this.updateSavingStatus(false);
            });
    }

    switchToLocalStorage() {
        this.currentStorage = this.localStorage;
    }

    switchToRemoteStorage() {
        this.currentStorage = this.firebaseStorage;
    }

    private updateSavingStatus(saving: boolean) {
        (this.saving$ as Subject<boolean>).next(saving);
    }
}
