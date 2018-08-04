import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { Intro } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { AuthService } from '../services/auth';
import { HomePage } from '../pages/home/home';
import { PerqDetail } from '../pages/perqDetail/perqDetail';
import { DataService } from '../services/data.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  loginPage = LoginPage;
  signupPage = SignupPage;
  profilePage = ProfilePage;
  name = "";
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
    private menuCtrl: MenuController,
    private authService: AuthService,
    statusBar: StatusBar,
    private loadingCtrl: LoadingController,
    public events: Events,
    public dataService:DataService,
    public changeDetector: ChangeDetectorRef,
    splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.events.subscribe('profile', (name) => {
        this.name = name;
      });
      var me = this;

      firebase.auth().onAuthStateChanged(user => {
        setTimeout(() => {
          if (user) {
            me.isAuthenticated = true;
            me.rootPage = TabsPage;
            this.dataService.setUserData(user);
            me.authService.getProfileInfo().then((profile) => {
              me.events.publish('profile', profile.name);
            });
            me.changeDetector.detectChanges();
          } else {
            me.isAuthenticated = false;
            me.rootPage = (localStorage.getItem("isFirstTimeLoginTrue") == 'true') ? LoginPage : 'Intro';
            me.changeDetector.detectChanges();
          }
        }, 1000);

      });
    });


  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(LoginPage);
  }
}
