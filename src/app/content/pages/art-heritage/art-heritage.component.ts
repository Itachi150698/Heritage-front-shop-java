import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-art-heritage',
  templateUrl: './art-heritage.component.html',
  styleUrl: './art-heritage.component.scss'
})
export class ArtHeritageComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // Delay to ensure the view is loaded before scrolling
      }
    });
  }
}
