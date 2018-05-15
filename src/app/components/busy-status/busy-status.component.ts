import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'o-busy-status',
    template: `
        <div [ngClass]="{'busy': isBusy}"></div>
    `,
    styles: [`
        div {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 1rem;
            background: #00bd00;
            transition: background 0.05s linear;
        }

        .busy {
            background: #bd7300;
        }
    `]
})
export class BusyStatusComponent implements OnInit {
    @Input() isBusy: boolean;

    ngOnInit() {
    }
}
