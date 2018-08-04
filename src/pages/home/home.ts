import { Component, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
// import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonProvider } from '../../providers/common/common';
import { PerqListService } from '../../services/perqs-list';
import { PerqDetail } from '../../pages/perqDetail/perqDetail';
import { DataService } from "../../services/data.service";
import { InAppBrowser } from '@ionic-native/in-app-browser';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  segmentView: string = "one";

  categoryId: any
  items: any[] = [];
  userLocation = {
    latitude: 0,
    longitude: 0
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public common: CommonProvider,
    private geolocation: Geolocation,
    private dataservice: DataService,
    public modalCtrl: ModalController,
    public changeDetector:ChangeDetectorRef,
    private perksService: PerqListService,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser
    //public afDB: AngularFireDatabase)
  ) {
    var me = this;
    let options = { enableHighAccuracy: true, timeout: 30000 };

    if (this.dataservice.getUserLocation() == null) {

      me.geolocation.getCurrentPosition(options).then((resp) => {
        me.userLocation.latitude = resp.coords.latitude;
        me.userLocation.longitude = resp.coords.longitude;
        let userLoc = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        }
        this.dataservice.setUserLocation(userLoc);
        me.getPerks();
      }).catch((error) => {

      });
    }

    else {
      let location = this.dataservice.getUserLocation();
      me.userLocation.latitude = location.lat;
      me.userLocation.longitude = location.lng;
      me.getPerks();
    }
  }
  getPerks() {
    var me = this;
    me.common.startLoading();
    this.perksService.perqsList(this.userLocation.latitude, this.userLocation.longitude)
      .then(data => {
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
  showDetail(item) {
    this.navCtrl.push('PerqDetail', { item: item })
    //const showDetail = this.modalCtrl.create('PerqDetail');
    //showDetail.present();
  }


  showGuide() {
    const showGuide = this.modalCtrl.create('Guide');
    showGuide.present();
  }

  openLink() {
    const browser = this.iab.create('https://ionicframework.com/', '_blank');
  }
  loadFormatedDate(date){
    var dates = this.common.formatDate(date);
      return dates;
  }
}
