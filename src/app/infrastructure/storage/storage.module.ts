import { NgModule } from '@angular/core';
import { FirebaseStorageModule } from '../firebase-storage/firebase-storage.module';
import { LocalStorageModule } from '../local-storage/local-storage.module';
import { StorageService } from './storage.service';

@NgModule({
    imports: [
        LocalStorageModule,
        FirebaseStorageModule
    ],
    providers: [
        StorageService
    ]
})
export class StorageModule {
}
