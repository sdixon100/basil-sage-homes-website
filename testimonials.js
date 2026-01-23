// Testimonials Slider Functionality
document.addEventListener('DOMContentLoaded', async function () {
  const sliderTrack = document.querySelector('.slider-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotsContainer = document.querySelector('.slider-dots');

  let currentIndex = 0;
  let totalSlides = 0;
  let autoPlayInterval;
  let testimonialCards = [];

  // Fallback testimonials data in case JSON file fails to load
  const FALLBACK_TESTIMONIALS = [
    {
      "id": 1,
      "name": "Sarah Martinez",
      "initials": "SM",
      "rating": 5,
      "date": "December 2025",
      "text": "We've been renting from Basil & Sage Homes for over two years now, and it's been an exceptional experience. The maintenance team is incredibly responsive - any issues are addressed within 24 hours. The home was move-in ready and exactly as described. Highly recommend!"
    },
    {
      "id": 2,
      "name": "James Thompson",
      "initials": "JT",
      "rating": 5,
      "date": "November 2025",
      "text": "Professional management team that truly cares about their tenants. The application process was smooth and transparent. They were very accommodating with our pets and the neighborhood is perfect for our family. Best rental experience we've had!"
    },
    {
      "id": 3,
      "name": "Emily Chen",
      "initials": "EC",
      "rating": 5,
      "date": "October 2025",
      "text": "As a first-time renter, I was nervous about the process, but Basil & Sage Homes made everything so easy. Their team answered all my questions promptly and the home is beautiful and well-maintained. The location is perfect for commuting to Charleston!"
    },
    {
      "id": 4,
      "name": "Michael Johnson",
      "initials": "MJ",
      "rating": 4.5,
      "date": "September 2025",
      "text": "Great property management company! They're very professional and the rent is reasonable for the quality of home you get. The only minor issue was a small delay in getting the AC fixed during summer, but they provided a temporary unit immediately. Overall, very satisfied!"
    },
    {
      "id": 5,
      "name": "Lisa Rodriguez",
      "initials": "LR",
      "rating": 5,
      "date": "August 2025",
      "text": "Moving from out of state was stressful, but Basil & Sage Homes made it seamless. They did a virtual tour for us and everything was exactly as shown. The neighborhood is safe and quiet, perfect for raising kids. We couldn't be happier with our choice!"
    },
    {
      "id": 6,
      "name": "David Williams",
      "initials": "DW",
      "rating": 5,
      "date": "July 2025",
      "text": "Excellent service from start to finish. The property was spotless when we moved in, and the management team has been incredibly helpful with any questions. The online portal for rent payments is super convenient. Highly recommend to anyone looking in the Ladson area!"
    }
  ];

  // Load testimonials data from JSON
  async function loadTestimonials() {
    try {
      const response = await fetch('testimonials-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.testimonials;
    } catch (error) {
      console.warn('Testimonial JSON failed to load, using embedded fallback data:', error);
      return FALLBACK_TESTIMONIALS;
    }
  }

  // Generate star rating HTML
  function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star filled">★</span>';
    }
    if (hasHalfStar) {
      starsHTML += '<span class="star half">★</span>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="star">★</span>';
    }
    return starsHTML;
  }

  // Create testimonial card HTML
  function createTestimonialCard(testimonial) {
    return `
      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="testimonial-avatar">${testimonial.initials}</div>
          <div class="testimonial-info">
            <h3 class="testimonial-name">${testimonial.name}</h3>
            <div class="testimonial-stars">
              ${generateStars(testimonial.rating)}
            </div>
            <p class="testimonial-date">${testimonial.date}</p>
          </div>
        </div>
        <div class="testimonial-content">
          <p class="testimonial-text">
            ${testimonial.text}
          </p>
        </div>
      </div>
    `;
  }

  // Initialize testimonials
  const testimonials = await loadTestimonials();

  if (testimonials.length === 0) {
    console.error('No testimonials loaded');
    return;
  }

  // Generate and insert testimonial cards
  sliderTrack.innerHTML = testimonials.map(createTestimonialCard).join('');
  testimonialCards = document.querySelectorAll('.testimonial-card');
  totalSlides = testimonialCards.length;

  // Create dots
  function createDots() {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  // Update dots
  function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    // Fix: offset should be relative to the number of slides
    // Since track width is totalSlides * 100%, each slide is 100/totalSlides% of the track
    const offset = -(100 / totalSlides) * currentIndex;
    sliderTrack.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
  }

  // Previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentIndex);
  }

  // Auto play
  function startAutoPlay() {
    stopAutoPlay(); // prevent stacking intervals
    autoPlayInterval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderTrack) {
    sliderTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      resetAutoPlay();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        nextSlide();
      } else {
        // Swipe right - previous slide
        prevSlide();
      }
    }
  }

  // Pause auto-play on hover
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);
  }

  // Initialize
  if (testimonialCards.length > 0) {
    // Set widths so percentage-based translate moves exactly one slide
    sliderTrack.style.width = `${totalSlides * 100}%`;
    testimonialCards.forEach(card => {
      card.style.width = `${100 / totalSlides}%`;
      card.style.flex = `0 0 ${100 / totalSlides}%`;
    });
    createDots();
    startAutoPlay();
  }

  // Animate rating bars on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ratingFills = entry.target.querySelectorAll('.rating-fill');
        ratingFills.forEach(fill => {
          const originalWidth = fill.style.width;
          fill.style.transform = 'scaleX(0)';
          setTimeout(() => {
            // Convert percentage width string to a scale value (e.g. "78%" -> 0.78)
            const scale = parseFloat(originalWidth) / 100;
            fill.style.transform = `scaleX(${scale})`;
            // Keep the width set to 100% so scaleX represents the actual percentage
            fill.style.width = '100%';
          }, 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const ratingSummary = document.querySelector('.rating-summary');
  if (ratingSummary) {
    observer.observe(ratingSummary);
  }

  // Animate category cards on scroll
  const categoryCards = document.querySelectorAll('.category-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  categoryCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });
});
