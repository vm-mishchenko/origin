import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginModule} from '../../features/login';
import {LoginViewComponent} from './containers/login-view/login-view.component';

@NgModule({
  imports: [
    CommonModule,
    LoginModule
  ],
  declarations: [LoginViewComponent],
  exports: [LoginViewComponent]
})
export class LoginViewModule { }
