import { NgModule, ErrorHandler } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { CodePush } from '@ionic-native/code-push'
import { OneSignal } from '@ionic-native/onesignal'

import { EmotionsApp } from './app.component'
import { SharedModule } from '../shared/shared.module'

import 'firebase/storage';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { FirebaseService } from '../shared/services/firebase.service'

import { FwkServicesModule, ApplicationService, GlobalService, ProgressBarComponent } from 'fwk-services'
import { FwkAuthModule, AuthService } from 'fwk-auth'
import { ENVIRONMENTS } from '../environments';


@NgModule({
   declarations: [
      EmotionsApp
   ],
   imports: [
      FwkAuthModule,
      FwkServicesModule,
      BrowserModule,
      BrowserAnimationsModule,
      IonicModule.forRoot(EmotionsApp),
      AngularFirestoreModule,
      AngularFireModule.initializeApp(ENVIRONMENTS.firebase),
      SharedModule.forRoot()
   ],
   bootstrap: [IonicApp],
   entryComponents: [
      EmotionsApp,
      ProgressBarComponent
   ],
   providers: [
      OneSignal,
      AuthService,
      AngularFireAuth,
      ApplicationService,
      GlobalService,
      CodePush,
      FirebaseService,
      StatusBar,
      SplashScreen,
      { provide: ErrorHandler, useClass: IonicErrorHandler }
   ]
})
export class AppModule { }
