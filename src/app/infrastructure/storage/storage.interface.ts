import {Observable} from 'rxjs';

export interface IStorage {
    setItem(key: string, value: any): Promise<any>;

    getItem(key: string): Observable<any>;

    getList(listName: string, queryFn: (ref: any) => {}): Observable<any[]>;

    removeItem(key: string): Promise<void>;
}
