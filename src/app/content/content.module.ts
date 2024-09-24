import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { ContactComponent } from './partials/contact/contact.component';
import { AboutComponent } from './partials/about/about.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { JewelleryComponent } from './pages/jewellery/jewellery.component';
import { ArtHeritageComponent } from './pages/art-heritage/art-heritage.component';
import { AjantaComponent } from './pages/ajanta/ajanta.component';
import { NorthEastComponent } from './pages/north-east/north-east.component';
import { FortsComponent } from './pages/forts/forts.component';
import { WalkthroughComponent } from './pages/walkthrough/walkthrough.component';
import { HistoricComponent } from './pages/historic/historic.component';
import { SiteCulturalComponent } from './pages/site-cultural/site-cultural.component';
import { CulturalComponent } from './pages/cultural/cultural.component';
import { HomeComponent } from './pages/home/home.component';
import { MiddleComponent } from './partials/middle/middle.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContentComponent,
    ContactComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    JewelleryComponent,
    ArtHeritageComponent,
    AjantaComponent,
    NorthEastComponent,
    FortsComponent,
    WalkthroughComponent,
    HistoricComponent,
    SiteCulturalComponent,
    CulturalComponent,
    HomeComponent,
    MiddleComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
  ]
})
export class ContentModule { }
