import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PoiPage } from '../pages/poi/poi';
import { AboutPage } from '../pages/about/about';
import { ZonUtaraPage } from '../pages/zon-utara/zon-utara';
import { ZonSelatanPage } from '../pages/zon-selatan/zon-selatan';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PoiPage;
  showLevel1 = null;

  pages: Array<{title: string, component: any, icon: string}>;
  pages2: any;

  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, public iab: InAppBrowser) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Laman Utama', component: PoiPage, icon: 'home'},
      { title: 'Mengenai FTRoadPedia', component: AboutPage, icon: 'globe'},
    ];

    this.pages2 = [
      { title: 'Galeri', subs: [{subs: 'Zon Utara', component: ZonUtaraPage},
                                {subs: 'Zon Selatan', component: ZonSelatanPage} ], icon: 'images'}
    ]

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

  openAboutPage(){
    this.nav.setRoot(AboutPage);
  }


toggleLevel1(idx) {
  if (this.isLevel1Shown(idx)) {
    this.showLevel1 = null;
  } else {
    this.showLevel1 = idx;
  }
  };

isLevel1Shown(idx) {
  return this.showLevel1 === idx;
  };
}
