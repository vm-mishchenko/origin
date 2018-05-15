import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';
import {EventBusService} from '../../application/event-bus';
import {LoginAction} from './actions/login.action';
import {LogoutAction} from './actions/logout.action';
import {IUserData} from './domain/user-data.interface';
import {UserModel} from './domain/user.model';
import {LOGIN_GUEST_UID, LOGIN_IS_GUEST_USER} from './login.constant';

/**
 * @desc
 * Contains all business module logic
 * Provide data for UI layer
 */
@Injectable()
export class LoginSandbox {
    currentUser$: Observable<UserModel> = new BehaviorSubject(undefined);

    constructor(private firebaseAuth: AngularFireAuth,
                private eventBusService: EventBusService,
                private zone: NgZone) {
        this.setUpInitialUserState();

        this.eventBusService.actions$.pipe(
            filter((action) => action instanceof LoginAction),
            map((action: LoginAction) => this.signIn(action.isGuest))
        ).subscribe();

        this.eventBusService.actions$.pipe(
            filter((action) => action instanceof LogoutAction),
            map(() => this.signOut())
        ).subscribe();
    }

    signIn(isGuest: boolean) {
        this.authenticateUser(isGuest).then((result) => {
            this.onSuccessSignIn(result.user);
        });
    }

    signOut() {
        this.currentUser$.pipe(
            first()
        ).subscribe((user) => {
            if (user.state.uid === LOGIN_GUEST_UID) {
                localStorage.setItem(LOGIN_IS_GUEST_USER, null);

                this.updateUser(null);
            } else {
                this.firebaseAuth.auth.signOut().then(() => {
                    this.updateUser(null);
                });
            }
        });
    }

    private authenticateUser(isGuest: boolean): Promise<any> {
        if (isGuest) {
            localStorage.setItem(LOGIN_IS_GUEST_USER, 'true');

            return Promise.resolve({
                user: this.getGuestUserData()
            });
        } else {
            return new Promise((resolve, reject) => {
                this.zone.run(() => {
                    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
                        .then(resolve, reject);
                });
            });
        }
    }

    private onSuccessSignIn(userData: IUserData) {
        this.updateUser(new UserModel({
            uid: userData.uid,
            displayName: userData.displayName,
            email: userData.email,
            emailVerified: userData.emailVerified,
            photoURL: userData.photoURL
        }));
    }

    private updateUser(user: UserModel) {
        (this.currentUser$ as BehaviorSubject<UserModel>).next(user);
    }

    private setUpInitialUserState() {
        if (JSON.parse(localStorage.getItem(LOGIN_IS_GUEST_USER))) {
            this.onSuccessSignIn(this.getGuestUserData());
        } else {
            this.firebaseAuth.authState.pipe(
                first()
            ).subscribe((user) => {
                if (user) {
                    this.onSuccessSignIn(user);
                } else {
                    this.updateUser(null);
                }
            });
        }
    }

    private getGuestUserData(): IUserData {
        return {
            uid: LOGIN_GUEST_UID,
            displayName: 'Guest',
            photoURL: null,
            emailVerified: null,
            email: null
        };
    }
}
