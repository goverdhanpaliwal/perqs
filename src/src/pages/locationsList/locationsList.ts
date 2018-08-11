import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonProvider } from '../../providers/common/common';
import { PerqListService } from '../../services/perqs-list';
import { PerqDetail } from '../../pages/perqDetail/perqDetail';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'page-locationsList',
  templateUrl: 'locationsList.html'
})
export class LocationsList {
  categoryId: any
  items: any[] = [];
  filter: any[] = [];
  searchTerm: string = '';
  userLocation = {
    latitude: 0,
    longitude: 0
  }
  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private dataservice: DataService,
    public common: CommonProvider,
    public changeDetector: ChangeDetectorRef,
    private perksService: PerqListService,
    public modalCtrl: ModalController) {
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

        alert("Please enable your geolocation to access this app.");
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
    this.perksService.locationList(this.userLocation.latitude, this.userLocation.longitude)
      .then(data => {
    console.log(data);
        me.common.closeLoading();
        data.sort(function (a, b) {
          return a.distance - b.distance;
        })
        me.items = data;
        me.filter = data;
        me.changeDetector.detectChanges();
      })
      .catch(error => {
        me.common.closeLoading();
      });
  }

  filterItems(searchTerm) {
    this.filter = this.items;
    return this.items.filter((item) => {
      return ((item.announcement.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) ||
        (item.state.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) ||
        (item.phone.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) ||
        (item.locationName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) ||
        (item.city.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1));
    });

  }
  onSearchInput() {
    this.filter = this.filterItems(this.searchTerm);
    this.changeDetector.detectChanges();
  }

  showDetail(record) {
    this.navCtrl.push('LocationDetail',{'LocationData':  record });

  }

  showDetail1() {
    const showDetail1 = this.modalCtrl.create('LocationDetail1');
    showDetail1.present();
  }

  showMap() {
    // let mapModal = this.modalCtrl.create('LocationsListMap', {
    //   categoryId: this.categoryId
    // });
    // //let profileModal = this.modalCtrl.create(MapDetailPage, {lat: deviceNum,lng:lng});
    // mapModal.present();
    this.navCtrl.push('LocationsListMapPage', { "mapData": this.filter })
  }

}
