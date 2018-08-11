import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
declare var google;
import { DataService } from "../../services/data.service";
@IonicPage()
@Component({
    selector: 'page-locationsListMap',
    templateUrl: 'locationsListMap.html'
})
export class LocationsListMapPage {
    @ViewChild('map') mapElement: ElementRef;
    categoryId: any
    items: any[] = [];

    map: any;
    markerSelected: boolean = false;
    //******************** Map style  **************************//
    //***** go to snazzymaps.com for more map style  ***********//
    //**********************************************************//
    mapStyle: any = [{ "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "color": "#faf5ed" }, { "lightness": "0" }, { "gamma": "1" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#bae5a6" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "weight": "1.00" }, { "gamma": "1.8" }, { "saturation": "0" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ffb200" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "lightness": "0" }, { "gamma": "1" }] }, { "featureType": "transit.station.airport", "elementType": "all", "stylers": [{ "hue": "#b000ff" }, { "saturation": "23" }, { "lightness": "-4" }, { "gamma": "0.80" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#a0daf2" }] }];

    infoWindows: any = [];

    constructor(public navCtrl: NavController,
        public dataservice: DataService,
        public navParams: NavParams, public loadingCtrl: LoadingController, public viewCtrl: ViewController) {

        /* let loadingPopup = this.loadingCtrl.create({
             spinner: 'crescent',
             content: ''
           });
           loadingPopup.present();
     
           this.categoryId = this.navParams.get('categoryId');
           this.afDB.list('/list', {query: {
               orderByChild: "categoryId",
               equalTo: parseInt(this.categoryId)
           }}).subscribe(listItems => {
               this.items = listItems;
               this.displayGoogleMap();
               loadingPopup.dismiss()
           });
           */
    }

    ionViewDidLoad() {
        this.initMap();
    }
    initMap() {
        var me = this;
        let location = me.dataservice.getUserLocation();
        let latLng = new google.maps.LatLng(location.lat, location.lng);
        let mapOptions = {
            center: latLng,
            zoom: 12,
            styles: this.mapStyle,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        me.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        var mapMarker = new google.maps.Marker({
            position: latLng,
            animation: google.maps.Animation.DROP,
            markerSelected: false,
            icon: {
                url: 'assets/imgs/you.png',
            },
        });
        mapMarker.setMap(this.map);
        me.addMarkersToMap();
    }


    addMarkersToMap() {
        this.items = this.navParams.get("mapData");

        for (let items of this.items) {
            var position = new google.maps.LatLng(items.locationLat, items.locationLon);
            var mapMarker = new google.maps.Marker({
                position: position,
                animation: google.maps.Animation.DROP,
                markerSelected: true,

                //**** Custom Marker Symbols ****/
                //icon:  'assets/red_pin72x96.png'
                icon: {
                    url: 'assets/imgs/other.png',
                    //The size image file.
                    //    size: new google.maps.Size(72, 96),
                    // we want to render @ 30x30 logical px (@2x dppx or 'Retina')
                    scaledSize: new google.maps.Size(40, 52),
                    //The point on the image to measure the anchor from. 0, 0 is the top left.
                    origin: new google.maps.Point(0, 0),
                    //The x y coordinates of the anchor point on the marker. e.g. If your map marker was a drawing pin then the anchor would be the tip of the pin.
                    anchor: new google.maps.Point(20, 40),
                    labelOrigin: new google.maps.Point(20, 12)
                },
                anchorPoint: new google.maps.Point(0, -40)
            });
            mapMarker.setMap(this.map);
            this.addInfoWindowToMarker(mapMarker, items);
            //  this.map.setCenter(position);
        }

    }



    addInfoWindowToMarker(marker, data) {
        let id = data.locationKey;
        var infoWindowContent = '<div id="iw-container">' +
            '<div class="iw-content">' +
            '<div class="iw-subTitle">' + data.locationName + '</div>' +
            '<p><b>city:</b>' + data.city + '</p>' +
            '<p><b>state:</b>' + data.state + '</p>' +
            '<p><b>phone:</b>' + data.phone + '</p>' +
            '<button id =' + id + '  style="font-weight: 300;height: 3rem;background-color: #00B140;width: 126px;margin: -15px 0px 0px 70px;"  class="button button-md button-default button-default-md button-md-secondary">View Details</button>' +
            '</div>' +
            //'<div id="do-something-button">button</div>' +
            '</div>';
        var infoWindow = new google.maps.InfoWindow();
        // infoWindow.setOptions({
        //     disableAutoPan:false
        // });
        infoWindow.setContent(infoWindowContent);
        var me = this;
        marker.addListener('click', () => {
            this.closeAllInfoWindows();
            infoWindow.open(this.map, marker);

            document.getElementById(id).removeEventListener("click", myClick);
            // add listener that will capture the click event of the infoWindow
            document.getElementById(id).addEventListener('click', myClick);
        });
        function myClick(event) {
            let selectedItem = me.items.find(item => item.locationKey === this.id);
            me.navCtrl.push('LocationDetail', { 'LocationData': selectedItem });
        }

        this.infoWindows.push(infoWindow);

    }

    doSomething() {
        console.log("doSomething");
    }

    closeAllInfoWindows() {
        for (let window of this.infoWindows) {
            window.close();
        }
    }
    showList() {
        this.navCtrl.pop();
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
