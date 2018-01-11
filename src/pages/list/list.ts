import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  website:string[];

  imageList: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,  public webservice: WebserviceProvider, public loadingCtrl: LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.imageList = [];
  }
  
    ionViewDidLoad(){
      
      let loader = this.loadingCtrl.create({
        content: "Tunggu Jap...",
        spinner: 'crescent',
      });
      loader.present();
      
      this.webservice.getEmployee().then(response => {
        console.log(response);
        this.imageList = response.person;
        loader.dismiss();
      }).catch(error => {
        loader.dismiss();
        alert('error: ' + error);
      });
    }

    doRefresh(refresher){
      this.webservice.getEmployee().then(response => {
        console.log(response);
        this.imageList = response.person;
        refresher.complete();
      }).catch(error => {
        refresher.complete();
        alert('error: ' + error);
      });
    }

  //   this.selectedItem = navParams.get('item');
  //   this.imageList = [
  //   {url:'assets/imgs/1.jpg'},
  //   {url:'assets/imgs/2.jpg'},
  //   {url:'assets/imgs/3.jpg'},
  //   {url:'assets/imgs/4.jpg'},
  //   {url:'assets/imgs/5.jpg'},
  //   {url:'assets/imgs/6.jpg'}
  //   ]

  //   // Let's populate this page with some filler content for funzies
  //   this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
  //   'american-football', 'boat', 'bluetooth', 'build'];

  //   this.items = [];
  //   for (let i = 1; i < 11; i++) {
  //     this.items.push({
  //       title: 'Item ' + i,
  //       note: 'This is item #' + i,
  //       icon: this.icons[Math.floor(Math.random() * this.icons.length)]
  //     });
  //   }
  // }

  // itemTapped(event, item) {
  //   // That's right, we're pushing to ourselves!
  //   this.navCtrl.push(ListPage, {
  //     item: item
  //   });
  // }
}
