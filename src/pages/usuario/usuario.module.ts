import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UsuarioService } from './usuario.service';
import { UsuarioPage } from './usuario';
import { FirebaseService } from '../../shared/services/firebase.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(UsuarioPage),
  ],
  declarations: [
    UsuarioPage
  ],
  entryComponents: [ ],
  providers: [
    UsuarioService,
    FirebaseService
  ]
})
export class UsuarioModule {
  constructor() {
    console.log('UsuarioModule constructor');
  }
}
