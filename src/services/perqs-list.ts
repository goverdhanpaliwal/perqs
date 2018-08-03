import { Injectable } from "@angular/core";
import firebase from 'firebase';
import 'rxjs/add/operator/map';
import { AuthService } from "./auth";
declare var GeoFire: any;
@Injectable()
export class PerqListService {

  constructor(private authService: AuthService) {
  }

  perqsList(latitude: number, longitude: number): Promise<any> {
    var me = this;
    return new Promise((resolve, reject) => {
      var firebaseRef = firebase.database().ref('geofire');
      var geoFire = new GeoFire(firebaseRef);
      var geoQuery = geoFire.query({
        center: [latitude, longitude],
        radius: 400 // 1 miles = 1.60934 KM
      });
      let eventFired = false;

      var perqs = [];
      var onReadyRegistration = geoQuery.on("ready", function () {
        geoQuery.cancel();
        if (!eventFired) {
          resolve(perqs);
        }
      });

      let j = 0;
      let i = 0;
      geoQuery.on("key_entered", function (key, location, distance) {
        eventFired = true;
        let knDistance = distance;
        j++;

        firebaseRef.child(key).once('value', function (jobsSnapshot) {
          let locationId = jobsSnapshot.val().locationId;
          firebase.database().ref('locations').child(locationId).once('value').then(function (locationData) {
            firebase.database().ref('perqs').child(locationData.val().perqsId).once('value').then(function (perqsData) {
              i++;
              perqs.push({
                'locationKey': locationData.key,
                'perqsKey': perqsData.key,
                'announcement': locationData.val().announcement,
                'city': locationData.val().city,
                'facebook': locationData.val().facebook,
                'locationLat': locationData.val().locationLat,
                'locationLon': locationData.val().locationLon,
                'name': locationData.val().name,
                'phone': locationData.val().phone,
                'state': locationData.val().state,
                'image': perqsData.val().image,
                'type': perqsData.val().type,
                'account': perqsData.val().account,
                'perqName': perqsData.val().name,
                'expires': perqsData.val().expires,
                'distance': knDistance

              });
              if (i == j)
                resolve(perqs);
            });

          });



        });

      });


    });

  }
}
