import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './views/map/map.component';
import {NguiMapModule} from '@ngui/map';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpModule} from '@angular/http';
import {HttpClientModule, HttpHeaders} from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCKlKFiWdQhHNfRaM7lNw1X5tSGEfCUP64'}),
    AppRoutingModule,
    HttpClientModule,
    HttpModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
