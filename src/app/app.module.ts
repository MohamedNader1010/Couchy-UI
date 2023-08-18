import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from 'src/modules/layout/layout.module';
import { NotfoundComponent } from 'src/modules/features/notfound/notfound.component';


@NgModule({
  declarations: [
    AppComponent, NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
