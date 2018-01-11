import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';


declare var google: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar', { read: ElementRef}) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  map: any;
  center: any;
  location: string;
  coords: string;
  search: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp);
      this.initMap(resp.coords);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  initAutoComplete(): void {
    this.addressElement = document.getElementById('txtHome').getElementsByTagName('input')[0];
    this.createAutoComplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);

      let options = {
        center: location,
        zoom: 20,
      };
      this.map.setOptions(options);
      this.location=location;
      //this.createMarkerL();
      //this.getDirection();
    });
  }

  createAutoComplete(addressEL: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEL);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry){
          sub.error({
            message: 'Autocomplete with no geometry'
          });
        } else {
          console.log('Search Lat', place.geometry.location.lat());
          console.log('Search Lng', place.geometry.location.lng());
          sub.next(place.geometry.location);
        }
      });
    });
  }


  initMap(coords){
    let latitude = coords.latitude;
    let longitude = coords.longitude;

    // var nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
    // let autocomplete1 = new google.maps.places.Autocomplete(nativeHomeInputBox, location);

    this.center = {
      lat: latitude,
      lng: longitude
    };

    this.coords = latitude + ',' + longitude;

    let latlng = new google.maps.LatLng( latitude, longitude);

    let mapOptions = {
      center: latlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
    //let lating = new /maps.Map(this.mapElement.nativeElement, )
    this.addMarker();
    this.initAutoComplete();
  }

  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    })
    let content = '<strong>You are here</strong>';
    let infoWindow = new google.maps.InfoWindow({
      content: content
    })
    google.maps.event.addListener(marker, 'click', () =>{
      infoWindow.open(this.map, marker);
    });
    }

    setCenter(){
      this.map.panTo(this.center);
    }

    getDirection(){
      let directionService = new google.maps.DirectionsService;
      let directionDisplay = new google.maps.DirectionsRenderer;

      let map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: this.map.getCenter(),
        disabledDefaultUI: true,
      });
      directionDisplay.setMap(map);
      directionService.route({
          origin: this.coords,
          destination: this.location,
          travelMode: 'DRIVING'
      }, function (response, status){
        if(status === 'OK'){
          directionDisplay.setDirections(response);
        } else {
          alert('Direction Failed: ' + status)
        }
      })
    }

    // toggleSearch(){
    //   if (this.search) {
    //     this.search = false;
    //   }else{
    //     this.search = true;
    //   }
    // }
  

}
