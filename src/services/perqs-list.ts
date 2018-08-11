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
      geoQuery.on("key_entered", function (key, location, distance) {
        eventFired = true;
        let knDistance = distance;
        firebaseRef.child(key).once('value', function (jobsSnapshot) {
          let locationId = jobsSnapshot.val().locationId;
          firebase.database().ref('locations').child(locationId).once('value').then(function (locationData) {
            console.log(locationData);
            firebase.database().ref('perqs').orderByChild('locationId').equalTo(locationId).once('value').then(function (perqsData) {
              // i++;
			  if(perqsData.numChildren() > 0)
			  {
              var keyNames = Object.keys(perqsData.val());
              for (let name of keyNames) {
                console.log(name);
                var perqsRec = perqsData.val()[name];
                if (parseInt(perqsRec.expires) >= new Date().getTime()) {
                  perqs.push({
                    'locationKey': locationData.key,
                    'perqsKey': name,
                    'announcement': locationData.val().announcement,
                    'city': locationData.val().city,
                    'instagram': locationData.val().instagram,
                    'snapchat': locationData.val().snapchat,
                    'facebook': locationData.val().facebook,
                    'locationLat': locationData.val().lat,
                    'locationLon': locationData.val().lon,
                    'locationName': locationData.val().name,
                    'phone': locationData.val().phone,
                    'state': locationData.val().state,
                    'locationImage': locationData.val().image,
                    'perqImage': perqsRec.image,
                    'perqLocation': perqsRec.location,
                    // 'type': perqsRec.type,
                   // 'account': perqsRec.account,
                    'perqName': perqsRec.name,
                    'expires': perqsRec.expires,
                    'distance': knDistance

                  });
                }

              }
			  }
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

  locationList(latitude: number, longitude: number): Promise<any> {
    var me = this;
    return new Promise((resolve, reject) => {
      var firebaseRef = firebase.database().ref('geofire');
      var geoFire = new GeoFire(firebaseRef);
      var geoQuery = geoFire.query({
        center: [latitude, longitude],
        radius: 400 // 1 miles = 1.60934 KM
      });
      let eventFired = false;

      var locations = [];
      var onReadyRegistration = geoQuery.on("ready", function () {
        geoQuery.cancel();
        if (!eventFired) {
          resolve(locations);
        }
      });
      geoQuery.on("key_entered", function (key, location, distance) {
        eventFired = true;
        let knDistance = distance;
        firebaseRef.child(key).once('value', function (jobsSnapshot) {
          let locationId = jobsSnapshot.val().locationId;
          firebase.database().ref('locations').child(locationId).once('value').then(function (locationData) {
             if(locationData.numChildren() > 0)
			 {
            locations.push({
              'locationKey': locationData.key,
              'perqsKey': name,
              'announcement': locationData.val().announcement,
              'city': locationData.val().city,
              'instagram': locationData.val().instagram,
              'snapchat': locationData.val().snapchat,
              'facebook': locationData.val().facebook,
              'locationLat': locationData.val().lat,
              'locationLon': locationData.val().lon,
              'locationName': locationData.val().name,
              'phone': locationData.val().phone,
              'state': locationData.val().state,
              'locationImage': locationData.val().image,
              'distance': knDistance

            });
			 }
            resolve(locations);

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
        firebaseRef.once('value', function (jobsSnapshot) {
          if (!jobsSnapshot.exists || jobsSnapshot.numChildren() == 0) {
            return resolve(items);
          }
          let snapshotObj = jobsSnapshot.val();
          var keyNames = Object.keys(snapshotObj);
          for (let name of keyNames) {
            i++;
            if (snapshotObj[name].perqsId == perqsId) {
              items.key = name;
              items.isFav = true;
            }
          }
          if (i == jobsSnapshot.numChildren()) {
            resolve(items);
          }


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

  getPerqs(locationKey): Promise<any> {
    {
      var perqs = [];
      var me = this;
      return new Promise((resolve, reject) => {
        firebase.database().ref('perqs/').orderByChild('locationId').equalTo(locationKey).once('value').then(function (perqsData) {
			if(perqsData.numChildren() > 0)
			 {
          var keyNames = Object.keys(perqsData.val());
          for (let name of keyNames) {
            console.log(name);
            var perqsRec = perqsData.val()[name];
            if (parseInt(perqsRec.expires) >= new Date().getTime()) {
              perqs.push({
                'perqsKey': name,
                'perqImage': perqsRec.image,
                'perqLocation': perqsRec.location,
                //'account': perqsRec.account,
                'perqName': perqsRec.name,
                'expires': perqsRec.expires
              });
            }
          }
			 }
          resolve(perqs);
        }, function (error) {
          reject(error);
        });

      })
    }
  }

}
