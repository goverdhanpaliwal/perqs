import { Component } from '@angular/core';
import { NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';

//import { PerqsListService } from '../../services/perqs-list';
import { AuthService } from "../../services/auth";
import firebase from 'firebase';

@Component({
  selector: 'page-perqsList',
  templateUrl: 'perqsList.html'
})
export class PerqsList {
  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('/perqs');

  constructor(public navCtrl: NavController,
              public authService: AuthService) {

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
