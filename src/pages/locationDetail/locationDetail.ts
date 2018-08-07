import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CommonProvider } from '../../providers/common/common';
import { PerqListService } from '../../services/perqs-list';
//import { PerqsListService } from '../../services/perqs-list';
import { AuthService } from "../../services/auth";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-locationDetail',
  templateUrl: 'locationDetail.html'
})
export class LocationDetail {
  locationItem: any;
  items = [];
  segmentView: string = "one";
  locationKey: any;
  public itemRef: firebase.database.Reference = firebase.database().ref('/perqs');

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public common: CommonProvider,
    public changeDetector: ChangeDetectorRef,
    private perqsService: PerqListService,
    public authService: AuthService,
    private iab: InAppBrowser,
    public viewCtrl: ViewController) {
    this.locationItem = this.navParams.get("LocationData");
    this.loadPerqs(this.locationItem.locationKey);
  }
  segmentChanged(event){
      this.segmentView = event.value;
       this.changeDetector.detectChanges();
  }

  loadPerqs(locationId) {
    var me = this;
    me.common.startLoading();
    this.perqsService.getPerqs(locationId)
      .then(data => {
        console.log(data);
        me.common.closeLoading();
        data.sort(function (a, b) {
          return a.distance - b.distance;
        })
        me.items = data;
        me.changeDetector.detectChanges();

      })
      .catch(error => {
        me.common.closeLoading();
      });
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

  showDetail(item) {
    this.navCtrl.push('PerqDetail', { item: item })
    //const showDetail = this.modalCtrl.create('PerqDetail');
    //showDetail.present();
  }
  openLink() {
    const browser = this.iab.create('https://ionicframework.com/', '_blank');
  }
    loadFormatedDate(date) {
    if (date != null && date != 0) {
      if (date < new Date().getTime()) {
        return "";
      }
      var dates = this.common.formatDate(date);
      return "Expires on " +dates;
    }
    else {
      return "";
    }


  }
  // ionViewDidLoad() {
  //   itemRef.on('value', itemSnapshot => {
  //   // Here we'll work with the list
  //     this.items = [];
  //     itemSnapshot.forEach( itemSnap => {
  //       this.items.push(itemSnap.val());
  //       return false;
  //     });
  //   });
  // }

  //ionViewDidLoad() {
  //this.itemRef.on('value', itemSnapshot => {
  //this.items = [];
  //itemSnapshot.forEach( itemSnap => {
  //this.items.push(itemSnap.val());
  //return false;
  //});
  //});
  //}

}
