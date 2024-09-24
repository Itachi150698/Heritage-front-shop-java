import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Use setTimeout to ensure the DOM is fully rendered before attempting to manipulate it
      setTimeout(() => {
        const slider = document.querySelector('.slider') as HTMLElement;
        const items = Array.from(document.querySelectorAll('.item')) as HTMLElement[];

        if (!slider || items.length === 0) return;

        // Function to handle click events
        const activate = (e: MouseEvent) => {
          const target = e.target as HTMLElement;

          if (target.matches('.next')) {
            const firstItem = slider.firstElementChild as HTMLElement;
            if (firstItem) {
              slider.append(firstItem);
            }
          } else if (target.matches('.prev')) {
            const lastItem = slider.lastElementChild as HTMLElement;
            if (lastItem) {
              slider.prepend(lastItem);
            }
          }
        };

        document.addEventListener('click', activate, false);






      }, 10);
    }
  }
}
