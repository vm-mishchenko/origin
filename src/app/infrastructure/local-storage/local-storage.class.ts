import { Injectable } from '@angular/core';
import { cloneDeep, get, set } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { IStorage } from '../storage/storage.interface';

@Injectable()
export class LocalStorage implements IStorage {
    private localStorageDbKey = 'origin';
    private db: any;

    constructor() {
        this.restoreFromLocalStorage();
    }

    setItem(key: string, value: any): Promise<any> {
        set(this.db, this.prepareKey(key), cloneDeep(value));

        this.saveToLocalStorage();

        return Promise.resolve();
    }

    getItem(key: string): Observable<any> {
        return Observable.of(cloneDeep(get(this.db, this.prepareKey(key))));
    }

    getList(listName: string, fnBuilder: any): Observable<any[]> {
        return this.getItem(listName).map((result) => {
            result = result || {};

            return Object.keys(result)
                .filter((key) => Boolean(result[key]))
                .map((key) => result[key]);
        });
    }

    removeItem(key: string) {
        const setPromise = this.setItem(this.prepareKey(key), null);

        this.saveToLocalStorage();

        return setPromise;
    }

    private prepareKey(key: string): string {
        return key.replace(/\//g, '.');
    }

    private restoreFromLocalStorage() {
        this.db = JSON.parse(localStorage.getItem(this.localStorageDbKey)) || {};
    }

    private saveToLocalStorage() {
        localStorage.setItem(this.localStorageDbKey, JSON.stringify(this.db));
    }
}
