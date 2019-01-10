import {ModuleWithProviders, NgModule} from '@angular/core';
import {FirebaseStorageModule} from '../firebase-storage/firebase-storage.module';
import {LocalStorageModule} from '../local-storage/local-storage.module';
import {StorageService} from './storage.service';

@NgModule({
    imports: [
        LocalStorageModule,
        FirebaseStorageModule
    ]
})
export class StorageModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StorageModule,
            providers: [
                StorageService
            ]
        };
    }
}
