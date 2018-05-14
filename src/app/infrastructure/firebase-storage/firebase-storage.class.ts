import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { IStorage } from '../storage/storage.interface';

@Injectable()
export class FirebaseStorage implements IStorage {
    constructor(private db: AngularFireDatabase) {
    }

    setItem(key, data): Promise<any> {
        const itemRef = this.db.object(key);

        return itemRef.set(data);
    }

    getItem(key): Observable<any> {
        return this.db.object(key).snapshotChanges()
            .map((data) => {
                return data.payload.val();
            });
    }

    getList(listName: string, fnBuilder: any): Observable<any[]> {
        return this.db.list(listName, (ref) => fnBuilder(ref))
            .valueChanges();
    }

    removeItem(key): Promise<void> {
        return this.db.object(key).remove();
    }
}
