import {Component, HostBinding} from '@angular/core';
import {AngularFireStorage} from 'angularfire2/storage';
import {Observable} from 'rxjs';
import {EventBusService} from '../../../../../application/event-bus';
import {NavigateToPageEvent} from '../../../../../application/navigation';
import {OriginUiController} from '../../../../../application/origin';
import {AddPageEvent} from '../../../../page';

@Component({
    selector: 'o-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    @HostBinding('class.opened__menu') showMenu: boolean = false;

    uploadPercent: Observable<number>;
    downloadURL: Observable<string>;

    constructor(private eventBusService: EventBusService,
                private originUiController: OriginUiController,
                private storage: AngularFireStorage) {
        this.originUiController.isMenuOpen$.subscribe((isMenuOpen) => {
            setTimeout(() => {
                this.showMenu = isMenuOpen;
            }, 0);
        });
    }

    uploadFile(event: any) {
        const file = event.target.files[0];
        const filePath = 'images';

        const task = this.storage.upload(filePath, file);

        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        // get notified when the download URL is available
        this.downloadURL = task.downloadURL();
    }

    onSelectedPage(id: string) {
        this.eventBusService.dispatch(new NavigateToPageEvent(id));
    }

    onAddPage() {
        this.eventBusService.dispatch(new AddPageEvent());
    }
}
