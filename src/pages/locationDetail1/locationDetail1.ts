import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

//import { PerqsListService } from '../../services/perqs-list';
import { AuthService } from "../../services/auth";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-locationDetail1',
  templateUrl: 'locationDetail1.html'
})
export class LocationDetail1 {
  segmentView: string = "one";
  rate: any = 3;
  public items: Array<any> = [];
  public itemRef: firebase.database.Reference = firebase.database().ref('/perqs');

  constructor(public navCtrl: NavController,
              public authService: AuthService,
              public viewCtrl: ViewController) {

  }

  closeModal() {
        this.viewCtrl.dismiss();
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
