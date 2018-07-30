import { NgModule, ModuleWithProviders } from '@angular/core'
import { IonicModule } from 'ionic-angular'
import { IonicStorageModule } from '@ionic/storage'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'

import { StorageService } from './services/storage.service'
import { PushingService } from './services/pushing.service'


@NgModule({
   imports: [
      CommonModule,
      IonicModule,
      HttpClientModule,
      IonicStorageModule.forRoot()
   ],
   providers: []   
})
export class SharedModule {
   static forRoot(): ModuleWithProviders {
      return {
         ngModule: SharedModule,
         providers: [
            PushingService           
         ]
      }
   }
}
