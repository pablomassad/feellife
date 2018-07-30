import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SignUpPage } from './signup';
import { FirebaseService } from '../../shared/services/firebase.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(SignUpPage),
  ],
  declarations: [
    SignUpPage
  ],
  entryComponents: [ ],
  providers: [
    FirebaseService
  ]
})
export class SignUpModule {
  constructor() {
    console.log('SignUpModule constructor');
  }
}
