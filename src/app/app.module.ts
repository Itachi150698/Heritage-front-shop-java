import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DemoAngularMaterialModule } from './DemoAngularMaterialModule';
import { CustomerModule } from "./customer/customer.module";
import { ToastrModule } from 'ngx-toastr';
import { AdminModule } from "./admin/admin.module";
import { NgxImageZoomModule } from 'ngx-image-zoom';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DemoAngularMaterialModule,
    CustomerModule,
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        newestOnTop: false,
        preventDuplicates: true,
        closeButton: true,
        progressBar: true
    }),
    AdminModule,
    NgxImageZoomModule,
],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
