import {Component} from '@angular/core';
import {HomeViewController} from '../home-view/home-view.controller';

@Component({
    selector: 'o-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent {
    constructor(private homeController: HomeViewController) {
    }

    showMenu() {
        this.homeController.switchMenu();
    }
}
