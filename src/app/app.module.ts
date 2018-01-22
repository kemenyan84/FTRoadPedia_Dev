import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WebserviceProvider } from '../providers/webservice/webservice';

import { MyApp } from './app.component';
import { PoiPage } from '../pages/poi/poi';
import { AboutPage } from '../pages/about/about';
import { ZonUtaraPage } from '../pages/zon-utara/zon-utara';
import { ZonSelatanPage } from '../pages/zon-selatan/zon-selatan';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    PoiPage,
    AboutPage,
    ZonUtaraPage,
    ZonSelatanPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PoiPage,
    AboutPage,
    ZonUtaraPage,
    ZonSelatanPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebserviceProvider
  ]
})
export class AppModule {}
