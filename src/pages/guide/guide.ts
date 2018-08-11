import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html'
})
export class Guide {

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              ) {

  }

  closeModal() {
        this.viewCtrl.dismiss();
    }

}
