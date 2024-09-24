import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { UserStorageService } from './services/storage/user-storage.service';
import { ToastrService } from 'ngx-toastr';
import { DynamicResourceLoaderService } from './services/dynamic/dynamic-resource-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  // Flags to track user login status and page types
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();
  isHomePage: boolean = false; // Indicates if the current route is the home page
  isContentPage: boolean = false; // Indicates if the current route is a content page


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dynamicLoader: DynamicResourceLoaderService,
  ) {

  }

  ngOnInit(): void {
    // Subscribe to router events to track navigation and update state accordingly
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        console.log('Navigated to:', currentUrl);

        // Determine if the current route is the home page
        this.isHomePage = currentUrl === '/';

        // Determine if the current route is a content page
        this.isContentPage = this.checkIfContentPage(currentUrl);

        // Update login status based on user storage service
        this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
        this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();

        console.log('Is Home Page:', this.isHomePage);
        console.log('Is Content Page:', this.isContentPage);
        console.log('Is Customer Logged In:', this.isCustomerLoggedIn);
        console.log('Is Admin Logged In:', this.isAdminLoggedIn);
      }
    });
  }

  /**
   * Checks if the current route is a content page.
   * @param url The current route URL.
   * @returns true if the URL matches a content page path, otherwise false.
   */
  checkIfContentPage(url: string): boolean {
    const contentPaths = ['/content/site-cultural', '/', '/content/cultural', '/content/art-heritage', '/content/site-cultural#Khajuraho'
      , '/content/site-cultural#Tanjore', '/content/site-cultural#Ruins_of_Hampi', '/content/about', '/content/cultural#Kuchipudi', '/site-cultural#Tirupati', '/content/site-cultural#Sanchi_Stupa', '/content/site-cultural#Somnath', '/content/site-cultural#Tirupati', '/content/site-cultural#Tajmahal', '/content/cultural#Odissy', '/content/cultural#Kathak', '/content/cultural#Naga', '/content/cultural#Kuttiyam', '/content/cultural#Kathakali', '/content/cultural#Kalaripayattu', '/content/cultural#Ghoomer', '/content/cultural#FolkPunjabi', '/content/cultural#Mohiniattyam', '/content/cultural#Manipuri', '/content/cultural#DesertFestival', '/content/art-heritage#Painting', '/content/art-heritage#Texttiles', '/content/art-heritage#Sculpture', '/content/art-heritage#Pottery', '/content/art-heritage#Jewelry', '/content/art-heritage#WoodenCrafts', '/content/jewllery', '/content/ajanta', '/content/north-east', '/content/forts', '/content/walkthrough', '/content/historic'
    ]; // Add other content paths here
    return contentPaths.includes(url);
  }

}
