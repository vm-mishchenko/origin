import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BusyStatusComponent } from './busy-status.component';

@NgModule({
    imports: [CommonModule],
    exports: [BusyStatusComponent],
    declarations: [BusyStatusComponent]
})
export class BusyStatusModule {
}
