import { Component} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'content-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {

    constructor(private router: Router) {}

  navigateToDetail(fragment: string): void {
    this.router.navigate(['/content/site-cultural'], { fragment });
  }


  navigateToArtDetail(fragment: string): void {
    this.router.navigate(['/content/art-heritage'], { fragment });
  }


  navigateToCultureDetail(fragment: string): void {
    this.router.navigate(['/content/cultural'], { fragment });
  }

}
