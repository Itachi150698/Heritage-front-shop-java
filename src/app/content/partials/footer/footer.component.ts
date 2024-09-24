import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';

@Component({
  selector: 'content-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {
  isExpanded = false;
  isVisible = false;
  readonly visibilityThreshold = 300; // Distance from bottom to trigger visibility
  contactForm: FormGroup; // Define the contactForm property

  @ViewChild('formContainer') formContainer!: ElementRef;
  @ViewChild('btnExpand') btnExpand!: ElementRef;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize the form with FormBuilder
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkVisibility();
      this.handleButtonVisibility();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkVisibility();
      this.handleButtonVisibility();
      if (this.isExpanded && !this.isVisible) {
        this.isExpanded = false; // Close form if user scrolls away from the bottom
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const clickedInside = this.formContainer.nativeElement.contains(event.target);
      if (!clickedInside && this.isExpanded) {
        this.isExpanded = false;
      }
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  checkVisibility(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Check if we are within the threshold of the bottom
      this.isVisible = (docHeight - (scrollTop + windowHeight)) < this.visibilityThreshold;
    }
  }

  handleButtonVisibility(): void {
    if (isPlatformBrowser(this.platformId)) {
      const button = this.btnExpand.nativeElement;
      if (window.pageYOffset > 300) {  // Show button after 300px scroll
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;

      emailjs.send('service_qaqq82t', 'template_l0t06f1', formData, '1VmWZR-LU4EYJFEPe')
        .then(response => {
          alert('Your query has been submitted.');
          this.contactForm.reset();
          this.isExpanded = false;
        }, error => {
          alert('There was an error submitting your query. Please try again.');
        });
    }
  }
}
