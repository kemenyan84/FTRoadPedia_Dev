import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { PoiPage } from '../pages/poi/poi';
import { AboutPage } from '../pages/about/about';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public iab: InAppBrowser) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Laman Utama', component: HomePage, icon: 'home' },
      { title: 'POI', component: PoiPage, icon: 'pin' },
      { title: 'Galeri', component: ListPage, icon: 'images' },
      // { title: 'About', component: AboutPage, icon: 'images'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openFB(){
    let options: InAppBrowserOptions = {
    location: 'no',
    zoom: 'no'
  }
  const browser = this.iab.create('https://m.facebook.com/FTRoadpedia/', '_self', options);
}

  openMengenaiPage(){
    this.nav.setRoot(ListPage);
  }

  openAboutPage(){
    this.nav.setRoot(AboutPage)
  }
}
