import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import 'hammerjs';
import 'chartjs-plugin-zoom';

import { AdminPage } from './admin';

@NgModule({
  imports: [
    IonicPageModule.forChild(AdminPage),
    ChartsModule
  ],
  declarations: [
      AdminPage
    ],
  entryComponents:[ ],
  providers:[ ]
})
export class AdminModule {
    constructor(){
        console.log('AdminModule constructor');
    }
}
