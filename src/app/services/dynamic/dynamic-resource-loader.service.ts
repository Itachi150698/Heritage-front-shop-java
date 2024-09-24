import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DynamicResourceLoaderService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2, private router: Router) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    // Subscribe to route change events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadResources(event.urlAfterRedirects);
      }
    });
  }

  // Load CSS and JS resources based on the current route
  private loadResources(url: string) {
    this.removeResources();  // Clear existing resources

    if (url.includes('admin') || url.includes('customer')) {
      this.loadAdminCustomerResources();
    } else if (url === '/' || url.includes('content')) {
      this.loadContentResources();
    }
  }

  // Load resources for admin or customer routes
  private loadAdminCustomerResources() {
    this.loadCss([
      'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;900&display=swap',
      '../../../assets/css/css/bootstrap.min.css',
      '../../../assets/css/css/font-awesome.min.css',
      '../../../assets/css/css/elegant-icons.css',
      '../../../assets/css/css/nice-select.css',
      '../../../assets/css/css/jquery-ui.min.css',
      '../../../assets/css/css/owl.carousel.min.css',
      '../../../assets/css/css/slicknav.min.css',
      '../../../assets/css/css/style.css',
    ]);
    this.loadJs([
      '../../../assets/css/js/jquery-3.3.1.min.js',
      '../../../assets/css/js/bootstrap.min.js',
      '../../../assets/css/js/jquery.nice-select.min.js',
      '../../../assets/css/js/jquery-ui.min.js',
      '../../../assets/css/js/jquery.slicknav.js',
      '../../../assets/css/js/mixitup.min.js',
      '../../../assets/css/js/owl.carousel.min.js',
      '../../../assets/css/js/main.js'
    ]).then(() => {
      // Inject the Layout-related inline scripts for customer/admin
      // this.injectLayoutScripts();
    });
  }

  // Load resources for content routes (including default route "")
  private loadContentResources() {
    this.loadCss([
      'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&amp;display=swap',
      'https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.1/css/swiper.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
      '../../../assets/style.scss'
    ]);
    this.loadJs([
      'https://code.jquery.com/jquery-3.5.1.slim.min.js',
      'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.1/js/swiper.js',
      'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
      'https://code.jquery.com/jquery-3.5.1.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/wow.js/1.1.2/wow.min.js'
    ]).then(() => {
      // Inject inline scripts after resources are loaded
      // this.injectInlineScripts();
    });
  }

  // Utility function to dynamically load CSS files
  private loadCss(urls: string[]) {
    urls.forEach(url => {
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      this.renderer.appendChild(document.head, link);
    });
  }

  // Utility function to dynamically load JS files
  private loadJs(urls: string[]): Promise<void> {
    return new Promise(resolve => {
      const promises = urls.map(url => {
        return new Promise<void>(resolveJs => {
          const script = this.renderer.createElement('script');
          script.src = url;
          script.onload = () => resolveJs();
          this.renderer.appendChild(document.head, script);
        });
      });

      Promise.all(promises).then(() => resolve());
    });
  }


  // Remove previously loaded CSS and JS resources to prevent conflicts
  private removeResources() {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      if (href.includes('bootstrap') || href.includes('font-awesome') || href.includes('cdn.jsdelivr') || href.includes('cdnjs')) {
        link.remove();
      }
    });

    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      const src = script.src;
      if (src.includes('jquery') || src.includes('cdn.jsdelivr') || src.includes('cdnjs')) {
        script.remove();
      }
    });
  }
}
