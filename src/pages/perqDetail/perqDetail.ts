import { Component, ChangeDetectorRef } from '@angular/core';
import { ModalController, ViewController, IonicPage, NavParams, NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from "../../services/auth";
import firebase from 'firebase';
import { PerqListService } from '../../services/perqs-list';
import { DataService } from "../../services/data.service";
import { CommonProvider } from '../../providers/common/common';
@IonicPage()
@Component({
  selector: 'page-perqDetail',
  templateUrl: 'perqDetail.html'
})
export class PerqDetail {
     items = {
    perqsImage: "",
    perqLocation: "",
    //account: "",
    perqsKey: "",
    perqName: "",
    expires: "",
    locationKey: "",
    city: "",
    state: "",
    phone:''
  };
  isFavAdded: Boolean = false;
  favPerksKey = "";
  public itemRef: firebase.database.Reference = firebase.database().ref('/perqs');

  constructor(public navCtrl: NavController,
    public authService: AuthService,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public dataService: DataService,
    public common: CommonProvider,
    public cd: ChangeDetectorRef,
    private perksService: PerqListService,
    public modalCtrl: ModalController) {
    this.items = navParams.data.item;
    console.log('item ' + this.items.perqLocation);
    let user = this.dataService.getUserData();
    var me = this;
    me.common.startLoading();
    this.perksService.perqsFavCheck(this.items.perqsKey, user.uid).then((resp) => {
      me.common.closeLoading();
      me.isFavAdded = resp.isFav;
      me.favPerksKey = resp.key;
      me.cd.detectChanges();
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


  addToFav() {
    let user = this.dataService.getUserData();
    var me = this;
    me.common.startLoading();
    if (this.isFavAdded) {
      this.perksService.removeFav(this.items.perqsKey, user.uid, this.favPerksKey).then((resp) => {
        me.isFavAdded = resp.isFav;
        me.favPerksKey = resp.key;
        me.common.closeLoading();
        me.cd.detectChanges();
      });
    }
    else {
      this.perksService.addFav(this.items.perqsKey, user.uid).then((resp) => {
        me.isFavAdded = resp.isFav;
        me.favPerksKey = resp.key;
        me.common.closeLoading();
        me.cd.detectChanges();
      });
    }
  }

  loadFormatedDate(date) {
    if (date != null && date != 0) {
      if (date < new Date().getTime()) {
        return "";
      }
      var dates = this.common.formatDate(date);
      return "Expires on " + dates;
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
