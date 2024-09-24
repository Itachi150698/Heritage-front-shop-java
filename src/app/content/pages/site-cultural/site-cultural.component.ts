import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-site-cultural',
  templateUrl: './site-cultural.component.html',
  styleUrl: './site-cultural.component.scss'
})
export class SiteCulturalComponent {
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
    this.initializeSwiper();

  }

  private initializeSwiper(): void {
    new Swiper('.swiper-container.two', {
      effect: 'coverflow',
      loop: true,
      autoplay: {
        delay: 3000,
      },
      speed: 4500,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 100,
        depth: 250,
        modifier: 2.5,
        slideShadows: true,
      },


    });
  }
}
