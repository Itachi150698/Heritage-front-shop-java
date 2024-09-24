import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cultural',
  templateUrl: './cultural.component.html',
  styleUrl: './cultural.component.scss'
})
export class CulturalComponent {
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
