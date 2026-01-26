// Demo Visual Controls - Hero Scene Switcher
document.addEventListener('DOMContentLoaded', () => {
  const sceneOptions = document.querySelectorAll('input[name="hero-scene"]');
  const heroVideo = document.getElementById('hero-video');
  const heroImage1 = document.getElementById('hero-image-1');
  const heroImage2 = document.getElementById('hero-image-2');
  const heroImage3 = document.getElementById('hero-image-3');
  const heroImage4 = document.getElementById('hero-image-4');
  const heroImage5 = document.getElementById('hero-image-5');
  const heroImageHomes = document.getElementById('hero-image-homes');
  const demoCard = document.querySelector('.demo-control-card');
  const minimizeBtn = document.querySelector('.demo-minimize-btn');

  let slideshowInterval = null;
  let currentSlideIndex = 0;
  const slideshowImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];

  // Function to show next slide in slideshow
  function showNextSlide() {
    slideshowImages.forEach(img => {
      if (img) {
        img.style.display = 'none';
        img.classList.remove('active');
      }
    });

    const currentImage = slideshowImages[currentSlideIndex];
    if (currentImage) {
      currentImage.style.display = 'block';
      setTimeout(() => currentImage.classList.add('active'), 10);
    }

    currentSlideIndex = (currentSlideIndex + 1) % slideshowImages.length;
  }

  // Function to start slideshow
  function startSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    currentSlideIndex = 0;
    showNextSlide();
    slideshowInterval = setInterval(showNextSlide, 4000);
  }

  // Function to stop slideshow
  function stopSlideshow() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
    slideshowImages.forEach(img => {
      if (img) {
        img.style.display = 'none';
        img.classList.remove('active');
      }
    });
  }

  // Function to switch hero scenes
  function switchHeroScene(scene) {
    // Stop any running slideshow
    stopSlideshow();

    // Hide all scenes first
    if (heroVideo) heroVideo.style.display = 'none';
    slideshowImages.forEach(img => {
      if (img) img.style.display = 'none';
    });
    if (heroImageHomes) heroImageHomes.style.display = 'none';

    // Show the selected scene
    switch (scene) {
      case 'video':
        if (heroVideo) {
          heroVideo.style.display = 'block';
          if (heroVideo.paused) {
            heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
          }
        }
        break;
      case 'slideshow':
        if (heroVideo) heroVideo.pause();
        startSlideshow();
        break;
      case 'homes':
        if (heroImageHomes) {
          heroImageHomes.style.display = 'block';
          setTimeout(() => heroImageHomes.classList.add('active'), 10);
        }
        if (heroVideo) heroVideo.pause();
        break;
    }
  }

  // Add event listeners to all scene option radio buttons
  sceneOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      if (e.target.checked) {
        switchHeroScene(e.target.value);

        // Optional: Save preference to localStorage
        localStorage.setItem('preferredHeroScene', e.target.value);
      }
    });
  });

  // Check if there's a saved preference
  const savedPreference = localStorage.getItem('preferredHeroScene');
  if (savedPreference) {
    const savedOption = document.querySelector(`input[name="hero-scene"][value="${savedPreference}"]`);
    if (savedOption) {
      savedOption.checked = true;
      switchHeroScene(savedPreference);
    }
  }

  // Minimize/Maximize functionality
  if (minimizeBtn && demoCard) {
    // Check if there's a saved minimized state
    const savedMinimizedState = localStorage.getItem('demoCardMinimized');
    if (savedMinimizedState === 'true') {
      demoCard.classList.add('minimized');
      minimizeBtn.textContent = '+';
      minimizeBtn.title = 'Maximize';
    }

    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering drag
      demoCard.classList.toggle('minimized');

      if (demoCard.classList.contains('minimized')) {
        minimizeBtn.textContent = '+';
        minimizeBtn.title = 'Maximize';
        localStorage.setItem('demoCardMinimized', 'true');
      } else {
        minimizeBtn.textContent = '−';
        minimizeBtn.title = 'Minimize';
        localStorage.setItem('demoCardMinimized', 'false');
      }
    });
  }

  // Make demo card draggable
  if (demoCard) {
    let cardWidth = 0;
    let cardHeight = 0;
    let dragTicking = false;
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('demoCardPosition');
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      xOffset = x;
      yOffset = y;

      // We need initial dimensions for setPosition to work correctly
      const rect = demoCard.getBoundingClientRect();
      cardWidth = rect.width;
      cardHeight = rect.height;

      setPosition(x, y);
    }

    const dragHeader = demoCard.querySelector('.demo-card-header');
    if (dragHeader) {
      dragHeader.style.cursor = 'move';
      dragHeader.setAttribute('title', 'Drag to move');

      dragHeader.addEventListener('mousedown', dragStart);
      dragHeader.addEventListener('touchstart', dragStart);
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
      // Don't start dragging if clicking the minimize button
      if (e.target.classList.contains('demo-minimize-btn')) {
        return;
      }

      const rect = demoCard.getBoundingClientRect();
      cardWidth = rect.width;
      cardHeight = rect.height;

      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target === dragHeader || dragHeader.contains(e.target)) {
        isDragging = true;
        demoCard.style.transition = 'none';
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();

        if (e.type === 'touchmove') {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        if (!dragTicking) {
          requestAnimationFrame(() => {
            setPosition(xOffset, yOffset);
            dragTicking = false;
          });
          dragTicking = true;
        }
      }
    }

    function dragEnd() {
      if (isDragging) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;

        // Save position to localStorage
        localStorage.setItem('demoCardPosition', JSON.stringify({ x: xOffset, y: yOffset }));
      }
    }

    function setPosition(x, y) {
      // Keep card within viewport bounds using cached dimensions
      const maxX = window.innerWidth - cardWidth;
      const maxY = window.innerHeight - cardHeight;

      const finalX = Math.max(0, Math.min(x, maxX));
      const finalY = Math.max(0, Math.min(y, maxY));

      demoCard.style.transform = `translate(${finalX}px, ${finalY}px)`;
      demoCard.style.right = 'auto';
      demoCard.style.top = 'auto';
      demoCard.style.left = '0';
      demoCard.style.bottom = 'auto';
    }
  }
});
