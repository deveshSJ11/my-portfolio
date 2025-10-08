/**
* Modern Portfolio JavaScript
* Author: Satwik Devle
*/

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('.nav-menu a', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#navbar');
    let offset = header.offsetHeight;

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  }

  /**
   * Toggle .header-scrolled class to #navbar when page is scrolled
   */
  let selectHeader = select('#navbar');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('scrolled');
      } else {
        selectHeader.classList.remove('scrolled');
      }
    }
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    }
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-menu-toggle', function(e) {
    select('.nav-menu').classList.toggle('mobile-active');
    this.querySelector('i').classList.toggle('fa-bars');
    this.querySelector('i').classList.toggle('fa-times');
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.nav-menu a', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let navMenu = select('.nav-menu');
      if (navMenu.classList.contains('mobile-active')) {
        navMenu.classList.remove('mobile-active');
        let navbarToggle = select('.mobile-menu-toggle');
        navbarToggle.querySelector('i').classList.toggle('fa-bars');
        navbarToggle.querySelector('i').classList.toggle('fa-times');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero typing effect
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
      smartBackspace: true
    });
  }

  /**
   * Animation on scroll initialization
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  });

  /**
   * Contact form submission
   */
  const contactForm = select('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      // Create mailto link
      const mailtoLink = `mailto:satwik.devle@mitaoe.ac.in?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
      
      // Open mailto
      window.location.href = mailtoLink;

      // Show success message
      const messageDiv = select('.form-message');
      messageDiv.textContent = 'Opening your email client...';
      messageDiv.className = 'form-message success';

      // Reset form
      setTimeout(() => {
        contactForm.reset();
        messageDiv.className = 'form-message';
        messageDiv.textContent = '';
      }, 3000);
    });
  }

  /**
   * Smooth scroll for all links with # href
   */
  on('click', 'a[href^="#"]', function(e) {
    if (this.hash !== "") {
      let target = select(this.hash);
      if (target) {
        e.preventDefault();
        scrollto(this.hash);
      }
    }
  }, true);

  /**
   * Add animation to elements when they come into view
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all cards and items
  const elementsToAnimate = select('.skill-card, .project-card, .timeline-item, .cert-card', true);
  if (elementsToAnimate) {
    elementsToAnimate.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  }

  /**
   * Preload images
   */
  const preloadImages = () => {
    const images = select('img', true);
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  };

  window.addEventListener('load', preloadImages);

  /**
   * Counter animation for stats
   */
  const animateCounters = () => {
    const counters = select('.stat-box .number', true);
    if (!counters) return;

    counters.forEach(counter => {
      const target = counter.textContent;
      const number = parseInt(target);
      const increment = number / 50;
      let current = 0;

      const updateCounter = () => {
        if (current < number) {
          current += increment;
          counter.textContent = Math.ceil(current) + (target.includes('+') ? '+' : '');
          setTimeout(updateCounter, 30);
        } else {
          counter.textContent = target;
        }
      };

      // Start animation when element is in view
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            counterObserver.disconnect();
          }
        });
      });

      counterObserver.observe(counter.closest('.stat-box'));
    });
  };

  window.addEventListener('load', animateCounters);

  /**
   * Parallax effect for hero section
   */
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = select('.hero-image');
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  /**
   * Copy to clipboard functionality
   */
  const addCopyButtons = () => {
    const emailElements = select('a[href^="mailto:"]', true);
    const phoneElements = select('a[href^="tel:"]', true);

    const createCopyButton = (element, text) => {
      const copyBtn = document.createElement('i');
      copyBtn.className = 'fas fa-copy copy-btn';
      copyBtn.style.marginLeft = '10px';
      copyBtn.style.cursor = 'pointer';
      copyBtn.style.fontSize = '0.9rem';
      copyBtn.style.opacity = '0.6';
      copyBtn.style.transition = 'all 0.3s ease';

      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.className = 'fas fa-check copy-btn';
          copyBtn.style.color = 'var(--accent-primary)';
          copyBtn.style.opacity = '1';
          
          setTimeout(() => {
            copyBtn.className = 'fas fa-copy copy-btn';
            copyBtn.style.color = '';
            copyBtn.style.opacity = '0.6';
          }, 2000);
        });
      });

      copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.opacity = '1';
        copyBtn.style.color = 'var(--accent-primary)';
      });

      copyBtn.addEventListener('mouseleave', () => {
        if (copyBtn.className.includes('fa-copy')) {
          copyBtn.style.opacity = '0.6';
          copyBtn.style.color = '';
        }
      });

      element.parentNode.insertBefore(copyBtn, element.nextSibling);
    };

    emailElements.forEach(el => {
      const email = el.textContent.trim();
      createCopyButton(el, email);
    });

    phoneElements.forEach(el => {
      const phone = el.textContent.trim();
      createCopyButton(el, phone);
    });
  };

  window.addEventListener('load', addCopyButtons);

  /**
   * Print page functionality
   */
  const addPrintButton = () => {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i>';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--accent-secondary);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 998;
    `;

    printBtn.addEventListener('click', () => {
      window.print();
    });

    const togglePrintBtn = () => {
      if (window.scrollY > 100) {
        printBtn.style.opacity = '1';
        printBtn.style.visibility = 'visible';
      } else {
        printBtn.style.opacity = '0';
        printBtn.style.visibility = 'hidden';
      }
    };

    printBtn.addEventListener('mouseenter', () => {
      printBtn.style.transform = 'translateY(-5px)';
    });

    printBtn.addEventListener('mouseleave', () => {
      printBtn.style.transform = 'translateY(0)';
    });

    document.body.appendChild(printBtn);
    window.addEventListener('scroll', togglePrintBtn);
  };

  window.addEventListener('load', addPrintButton);

  /**
   * Console message
   */
  console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
  console.log('%cLooking at the code? Feel free to check out my GitHub!', 'font-size: 14px; color: #94a3b8;');
  console.log('%chttps://github.com/satwikdevle', 'font-size: 14px; color: #00d4ff;');

})();