import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
//import * as moment from 'moment'

admin.initializeApp(functions.config().firebase)


export const emotionEvent = functions.firestore.document('emotions/{eid}').onWrite((event) => {
   const after = event.after
   //const eid = ctx.params.eid
   ////////////////////////////////////////////////////////////

   const d = new Date(after.get('datetime'))
   const yyyy = d.getFullYear()
   const sm = (d.getMonth() + 1) 
   const mm = ("0" + sm).slice(-2)
   const sd = d.getDate()
   const dd = ("0" + sd).slice(-2)
   const dstr = yyyy + mm + dd
   const key = after.get('user') + '_' + dstr
   const p = aggregateTotals(key, after.get('emotion'))
   return p
})

export const realtimeDB = functions.database.ref('test/{eid}').onCreate((snapshot, context) => {
   const eid = context.params.eid

   const msgData = snapshot.val()
   const txt = msgData.text + " OK! on id: " + eid
   const p = snapshot.ref.update({text: txt})
   return p
})

export const getStats = functions.https.onRequest(async(request, response) => {
   try {
      const param = request.params.get('day')
      console.log('param: ', param)
      const snapshot = await admin.firestore().collection('totalsByDate').doc(param).get()
      const data = snapshot.data()
      console.log('data: ', data)
      response.send(data)
   } catch (error) {
      console.log('error: ', error)
      response.status(500).send(error)
   }
})



function aggregateTotals(key, emo) {
   const ref = admin.firestore().collection('totalsByDate').doc(key)
   const pget = ref.get()
       .then(doc => {
           const item = doc.data();
           //console.log('totalsByDate reg: ', item);

           if (item) {
               if (item[emo])
                   item[emo] = item[emo] + 1;
               else
                   item[emo] = 1;
               //console.log('update item: ', item);
               const pset1 = ref.set(item)
               pset1.then(c => console.log('FIN: update totalsByDate: ', key))
               .catch(err=>{
                  console.log('error: ', err)
               })
           }
           else {// NUEVO registro
               const x = {};
               x[emo] = 1;
               //console.log('insert item: ', x);
               const pset2 = ref.set(x)
               pset2.then(c => console.log('FIN: new totalsByDate: ', key))
               .catch(err=>{
                  console.log('error: ', err)
               })
           }
       })
       .catch(err => {
           console.log('Error: updating key totals:', err);
       });
   return pget;
}







// export const emotionEvent = functions.https.onRequest((request, response) => {
//    const arr = request.params[0].split('/')
//    const idEvt = arr[1]
//    const idUsr = arr[2]

//    console.log('arr: ', arr)

//    admin.firestore().collection("events").doc(idEvt).get()
//       .then(dsse => {
//          const evt = dsse.data()
//          admin.firestore().collection("users").doc(idUsr).get()
//             .then(dssu => {
//                const usr = dssu.data()
//                evt.members[usr.uid] = true
//                admin.firestore().collection('events').doc(idEvt).set(evt)
//                   .then(dssm => {
//                      console.log('User: '+usr.uid + ' member of event: ' + evt.name)
//                      admin.firestore().collection("users").doc(evt.owner).get()
//                      .then(dsso =>{
//                         const ownerInfo = dsso.data()
//                         ownerInfo.contacts[usr.uid] = true
//                         admin.firestore().collection('users').doc(evt.owner).set(ownerInfo)
//                         .then(dsmc =>{
//                            console.log('User: '+usr.uid + ' contact of owner: ' + evt.owner)
//                            const payload = {
//                               notification: {
//                                  title: usr.displayName + ', se ha agregado al evento:',
//                                  body: evt.name
//                               },
//                               data: {
//                               }
//                            };
//                            console.log('Push: ', payload)
//                            admin.messaging().sendToTopic(idEvt, payload)
//                               .then(m => {
//                                  console.log('Pushing OK')
//                                  response.send(true)
//                               })
//                               .catch(err => {
//                                  console.log('Error Pushing: ', err)
//                                  response.status(500).send(err)
//                               })
//                         })
//                         .catch(err => {
//                            console.log('Error Contacts: ', err)
//                            response.status(500).send(err)
//                         })
//                      })
//                      .catch(err => {
//                         console.log('Error Owner: ', err)
//                         response.status(500).send(err)
//                      })
//                   })
//                   .catch(err => {
//                      console.log('Error Members: ', err)
//                      response.status(500).send(err)
//                   })
//             })
//             .catch(err => {
//                console.log('Error Users: ', err)
//                response.status(500).send(err)
//             })
//       })
//       .catch(err => {
//          console.log('Error Events: ', err)
//          response.status(500).send(err)
//       })
// })