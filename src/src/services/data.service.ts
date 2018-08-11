import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class DataService {
  public userLoginData = null;
  public userLocation = null;
  constructor(
    public events: Events
  ) {

  }
  userId() {
    return this.userLoginData.id;
  }
  setUserData(data) {
    this.userLoginData = data;
  }
  getUserData() {
    return this.userLoginData;
  }
 
  
setUserLocation(data) {
    this.userLocation = data;
  }
  getUserLocation() {
    return this.userLocation;
  }

}
