/**
 * Utility to make elements draggable
 * Uses CSS transform: translate(x, y) for performance.
 * Saves position to localStorage.
 */
export function makeDraggable(element, handle = element) {
    if (!element || !handle) return;

    let isDragging = false;
    let startX, startY;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let initialX, initialY;
    let ticking = false;

    // Add cursor style
    handle.style.cursor = 'move';

    // Create unique ID for storage
    const storageId = element.id || element.className.split(' ')[0] || 'draggable';
    const storageKey = `drag_pos_${storageId}`;

    // Load saved position
    try {
        const savedPos = localStorage.getItem(storageKey);
        if (savedPos) {
            const { x, y } = JSON.parse(savedPos);
            currentTranslateX = x;
            currentTranslateY = y;
            requestAnimationFrame(() => {
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    } catch (e) {
        console.warn('Error loading drag pos', e);
    }

    function onStart(x, y) {
        isDragging = true;
        startX = x;
        startY = y;
        initialX = currentTranslateX;
        initialY = currentTranslateY;

        document.body.style.userSelect = 'none';
        element.style.transition = 'none'; // Disable transitions while dragging

        // Bring to front
        // element.style.zIndex = 1000;
    }

    function onMove(x, y) {
        if (!isDragging) return;

        const dx = x - startX;
        const dy = y - startY;

        currentTranslateX = initialX + dx;
        currentTranslateY = initialY + dy;

        if (!ticking) {
            requestAnimationFrame(() => {
                element.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;

        document.body.style.userSelect = '';
        element.style.transition = '';

        localStorage.setItem(storageKey, JSON.stringify({ x: currentTranslateX, y: currentTranslateY }));
    }

    // Mouse Events
    handle.addEventListener('mousedown', (e) => {
        // Ignore clicks on interactive elements
        if (['BUTTON', 'INPUT', 'A', 'TEXTAREA'].includes(e.target.tagName)) return;
        onStart(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            onMove(e.clientX, e.clientY);
        }
    });

    document.addEventListener('mouseup', onEnd);

    // Touch Events
    handle.addEventListener('touchstart', (e) => {
        if (['BUTTON', 'INPUT', 'A', 'TEXTAREA'].includes(e.target.tagName)) return;
        const touch = e.touches[0];
        onStart(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            onMove(touch.clientX, touch.clientY);
        }
    }, { passive: false });

    document.addEventListener('touchend', onEnd);
}
