import { Component } from '@angular/core';
import { ModalController, ViewController, IonicPage, NavParams, NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from "../../services/auth";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-perqDetail',
  templateUrl: 'perqDetail.html'
})
export class PerqDetail {
  items = {
    image:"",
    name:"",
    account: "",
    distance:"",
    announcement: "",
    perqsKey:"",
    facebook:"",
    phone:"",
    state:"",
    type:"",
    perqName:"",
    expires:""
  };
  
  public itemRef: firebase.database.Reference = firebase.database().ref('/perqs');

  constructor(public navCtrl: NavController,
              public authService: AuthService,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public modalCtrl: ModalController) {
                this.items = navParams.data.item;
                console.log(this.items);
  }

  closeModal() {
        this.viewCtrl.dismiss();
    }

  showDetail() {
      const showDetail = this.modalCtrl.create('LocationDetail');
      showDetail.present();
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
