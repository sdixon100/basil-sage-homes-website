// Features Slideshow Functionality
(function() {
  const carousel = document.querySelector('.features-carousel');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;
  
  const cards = document.querySelectorAll('.feature-card');
  const totalCards = cards.length;
  let currentSlide = 0;
  
  // Position all cards absolutely and set initial opacity
  cards.forEach((card, index) => {
    card.style.display = 'flex';
    card.style.opacity = index === 0 ? '1' : '0';
    card.style.pointerEvents = index === 0 ? 'auto' : 'none';
  });
  
  // Create dots
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  const dots = document.querySelectorAll('.carousel-dot');
  
  function updateSlideshow() {
    // Fade out all cards and disable pointer events
    cards.forEach((card, index) => {
      if (index !== currentSlide) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      }
    });

    // Fade in current card and enable pointer events
    cards[currentSlide].style.opacity = '1';
    cards[currentSlide].style.pointerEvents = 'auto';

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    if (index === currentSlide) return;
    currentSlide = index;
    updateSlideshow();
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalCards;
    updateSlideshow();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalCards) % totalCards;
    updateSlideshow();
  }
  
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Auto-play
  let autoplayInterval;
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 6500); // Change slide every 6.5 seconds for smooth, elegant pacing
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Start autoplay
  startAutoplay();
  
  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
})();
