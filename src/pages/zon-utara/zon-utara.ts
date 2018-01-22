import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
/**
 * Generated class for the ZonUtaraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-zon-utara',
  templateUrl: 'zon-utara.html',
})
export class ZonUtaraPage {

  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  website:string[];
  imageList: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, public webservice: WebserviceProvider,
              public loadingCtrl: LoadingController) {
    this.imageList = [];
  }

  ionViewDidLoad(){
      
    let loader = this.loadingCtrl.create({
      content: "Loading",
      spinner: 'crescent',
    });
    loader.present();
    
    this.webservice.getFtroadpedia().then(response => {
      console.log(response);
      this.imageList = response;
      loader.dismiss();
    }).catch(error => {
      loader.dismiss();
      alert('error: ' + error);
    });
  }

  doRefresh(refresher){
    this.webservice.getFtroadpedia().then(response => {
      console.log(response);
      this.imageList = response.person;
      refresher.complete();
    }).catch(error => {
      refresher.complete();
      alert('error: ' + error);
    });
  }

}
