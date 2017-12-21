import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the PoiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-poi',
  templateUrl: 'poi.html',
})
export class PoiPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar', { read: ElementRef}) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  map: any;
  coords: string;
  location: any;
  search: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public geolocation: Geolocation,
            ) {
  }

  ionViewDidLoad() {
    
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.initMap(resp.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  initMap(coords){
    let latitude = coords.latitude;
    let longitude = coords.longitude;

    let latlng = new google.maps.LatLng(latitude, longitude);

    let mapOptions = {
      center: latlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP, //can use 'roadmap' or 'satellite'
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    this.addMarker();
    this.initAutoComplete();
    
    //this.searchNearBy(latlng);

    this.searchNearBy(latlng).then(places => {
      for(let place of places){
        this.createMarker(place, this.map);
      }
    })
 
  }
  
  
  searchNearBy(latlng): Promise<any>{
    
    return new Promise ( (resolve, reject) => {
      let service = new google.maps.places.PlacesService(this.map);

      service.nearbySearch({
        location: latlng,
        radius: 2000,
        types: ["mosque"],
        //position: this.map.getCenter()
      }, (results, status) => {
        if(status === google.maps.places.PlacesServiceStatus.OK){
          resolve(results);
        }
      });

    });
  }

  createMarker(place: any, map: any){
    let placelocation = place.geometry.location;
    let marker = new google.maps.Marker ({
      map: map,
      animation: google.maps.Animation.DROP,
      position: placelocation,
      icon: 'assets/imgs/marker02.png'
    });

    let infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
      let content: string = '<strong>'+place.name+'</strong></br>';
      content += '<p>'+place.vicinity+'</p></br>';
      infoWindow.setContent(content);
      infoWindow.open(map, this);

      setTimeout(function(){ infoWindow.close(); }, 3000);
    })
  }

  addMarker(){
    let marker = new google.maps.Marker ({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    })

    let content = '<strong>Your Current Location</strong>';

    let infoWindow = new google.maps.InfoWindow({
      content: content
    })

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }


  //cuba nk letak marker info
  createMarkerL(place: any, map: any){
    let placelocation = place.geometry.location;
    let marker = new google.maps.Marker ({
      map: map,
      animation: google.maps.Animation.DROP,
      position: placelocation,
      icon: 'assets/imgs/marker02.png'
    });

    let infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
      let content: string = '<strong>'+place.name+'</strong></br>';
      content += '<p>'+place.vicinity+'</p></br>';
      infoWindow.setContent(content);
      infoWindow.open(map, this);

      setTimeout(function(){ infoWindow.close(); }, 3000);
    })
  }


  getDirection(){
    let directionService = new google.maps.DirectionsService;
    let directionDisplay = new google.maps.DirectionsRenderer;

    let map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: this.map.getCenter()
    });

    directionDisplay.setMap(map);
    directionService.route({
      origin: this.coords,
      destination: this.location,
      travelMode: 'DRIVING'
    },(response, status) => {
        if(status === 'OK'){
          directionDisplay.setDirections(response);
        } else {
          alert('Directions Failed: ' + status)
        }
    })
  }

  //autocomplete
  initAutoComplete(): void {
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.createAutoComplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);

      let options = {
        center: location,
        zoom: 20,
      };
      this.map.setOptions(options);
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

  mapsSearchBar(ev: any){
    console.log(ev);
    const autocomplete = new google.maps.places.Autocomplete(ev);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete no geometry mapsearchbar'
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  toggleSearch(){
    if (this.search) {
      this.search = false;
    }else{
      this.search = true;
    }
  }

}
