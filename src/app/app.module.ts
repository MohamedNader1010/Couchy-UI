import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from 'src/modules/layout/layout.module';
import { NotfoundComponent } from 'src/modules/features/notfound/notfound.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from 'src/core/interceptors/token-interceptor.service';


@NgModule({
  declarations: [
    AppComponent, NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule, 
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
