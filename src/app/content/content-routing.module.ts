import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';
import { AjantaComponent } from './pages/ajanta/ajanta.component';
import { ArtHeritageComponent } from './pages/art-heritage/art-heritage.component';
import { CulturalComponent } from './pages/cultural/cultural.component';
import { FortsComponent } from './pages/forts/forts.component';
import { HistoricComponent } from './pages/historic/historic.component';
import { JewelleryComponent } from './pages/jewellery/jewellery.component';
import { NorthEastComponent } from './pages/north-east/north-east.component';
import { SiteCulturalComponent } from './pages/site-cultural/site-cultural.component';
import { WalkthroughComponent } from './pages/walkthrough/walkthrough.component';
import { AboutComponent } from './partials/about/about.component';
import { ContactComponent } from './partials/contact/contact.component';


const routes: Routes = [{ path: '', component: ContentComponent },
    { path: "jewllery", component: JewelleryComponent },
  { path: 'art-heritage', component: ArtHeritageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'ajanta', component: AjantaComponent },
  { path: 'north-east', component: NorthEastComponent },
  { path: 'forts', component: FortsComponent },
  { path: 'walkthrough', component: WalkthroughComponent },
  { path: 'historic', component: HistoricComponent },
  { path: 'site-cultural', component: SiteCulturalComponent },
  { path: 'about', component: AboutComponent },
  { path: 'cultural', component: CulturalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
