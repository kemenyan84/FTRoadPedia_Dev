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
  // coords: string;
  coords: any;
  destinationcoords: any;
  center: any;
  location: string;
  search: boolean = false;
  endpoint: any;
  distance: number;
  newMidPoint: any;

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

  //autocomplete
  initAutoComplete(): void {
    this.addressElement = document.getElementById('txtHome').getElementsByTagName('input')[0]
    // this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.createAutoComplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);

      let options = {
        center: location,
        zoom: 20,
        disableDefaultUI: true,
      };
      this.map.setOptions(options);
      //this.createMarkerL();
      
      //pass location to getDirection()
      //this.location = String(this.addressElement);
      // console.log(JSON.stringify(this.addressElement));
      this.destinationcoords = location;
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
        this.endpoint = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
        sub.next(place.geometry.location);
        }
      });
    });
  }
 
  initMap(coords){
    let latitude = coords.latitude;
    let longitude = coords.longitude;

    // let latlng = new google.maps.LatLng(latitude, longitude);

    this.center = {
      lat: latitude,
      lng: longitude
    };

    // this.coords = latitude + ',' + longitude;
    this.coords = {lat: latitude, lng: longitude};

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
    
    // this.searchNearBy(latlng);

    // // tambah param, determine type of places
    // this.searchNearBy(latlng).then(places => {
    //   for(let place of places){
    //     this.createMarker(place, this.map);
    //   }
    // })
 
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
      destination: this.destinationcoords,
      travelMode: 'DRIVING',
      avoidHighways: true,
      avoidTolls: true
    },(response, status) => {
        if(status === 'OK'){
          directionDisplay.setDirections(response);
        } else {
          alert('Directions Failed: ' + status)
        }
    })

    this.getMidPoint();
   }
  
  toRad (value: any){
    return value * (Math.PI / 180);
  }

  toDeg (value: any){
    return value * (180 / Math.PI);
  }

  

  getMidPoint( ){
   let lat1 = this.coords.lat;
   let lng1 = this.coords.lng;
   let lat2 = this.endpoint.lat;
   let lng2 = this.endpoint.lng;

   let dLng = this.toRad(lng2 - lng1);

   lat1 = this.toRad(lat1);
   lat2 = this.toRad(lat2);
   lng1 = this.toRad(lng1);

   let bX = Math.cos(lat2) * Math.cos(dLng);
   let bY = Math.cos(lat2) * Math.sin(dLng);
   let lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));

   let lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

console.log('midpoint: ' + this.toDeg(lat3) + ',' + this.toDeg(lng3));

this.newMidPoint = {lat: this.toDeg(lat3), lng: this.toDeg(lng3)};

//  return [this.toDeg(lng3), this.toRad(lat3)];

// this.createMarkerMid(this.newMidPoint, this.map);

this.distance = this.getDistanceBetweenPoints(this.coords, this.newMidPoint, "m");

console.log('distance ' + this.distance);

this.searchNearBy(this.newMidPoint).then(places => {
  for(let place of places){
    this.createMarker(place, this.map);
  }
})

}

  getDistanceBetweenPoints(start, end, units){
 

    let earthRadius = {
        miles: 3958.8,
        km: 6371,
        m: 6371000
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
}


  searchNearBy(newMidPoint): Promise<any>{
    
    return new Promise ( (resolve, reject) => {
      let service = new google.maps.places.PlacesService(this.map);
      
      service.nearbySearch({
        location: this.newMidPoint,
        radius: this.distance,
        optimizeWaypoints: true,
        types: ["mosque"]
        // types: ["mosque", "police", "shopping_mall"]
      }, (results, status) => {
        if(status === google.maps.places.PlacesServiceStatus.OK){
          resolve(results);
        }
      });

    });
  }
  
  // createMarkerMid(place: any, map: any){
    
  //   console.log('create marker mid' + place)
  //   let marker = new google.maps.Marker ({
  //     map: map,
  //     animation: google.maps.Animation.DROP,
  //     position: place,
  //     icon: 'assets/imgs/marker02.png'
      
  //   });

  //  }

  //tambah param icon
  createMarker(place: any, map: any){
    let placelocation = place.geometry.location;
    let marker = new google.maps.Marker ({
      map: map,
      animation: google.maps.Animation.DROP,
      position: placelocation,
      icon: 'assets/imgs/marker02.png'
      //
    });

    console.log('marker jalan ' + placelocation);
    // console.log('lat 2 endpoint: ' + this.endpoint.lat);
    // console.log('lng 2 endpoint: ' + this.endpoint.lng);

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


  // //cuba nk letak marker info
  // createMarkerL(place: any, map: any){
  //   let placelocation = place.geometry.location;
  //   let marker = new google.maps.Marker ({
  //     map: map,
  //     animation: google.maps.Animation.DROP,
  //     position: placelocation,
  //     icon: 'assets/imgs/marker02.png'
  //   });

  //   let infoWindow = new google.maps.InfoWindow();
  //   google.maps.event.addListener(marker, 'click', function() {
  //     let content: string = '<strong>'+place.name+'</strong></br>';
  //     content += '<p>'+place.vicinity+'</p></br>';
  //     infoWindow.setContent(content);
  //     infoWindow.open(map, this);

  //     setTimeout(function(){ infoWindow.close(); }, 3000);
  //   })
  // }

  
  // mapsSearchBar(ev: any){
  //   console.log(ev);
  //   const autocomplete = new google.maps.places.Autocomplete(ev);
  //   autocomplete.bindTo('bounds', this.map);
  //   return new Observable((sub: any) => {
  //     google.maps.event.addListener(autocomplete, 'place_changed', () => {
  //       const place = autocomplete.getPlace();
  //       if (!place.geometry) {
  //         sub.error({
  //           message: 'Autocomplete no geometry mapsearchbar'
  //         });
  //       } else {
  //         sub.next(place.geometry.location);
  //         sub.complete();
  //       }
  //     });
  //   });
  // }

  // toggleSearch(){
  //   if (this.search) {
  //     this.search = false;
  //   }else{
  //     this.search = true;
  //   }
  // }

}
