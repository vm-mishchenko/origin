import {Component} from '@angular/core';
import {HomeController} from '../../page-controlles/home/home.controller';

@Component({
    selector: 'o-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent {
    constructor(private homeController: HomeController) {
    }

    showMenu() {
        this.homeController.switchMenu();
    }
}
