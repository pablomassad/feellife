import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, IonicPage, ModalController, Modal } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from 'fwk-auth';
import { ApplicationService } from 'fwk-services';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Subscription } from 'rxjs'


@IonicPage()
@Component({
   selector: 'page-login',
   templateUrl: 'login.html'
})
export class LoginPage implements OnInit, OnDestroy {
   subUsr: Subscription
   subAuth: Subscription
   
   displayName: string
   email: string;
   password: string;
   todo: FormGroup;

   constructor(
      private appSrv: ApplicationService,
      private navCtrl: NavController,
      private modal: ModalController,
      private authSrv: AuthService,
      private formBuilder: FormBuilder,
      private fs: FirebaseService
   ) {
      console.log('LoginPage constructor');
      this.todo = this.formBuilder.group({
         fcn_email: ['', [Validators.required]],
         fcn_password: ['', [Validators.required]]
      });
   }
   ngOnDestroy() {
      console.warn('LoginPage destroy')
      this.subUsr.unsubscribe()
      //this.subAuth.unsubscribe()
   }
   ngOnInit() {
      console.log('LoginPage init');
      this.appSrv.showLoading()      
      this.authSrv.verifyLoggedIn().subscribe(data => {
         this.appSrv.hideLoading()
         if (data) {
            this.subUsr = this.fs.getUserById(this.getUid(data.email)).subscribe(usr => {
               if (usr != null)
                  this.redirectHome(usr)
               else { // New User
                  const u = {
                     contacts: {},
                     uid: this.getUid(data.email),
                     displayName: data.displayName,
                     email: data.email,
                     photoURL: data.photoURL
                  }
                  this.fs.addUser(u).then(x => {
                     this.appSrv.message('Usuario registrado OK!')
                  })
               }
            })
         }
      });
   }
   signup(): void {
      const mod: Modal = this.modal.create('SignUpPage', {
         signMode: 'signUp'
      }, {})
      mod.present()
      mod.onDidDismiss(data => {
      })      
   }
   signin() {
      this.appSrv.showLoading()
      this.authSrv.signInUser(this.email, this.password).then(data => {
         if (data === undefined){
            this.appSrv.message('Usuario o contraseña no valida!')
         }
         // else
         //    this.view.dismiss(true)
         this.appSrv.hideLoading()
      }).catch(err => {
         this.appSrv.hideLoading()
         this.appSrv.message('Falla en la autenticacion!')
      })
   }
   loginGoogle() {
      this.appSrv.showLoading()
      this.authSrv.loginGoogle().then((data) => {
         var token = data.credential.accessToken
         const usr = {
            uid: this.getUid(data.user.email),
            displayName: data.user.displayName,
            photoURL: data.user.photoURL
         }
         this.fs.updateUser(usr)
         console.log(token, data.user)
         this.appSrv.hideLoading()
         this.redirectHome(usr)
      }).catch((err) => {
         console.log('Error: ', err.message)
      })
   }
   logout() {
      this.authSrv.signOutUser()
   }   
   download() {
      this.fs.download('Feellife.apk')
   }
   private redirectHome(usr) {
      console.log('login provider: ' + usr)
      this.navCtrl.insert(0, 'UsuarioPage', { usr: usr });
      this.navCtrl.popToRoot();
   }
   private getUid(str) {
      const res = str.replace(/\./gi, '')
      return res
   }   
}






