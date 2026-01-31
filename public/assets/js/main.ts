/**
* Template Name: Learner
* Template URL: https://bootstrapmade.com/learner-bootstrap-course-template/
* Updated: Jul 08 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

// Type declarations for global libraries
declare const AOS: any;
declare const PureCounter: any;
declare const Swiper: any;

(function(): void {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled(): void {
    const selectBody: HTMLElement | null = document.querySelector('body');
    const selectHeader: HTMLElement | null = document.querySelector('#header');
    
    if (!selectHeader || 
        (!selectHeader.classList.contains('scroll-up-sticky') && 
         !selectHeader.classList.contains('sticky-top') && 
         !selectHeader.classList.contains('fixed-top'))) return;
    
    if (selectBody) {
      window.scrollY > 10 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }
  }

  document.addEventListener('scroll', toggleScrolled, { passive: true });
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn: HTMLElement | null = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle(): void {
    const body: HTMLElement | null = document.querySelector('body');
    if (body && mobileNavToggleBtn) {
      body.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }
  
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach((navmenu: Element) => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach((navmenu: Element) => {
    navmenu.addEventListener('click', function(this: HTMLElement, e: Event) {
      e.preventDefault();
      const parentNode = this.parentNode as HTMLElement;
      const nextElement = (this.parentNode?.parentNode?.querySelector('.dropdown-menu') || 
                          this.parentNode?.nextSibling) as HTMLElement;
      
      if (parentNode) {
        parentNode.classList.toggle('active');
      }
      if (nextElement) {
        nextElement.classList.toggle('dropdown-active');
      }
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader: HTMLElement | null = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop: HTMLElement | null = document.querySelector('.scroll-top');

  function toggleScrollTop(): void {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  
  if (scrollTop) {
    scrollTop.addEventListener('click', (e: Event) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit(): void {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Init swiper sliders
   */
  function initSwiper(): void {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement: Element) {
      const configElement = swiperElement.querySelector(".swiper-config") as HTMLElement;
      if (!configElement) return;
      
      let config: any;
      try {
        config = JSON.parse(configElement.innerHTML.trim());
      } catch (error) {
        console.error('Invalid swiper config:', error);
        return;
      }

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement as HTMLElement, config);
      } else if (typeof Swiper !== 'undefined') {
        new Swiper(swiperElement, config);
      }
    });
  }

  function initSwiperWithCustomPagination(swiperElement: HTMLElement, config: any): void {
    // Custom pagination implementation would go here
    // For now, just use regular swiper
    if (typeof Swiper !== 'undefined') {
      new Swiper(swiperElement, config);
    }
  }

  window.addEventListener("load", initSwiper);

  /**
   * Pricing Toggle
   */
  const pricingContainers: NodeListOf<Element> = document.querySelectorAll('.pricing-toggle-container');

  pricingContainers.forEach(function(container: Element) {
    const pricingSwitch = container.querySelector('.pricing-toggle input[type="checkbox"]') as HTMLInputElement;
    const monthlyText = container.querySelector('.monthly') as HTMLElement;
    const yearlyText = container.querySelector('.yearly') as HTMLElement;

    if (pricingSwitch) {
      pricingSwitch.addEventListener('change', function(this: HTMLInputElement) {
        const pricingItems = container.querySelectorAll('.pricing-item');

        if (this.checked) {
          monthlyText?.classList.remove('active');
          yearlyText?.classList.add('active');
          pricingItems.forEach((item: Element) => {
            item.classList.add('yearly-active');
          });
        } else {
          monthlyText?.classList.add('active');
          yearlyText?.classList.remove('active');
          pricingItems.forEach((item: Element) => {
            item.classList.remove('yearly-active');
          });
        }
      });
    }
  });

})();