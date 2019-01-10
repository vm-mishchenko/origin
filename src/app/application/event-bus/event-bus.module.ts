import {ModuleWithProviders, NgModule} from '@angular/core';
import {EventBusService} from './event-bus.service';

@NgModule()
export class EventBusModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EventBusModule,
            providers: [
                EventBusService
            ]
        };
    }
}
