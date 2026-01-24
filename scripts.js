// FAQ accordion and other functionality
document.addEventListener("DOMContentLoaded", function () {
  // Flag that JS is enabled (used for carousel layout)
  document.body.classList.add('js-enabled');
  // Mobile menu toggle logic for new header
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;

  // Create overlay element for mobile menu
  let mobileOverlay = document.querySelector('.mobile-menu-overlay');
  if (!mobileOverlay && mobileMenuBtn) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-menu-overlay';
    mobileMenuBtn.parentNode.insertBefore(mobileOverlay, mobileMenuBtn);
  }

  function openMobileMenu() {
    mobileMenuBtn.classList.add('active');
    navMenu.classList.add('active');
    if (mobileOverlay) {
      mobileOverlay.style.display = 'block';
      // Trigger reflow for animation
      mobileOverlay.offsetHeight;
      mobileOverlay.classList.add('active');
    }
    body.style.overflow = 'hidden';
    // Improve accessibility
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
      setTimeout(() => {
        mobileOverlay.style.display = 'none';
      }, 300);
    }
    body.style.overflow = '';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      if (navMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking overlay
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close menu on window resize (if switching to desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023 && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === pageName || (pageName === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Header scroll effect
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // FAQ accordion
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {
      // Close others
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
        }
      });

      // Toggle this one
      item.classList.toggle("open");
    });
  });

  // Dynamic year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Lazy-load all images except ones explicitly marked eager
  document.querySelectorAll('img:not([data-eager])').forEach((img) => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form submission handler
  window.handleSubmit = function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    const form = event.target;
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
    `;
    successMessage.textContent = 'Thank you for your message! We will contact you soon.';

    form.appendChild(successMessage);
    form.reset();

    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  };

  // Image rotators: fade/zoom through multiple shots for a property
  const rotators = document.querySelectorAll('.image-rotator');
  rotators.forEach((rotator) => {
    const imagesAttr = rotator.dataset.images;
    if (!imagesAttr) return;

    const urls = imagesAttr.split(',').map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return;

    // Clear any inline background; frames will handle display
    rotator.style.backgroundImage = 'none';

    // Build frames
    urls.forEach((url, idx) => {
      const frame = document.createElement('div');
      frame.className = 'image-frame';
      frame.style.backgroundImage = `url('${url}')`;
      if (idx === 0) frame.classList.add('active');
      rotator.appendChild(frame);
    });

    let current = 0;
    const frames = rotator.querySelectorAll('.image-frame');
    if (frames.length < 2) return;

    setInterval(() => {
      frames[current].classList.remove('active');
      current = (current + 1) % frames.length;
      frames[current].classList.add('active');
    }, 4500);
  });

  // Hide logo and demo controls when hero scrolls out of view
  const heroSection = document.getElementById('hero-section');
  const navLogo = document.querySelector('.nav-logo');
  const demoControl = document.querySelector('.demo-control-card');

  if (heroSection && (navLogo || demoControl)) {
    function handleHeroScroll() {
      const heroRect = heroSection.getBoundingClientRect();
      const heroBottom = heroRect.bottom;
      const heroHeight = heroRect.height;

      // Calculate opacity based on how much of hero is still visible
      // Start fading when hero is 30% scrolled out, complete fade at 70%
      const fadeStartPoint = heroHeight * 0.3;
      const fadeEndPoint = heroHeight * 0.7;
      const scrolledAmount = heroHeight - heroBottom;

      let opacity = 1;
      if (scrolledAmount > fadeStartPoint) {
        const fadeProgress = (scrolledAmount - fadeStartPoint) / (fadeEndPoint - fadeStartPoint);
        opacity = Math.max(0, 1 - fadeProgress);
      }

      if (navLogo) {
        navLogo.style.opacity = opacity;
        navLogo.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
      }

      if (demoControl) {
        demoControl.style.opacity = opacity;
        demoControl.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
      }
    }

    // Add smooth transition to elements
    if (navLogo) {
      navLogo.style.transition = 'opacity 0.3s ease-out';
    }
    if (demoControl) {
      demoControl.style.transition = 'opacity 0.3s ease-out';
    }

    // Listen to scroll events
    window.addEventListener('scroll', handleHeroScroll, { passive: true });

    // Initial check
    handleHeroScroll();
  }
});
