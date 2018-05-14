import { NgModule } from '@angular/core';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseStorage } from './firebase-storage.class';

@NgModule({
    imports: [
        AngularFireDatabaseModule
    ],
    providers: [
        FirebaseStorage
    ]
})
export class FirebaseStorageModule {
}
