import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AbstractControl } from '@angular/forms';
/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommonProvider {
  loading: any;
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
  constructor(public alertController: AlertController, public loadingCtrl: LoadingController) {
    console.log('Hello CommonProvider Provider');
  }
  validateEmail(c: AbstractControl): { [key: string]: any } {
    let EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!c.value) return null;
    return EMAIL_REGEXP.test(c.value) ? null : {
      validEmail: true
    };
  }

  showMessage(title, message) {
    let alert = this.alertController.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();

  }
  startLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait...'
    });
    this.loading.present();

  }

  closeLoading() {
    this.loading.dismiss();

  }
  formatDate(date) {
    var dateCreated = new Date(parseInt(date));
    var strDate = this.monthNames[dateCreated.getMonth()] + "/" + dateCreated.getDate() + "/" + dateCreated.getFullYear();
    return strDate;
  }
}
