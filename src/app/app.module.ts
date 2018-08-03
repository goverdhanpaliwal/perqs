import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//import { ParallaxHeader } from '../directives/parallax-header/parallax-header'

//import { PerqsListService } from '../services/perqs-list';
import { PerqsList } from '../pages/perqsList/perqsList';
import { LocationsList } from '../pages/locationsList/locationsList';
import { LocationDetail } from '../pages/locationDetail/locationDetail';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { Guide } from '../pages/guide/guide';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
//import { Intro } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { Geolocation } from '@ionic-native/geolocation';
import { PerqListService } from '../services/perqs-list';
//***********  Angularfire2 v5 **************/
import { InAppBrowser } from '@ionic-native/in-app-browser';

//import { AngularFireModule } from 'angularfire2';
// New imports to update based on AngularFire2 version 4
//import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
//import { AngularFireAuthModule } from 'angularfire2/auth';
//import { PerqDetail } from '../pages/perqDetail/perqDetail'
import { AuthService } from "../services/auth";
import { DataService } from '../services/data.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
// Providers
import { CommonProvider } from '../providers/common/common';


export const config = {
  apiKey: "AIzaSyCpmiiGRSRTkMaS9f2saSAB31Ln_KSR5R4",
  authDomain: "perqs-d6f6e.firebaseapp.com",
  databaseURL: "https://perqs-d6f6e.firebaseio.com",
  projectId: "perqs-d6f6e",
  storageBucket: "perqs-d6f6e.appspot.com",
  messagingSenderId: "195404392139"
  /*   apiKey: "AIzaSyBjWxX1Ps6_0z48dAvWfHuYljZyowyKFpM",
    authDomain: "perqs-7325e.firebaseapp.com",
    databaseURL: "https://perqs-7325e.firebaseio.com",
    projectId: "perqs-7325e",
    storageBucket: "",
    messagingSenderId: "965618582209"*/
  };
  firebase.initializeApp(config);


@NgModule({
  declarations: [
    MyApp,
    PerqsList,
    LocationsList,
    HomePage,
    ProfilePage,
    TabsPage,
    SignupPage,
   // Intro,
    LoginPage,
    //ParallaxHeader,
 //   PerqDetail
  ],
  imports: [
    BrowserModule,
  //  AngularFireModule.initializeApp(config),
 //   AngularFireDatabaseModule,
 //   AngularFireAuthModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
    }),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PerqsList,
    LocationsList,
    HomePage,
    ProfilePage,
    TabsPage,
    SignupPage,
    LoginPage,
   // PerqDetail,
  //  Intro
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //PerqsListService,
    AuthService,
    DataService,
    CommonProvider,
    Geolocation,
    PerqListService,
    InAppBrowser
  ]
})
export class AppModule {}
