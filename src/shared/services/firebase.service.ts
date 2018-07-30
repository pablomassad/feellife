import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ITotals } from '../interfaces/totals';
import 'rxjs/add/operator/map'
import * as firebase from 'firebase/app'
import { Observable } from 'rxjs/Rx'


@Injectable()
export class FirebaseService {

   usersRef: AngularFirestoreCollection<any>

   testRef: AngularFirestoreCollection<ITotals>;
   test$: Observable<any[]>;

   constructor(private afs: AngularFirestore) {
      console.log('FirebaseService constructor')
      this.usersRef = this.afs.collection('users')
   }

   getUserById(uid){
      const uref = this.usersRef.doc(uid)
      const obs = uref.valueChanges()
      return obs
   }
   addUser(usr) {
      const ref = this.usersRef.doc(usr.uid).set(usr)
      return ref;
   }
   updateUser(usr):Promise<void> {
      // const ref = this.afs.collection('users').doc(usr.uid).set(usr, { merge: true })
      const ref = this.usersRef.doc(usr.uid).set(usr)
      return ref
   }

   //////////////////////////////////////////////////////////
   getEmotionsSnapshots(sortName, sortDir): Observable<ITotals[]> {
      this.testRef = this.afs.collection('emotionsByDay', ref => ref.orderBy(sortName, sortDir));
      this.test$ = this.testRef.snapshotChanges();
      return this.test$;
   }

   getTotals(uid): Observable<any> {
      var un = this.getUserKey(uid);
      var d = new Date();
      var yyyy = d.getFullYear();
      var sm = (d.getMonth() + 1);
      var mm = ("0" + sm).slice(-2);
      var sd = d.getDate();
      var dd = ("0" + sd).slice(-2);
      var dstr = yyyy + mm + dd;
      var key = un + '_' + dstr;
      var totRef = this.afs.doc('totalsByDate/' + key);
      var res = totRef.valueChanges();
      return res;
   }

   saveEmotion(pl): Promise<any> {
      const path = `emotions/${pl.user}_${pl.datetime}`;
      var p = this.afs.doc(path).set(Object.assign({}, pl));
      // var ref = this.afs.collection<Emotion>('emotions');
      // var p = ref.add({ ...pl });
      return p;
   }
   getUserKey(uid): string {
      var str = uid.replace(/\s/g, '');
      str = str.toUpperCase();
      return str;
   }


   //////////////////////////////////////////////////////////
   download(filename) {
      // Create a reference with an initial file path and name
      const st = firebase.storage();
      const pathReference = st.ref(filename);
      const refGS = st.refFromURL('gs://events-12be3.appspot.com/'+filename)
      refGS.getDownloadURL().then(function (url) {
         window.open(url, '_system')
      }).catch(function (error) {
         switch (error.code) {
            case 'storage/object_not_found':
               this.appSrv.message('No se ha encontrado el archivo!')
               break;

            case 'storage/unauthorized':
               this.appSrv.message('No tiene permiso para bajar el archivo!')
               break;

            case 'storage/canceled':
               this.appSrv.message('Se ha cancelado la descarga!')
               break;

            case 'storage/unknown':
               this.appSrv.message('Ha ocurrido un error desconocido!')
               break;
         }
      });
   }
}
