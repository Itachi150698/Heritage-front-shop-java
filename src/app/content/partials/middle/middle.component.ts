import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrl: './middle.component.scss'
})
export class MiddleComponent implements AfterViewInit {

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initializeEventListeners();
  }
  initializeEventListeners() {
    const newsItems = this.el.nativeElement.querySelectorAll('.list-group-item');
    newsItems.forEach((item: HTMLElement) => {
      this.renderer.listen(item, 'click', () => {
        console.log('Item clicked:', item);
        const pdfUrl = item.getAttribute('data-pdf-url');
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
          console.log('Removing "new" class from item');
          item.classList.remove('new'); // Remove 'new' class to hide indicator
        }
      });
    });



    // Handling clicks on collage images
    const collageImages = this.el.nativeElement.querySelectorAll('.collage-img');
    collageImages.forEach((img: HTMLImageElement) => {
      this.renderer.listen(img, 'click', () => {
        window.open(img.src, '_blank');
      });
    });
  }
}
