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
        }, function (error) {
          reject(error);
        });

      }, function (error) {
        reject(error);
      });
    });

  }

  perqsFavCheck(perqsId, userId): Promise<any> {
    {
      let items = {
        key: '',
        isFav: false
      };
      let i = 0;
      var firebaseRef = firebase.database().ref('favourites/' + userId);
      return new Promise((resolve, reject) => {
        firebaseRef.once('value', (jobsSnapshot) => {
          if (!jobsSnapshot.exists || jobsSnapshot.numChildren() == 0) {
            resolve(items);
          }
          jobsSnapshot.forEach(function (childSnapshot) {
            i++;
            if (childSnapshot.val().perqsId == perqsId) {
              items.key = childSnapshot.key;
              items.isFav = true;
            }
            if (i == jobsSnapshot.numChildren()) {
              resolve(items);
            }
          });


        }, function (error) {
          reject(error);
        });

      })
    }
  }

  removeFav(perqsId, userId, key): Promise<any> {

    let items = {
      key: '',
      isFav: true
    };
    var firebaseRef = firebase.database().ref('favourites/' + userId);
    return new Promise((resolve, reject) => {
      if (key != "") {
        firebaseRef.child(key).remove().then(function (favData) {
          items.key = "";
          items.isFav = false;
          resolve(items);
        }, function (error) {
          reject(error);
        });

      }


    })
  }
  addFav(perqsId, userId): Promise<any> {
    {
      let items = {
        key: '',
        isFav: false
      };
      var firebaseRef = firebase.database().ref('favourites/' + userId);
      return new Promise((resolve, reject) => {
        firebaseRef.push({
          'perqsId': perqsId
        }).then(function (favData) {
          items.key = favData.getKey();
          items.isFav = true;
          resolve(items);
        }, function (error) {
          reject(error);
        });

      })
    }
  }
}
