import firebase from 'firebase';

export class AuthService {

  signup(email: string, password: string, name: string): Promise<any> {
    var me = this;
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        var currentUser = firebase.auth().currentUser;
        me.saveProfileData(currentUser, name);
        var obj = {
          currentUser: currentUser,
          name: name
        }
        resolve(obj);
      }, function (error) {
        reject(error);
      });
    });
  }

  saveProfileData(currentUser, name) {
    firebase.database().ref('/profile/' + currentUser.uid).set({
      name: name,
      date: new Date().getTime(),
      email: currentUser.email
    });
  }

  signin(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        var currentUser = firebase.auth().currentUser;
        firebase.database().ref('/profile/' + currentUser.uid).once('value').then(function (profileUser) {
          let userName = profileUser.val().name;
          var obj = {
            currentUser: currentUser,
            name: userName
          }
          resolve(obj);
        });

      }, function (error) {
        reject(error);
      });
    });
  }

  getProfileInfo(): Promise<any> {
    var currentUser = firebase.auth().currentUser;
    return new Promise((resolve, reject) => {
      firebase.database().ref('/profile/' + currentUser.uid).once('value').then(function (profileUser) {
        resolve(profileUser.val());
      }, function (error) {
        reject(error);
      });
    });
  }

  logout() {
    firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }
}
