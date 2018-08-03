import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, AbstractControl } from "@angular/forms";
import { AuthService } from '../../services/auth';
import { CommonProvider } from "../../providers/common/common";
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { DataService } from "../../services/data.service";
import { Events } from 'ionic-angular';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  // nextPage = SignupPage

  constructor(private authService: AuthService,
    private loadingCtrl: LoadingController,
    private menu: MenuController,
    private common: CommonProvider,
    private navCtrl: NavController,
    private dataservice: DataService,
    public events: Events,
    private alertCrtl: AlertController) {
    this.menu.swipeEnable(false);
    localStorage.setItem("isFirstTimeLoginTrue", 'true');
    this.loginForm = new FormGroup({
      email: new FormControl("", Validators.compose([Validators.required, this.common.validateEmail])
      ),
      pswrd: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])
      )
    });

  }

  onLogin() {
    const loading = this.loadingCtrl.create({
      content: "Signing you in..."
    });
    loading.present();
    this.authService.signin(this.loginForm.value.email, this.loginForm.value.pswrd)
      .then(data => {
        loading.dismiss();
        this.dataservice.setUserData(data.currentUser);
        this.events.publish('profile', data.name);
       // this.navCtrl.setRoot(HomePage);
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCrtl.create({
          title: "Failed Login",
          message: error.message,
          buttons: ['Ok']
        });
        alert.present()
      });
  }

  onCreateNewAccountClick(): void {
    this.navCtrl.setRoot(SignupPage);
  }
  onForgotPasswordClick(): void {
    let alert = this.alertCrtl.create({
      title: ' Forgot Password?',
      message: 'Enter your email so we can send you a reset password link.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Send',
          handler: (data) => {
            this.common.startLoading();
            this.authService.resetPassword(data.email).then(() => {
              this.common.showMessage('', "Reset instructions sent. Please check your e-mail.");
              this.common.closeLoading();
            }).catch((error: any) => {
              var errorMessage: string;
              switch (error.code) {
                case ("auth/invalid-email"):
                  errorMessage = "Please enter a valid e-mail.";
                  break;
                case "auth/user-not-found":
                  errorMessage = "User not found";
                  break;
                default:
                  errorMessage = "Something went wrong";
                  break;
              }
              this.common.showMessage('Error!', errorMessage);
              this.common.closeLoading();
            });
          }
        }
      ]
    });
    alert.present();

  }
}
