import { Component, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { FirebaseService } from '../../shared/services/firebase.service';
import { ITotals } from '../../shared/interfaces/totals';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import * as _ from 'lodash';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage implements OnInit , OnChanges {
   
   @ViewChild(BaseChartDirective) public chart: BaseChartDirective;
   
   private graphOptions: any;
   private emotData:any; 
   
   emot$: Observable<ITotals[]>; 
   
   constructor(
      private navCtrl: NavController,
      private fs:FirebaseService
      ) {
   }

   ngOnInit(){
      this.emotData = this.initChart();
      this.emot$ = this.fs.getEmotionsSnapshots('date', 'asc');
      this.setGraphOptions();
      this.fillEmotions();
   }
   ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log('ngOnChanges....');
   }
   
   initChart(){
      var series = [
      {
         label:"Awareness", 
         data:[], 
         fill: false,
         pointRadius: 2,
         borderColor: 'Magenta',
         pointBorderColor: 'Black',
         backgroundColor: 'Yellow'
      },
      {
         label:"Complains", 
         data:[], 
         fill: false,
         pointRadius: 2,
         borderColor: 'Black',
         pointBorderColor: 'Black',
         backgroundColor: 'Yellow'
      },
      {
         label:"Good Things", 
         data:[], 
         fill: false,
         pointRadius: 2,
         borderColor: 'Green',
         pointBorderColor: 'Black',
         backgroundColor: 'Yellow'
      },
      {
         label:"Gratitude", 
         data:[], 
         fill: false,
         pointRadius: 2,
         borderColor: 'Gold',
         pointBorderColor: 'Black',
         backgroundColor: 'Yellow'
      },
      {
         label:"Health", 
         data:[], 
         fill: false,
         pointRadius: 2,
         borderColor: 'DodgerBlue',
         pointBorderColor: 'Black',
         backgroundColor: 'Yellow'
      },      
      {
         label:"Love", 
         data:[], 
         fill: false,
         pointRadius: 2,
         borderColor: 'Red',
         pointBorderColor: 'Black',
         backgroundColor: 'Yellow'
      }];
      return series;
   }
   setGraphOptions(): void {
        this.graphOptions = {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        callback: (label: number, index: number, labels: number[]) => {
                            return moment(label).format('D MMM');
                        },
                        maxRotation: 0
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        callback: (label: number, index: number, labels: number[]) => {
                            return label.toFixed(0);
                        }
                    }
                }]
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    label: (tooltipItem, data) => {
                        return moment(tooltipItem.xLabel).format('D MMM') + ': ' + parseFloat(tooltipItem.yLabel).toFixed(0);
                    }
                },
                opacity: .8
            },
            pan: {
                enabled: true,
                mode: 'x'
            },
            zoom: {
                enabled: true,
                mode: 'x',
                limits: {
                    max: 10,
                    min: 0.5
                }
            },
        };
    }
   fillEmotions():void{
      var dataAwareness = [];
      var dataComplain = [];
      var dataGoodThings = [];
      var dataGratitude = [];
      var dataLove = [];
      var dataHealth = [];
      
      this.emot$.subscribe(col => {
         console.log('snapshotChanges subscribe length: ',col.length);
         col.map((snap,i) => {
            const d = (snap as any).payload.doc;
            const item = d.data();
     
            let date = new Date(item.date); 
            //let date = moment().add(i,'days');
            dataAwareness.push({x: date, y: item.totalAwareness});   
            dataComplain.push({x: date, y: item.totalComplain});   
            dataGoodThings.push({x: date, y: item.totalGoodThings});   
            dataGratitude.push({x: date, y: item.totalGratitude});   
            dataHealth.push({x: date, y: item.totalHealth}); 
            dataLove.push({x: date, y: item.totalLove});   
         });
         
         let dsAwareness: any = {
            data: dataAwareness
         };
         let dsComplain: any = {
            data: dataComplain
         };
         let dsGoodThings: any = {
            data: dataGoodThings
         };
         let dsGratitude: any = {
            data: dataGratitude
         };    
         let dsHealth: any = {
            data: dataHealth
         };
         let dsLove: any = {
            data: dataLove
         }; 
         
         this.emotData = [];
         this.emotData.push(dsAwareness);
         this.emotData.push(dsComplain);
         this.emotData.push(dsGoodThings);
         this.emotData.push(dsGratitude);
         this.emotData.push(dsHealth);
         this.emotData.push(dsLove);
         
         console.log('emotData: ', this.emotData);
      });
   }
}
