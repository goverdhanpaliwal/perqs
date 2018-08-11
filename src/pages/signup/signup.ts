import { Component,ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from "../../services/auth";
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, AbstractControl, FormBuilder } from '@angular/forms';
import { CommonProvider } from "../../providers/common/common";
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { DataService } from "../../services/data.service";
import { Events } from 'ionic-angular';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public regForm: FormGroup;
  constructor(private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCrtl: AlertController,
    private navCtrl: NavController,
    private common: CommonProvider,
    private changeDetector:ChangeDetectorRef,
    public events: Events,
    private dataservice: DataService,
    private formBuilder: FormBuilder,
    private modal: ModalController) {
    this.regForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, this.common.validateEmail])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      pswrd: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, { validator: this.matchingPasswords('pswrd', 'confirmPassword') },
    );
    localStorage.setItem("isFirstTimeLoginTrue", 'true');
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  goToLoginPage() {
    this.navCtrl.setRoot(LoginPage);
  }

  onSignup() {
    const loading = this.loadingCtrl.create({
      content: "Signing you up!"
    });
    loading.present();
    this.authService.signup(this.regForm.value.email, this.regForm.value.pswrd, this.regForm.value.name)
      .then(data => {
        loading.dismiss();
        this.events.publish('profile', data.name);
        this.dataservice.setUserData(data.currentUser);
        //   this.navCtrl.setRoot(HomePage);
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCrtl.create({
          title: "Signup Failed!",
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      })
  }
  onChange(){
    this.changeDetector.detectChanges();
  }
}
