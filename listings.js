// Listings page functionality
document.addEventListener('DOMContentLoaded', function () {

  // Property data
  const properties = [
    {
      id: 1,
      address: '123 Oak Street',
      city: 'Ladson',
      state: 'SC',
      zip: '29456',
      price: 1850,
      beds: 3,
      baths: 2,
      sqft: 1450,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      lat: 33.0057,
      lng: -80.1098,
      mls: 'PV20203840MR',
      url: 'property-123-oak.html',
      color: '#10b981'
    },
    {
      id: 2,
      address: '456 Maple Avenue',
      city: 'Ladson',
      state: 'SC',
      zip: '29456',
      price: 2100,
      beds: 4,
      baths: 2.5,
      sqft: 1800,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      lat: 33.0087,
      lng: -80.1128,
      mls: 'PV20203841MR',
      url: 'property-456-maple.html',
      color: '#f59e0b'
    },
    {
      id: 3,
      address: '789 Pine Road',
      city: 'Ladson',
      state: 'SC',
      zip: '29456',
      price: 1650,
      beds: 3,
      baths: 2,
      sqft: 1200,
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      lat: 33.0027,
      lng: -80.1068,
      mls: 'PV20203842MR',
      url: 'property-789-pine.html',
      color: '#10b981'
    },
    {
      id: 4,
      address: '321 Cedar Lane',
      city: 'Ladson',
      state: 'SC',
      zip: '29456',
      price: 2350,
      beds: 4,
      baths: 3,
      sqft: 2100,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      lat: 33.0107,
      lng: -80.1148,
      mls: 'PV20203843MR',
      url: 'property-321-cedar.html',
      color: '#8b5cf6'
    },
    {
      id: 5,
      address: '654 Elm Street',
      city: 'Ladson',
      state: 'SC',
      zip: '29456',
      price: 1450,
      beds: 2,
      baths: 2,
      sqft: 1000,
      image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      lat: 33.0047,
      lng: -80.1118,
      mls: 'PV20203844MR',
      url: 'property-654-elm.html',
      color: '#10b981'
    },
    {
      id: 6,
      address: '987 Birch Drive',
      city: 'Ladson',
      state: 'SC',
      zip: '29456',
      price: 1950,
      beds: 3,
      baths: 2.5,
      sqft: 1600,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      lat: 33.0067,
      lng: -80.1078,
      mls: 'PV20203845MR',
      url: 'property-987-birch.html',
      color: '#10b981'
    }
  ];

  // Initialize map
  const map = L.map('map').setView([33.0057, -80.1098], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Store markers
  let mapMarkers = [];

  // Create custom marker icon with price label
  function createMarkerIcon(color, price) {
    return L.divIcon({
      className: 'custom-marker-with-price',
      html: `
        <div style="position: relative; width: 80px; height: 60px;">
          <div style="position: absolute; left: 50%; transform: translateX(-50%); top: 0; background: white; padding: 4px 8px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); font-weight: 700; font-size: 13px; color: #1f2937; white-space: nowrap; border: 2px solid ${color};">
            $${price.toLocaleString()}
          </div>
          <div style="position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; background: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [80, 60],
      iconAnchor: [40, 60]
    });
  }

  // Render property cards
  function renderPropertyCards(propertiesToRender) {
    const container = document.getElementById('propertyCards');
    container.innerHTML = '';

    // Clear existing markers
    mapMarkers.forEach(marker => map.removeLayer(marker));
    mapMarkers = [];

    propertiesToRender.forEach(property => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.dataset.propertyId = property.id;
      card.innerHTML = `
        <div class="property-card-image" style="background-image: url('${property.image}')">
          <span class="property-status">${property.status}</span>
          <div class="property-actions">
            <button class="action-btn" title="Save">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 3.5C7.5 1 3 1 1 4c-2 3 0 7 9 12 9-5 11-9 9-12-2-3-6.5-3-9-.5z"/>
              </svg>
            </button>
            <button class="action-btn" title="Share">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="4" cy="10" r="2"/>
                <circle cx="16" cy="6" r="2"/>
                <circle cx="16" cy="14" r="2"/>
                <path d="M6 9l8-3M6 11l8 3"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="property-card-content">
          <div class="property-price">$${property.price.toLocaleString()}/month</div>
          <div class="property-specs">
            <span>${property.beds} bd</span>
            <span>${property.baths} ba</span>
            <span>${property.sqft.toLocaleString()} sqft</span>
          </div>
          <div class="property-address">${property.address}, ${property.city}, ${property.state} ${property.zip}</div>
          <div class="property-mls">MLS# ${property.mls}</div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn')) {
          window.location.href = property.url;
        }
      });

      container.appendChild(card);

      // Add marker to map with price label
      const marker = L.marker([property.lat, property.lng], {
        icon: createMarkerIcon(property.color, property.price)
      })
        .bindTooltip(`
          <div class="map-tooltip">
            <img src="${property.image}" alt="${property.address}" style="width: 200px; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 8px; display: block;">
            <div style="font-weight: 700; font-size: 15px; color: #1f2937; margin-bottom: 4px;">$${property.price.toLocaleString()}/month</div>
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">${property.beds} bd | ${property.baths} ba | ${property.sqft.toLocaleString()} sqft</div>
            <div style="color: #374151; font-size: 12px; font-weight: 500;">${property.address}</div>
            <div style="color: #9ca3af; font-size: 11px; margin-top: 2px;">${property.city}, ${property.state} ${property.zip}</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -10],
          opacity: 1,
          className: 'custom-tooltip'
        })
        .bindPopup(`
          <div class="map-popup" style="cursor: pointer;">
            <img src="${property.image}" alt="${property.address}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">$${property.price.toLocaleString()}/mo</div>
            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">${property.beds} bd | ${property.baths} ba | ${property.sqft.toLocaleString()} sqft</div>
            <div style="color: #374151; font-size: 13px; margin-bottom: 8px;">${property.address}</div>
            <a href="${property.url}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">View Listing</a>
          </div>
        `)
        .addTo(map);

      // Add click event to highlight corresponding card
      marker.on('click', () => {
        // Remove highlight from all cards
        document.querySelectorAll('.property-card').forEach(c => {
          c.classList.remove('highlighted');
        });

        // Find and highlight the corresponding card
        const targetCard = document.querySelector(`[data-property-id="${property.id}"]`);
        if (targetCard) {
          targetCard.classList.add('highlighted');

          // Scroll the card into view
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      mapMarkers.push(marker);
    });
  }

  // Filter state
  let currentFilters = {
    search: '',
    priceRange: 'Any price',
    beds: 'All beds',
    baths: 'All baths'
  };

  // Filter properties based on current filters
  function filterProperties() {
    let filtered = [...properties];

    // Search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      filtered = filtered.filter(prop =>
        prop.address.toLowerCase().includes(searchLower) ||
        prop.city.toLowerCase().includes(searchLower) ||
        prop.zip.includes(searchLower)
      );
    }

    // Price filter
    if (currentFilters.priceRange !== 'Any price') {
      if (currentFilters.priceRange === '$0 - $1,500') {
        filtered = filtered.filter(prop => prop.price <= 1500);
      } else if (currentFilters.priceRange === '$1,500 - $2,000') {
        filtered = filtered.filter(prop => prop.price > 1500 && prop.price <= 2000);
      } else if (currentFilters.priceRange === '$2,000+') {
        filtered = filtered.filter(prop => prop.price > 2000);
      }
    }

    // Beds filter
    if (currentFilters.beds !== 'All beds') {
      const minBeds = parseInt(currentFilters.beds);
      filtered = filtered.filter(prop => prop.beds >= minBeds);
    }

    // Baths filter
    if (currentFilters.baths !== 'All baths') {
      const minBaths = parseInt(currentFilters.baths);
      filtered = filtered.filter(prop => prop.baths >= minBaths);
    }

    // Update results count
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    }

    return filtered;
  }

  // Search input handler
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      const filtered = filterProperties();
      renderPropertyCards(filtered);
    });
  }

  // Filter select handlers
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach((select, index) => {
    select.addEventListener('change', (e) => {
      const value = e.target.value;

      // Determine which filter based on index or options
      if (index === 1) { // Price filter (second select)
        currentFilters.priceRange = value;
      } else if (index === 3) { // Beds filter (fourth select)
        currentFilters.beds = value;
      } else if (index === 4) { // Baths filter (fifth select)
        currentFilters.baths = value;
      }

      const filtered = filterProperties();
      renderPropertyCards(filtered);
    });
  });

  // Initial render
  renderPropertyCards(properties);

  // View toggle
  const viewBtns = document.querySelectorAll('.view-btn');
  const listingsPanel = document.querySelector('.listings-panel');
  const mapPanel = document.querySelector('.map-panel');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.dataset.view;
      if (view === 'map') {
        listingsPanel.style.display = 'none';
        mapPanel.style.width = '100%';
        setTimeout(() => map.invalidateSize(), 100);
      } else {
        listingsPanel.style.display = 'block';
        mapPanel.style.width = '60%';
        setTimeout(() => map.invalidateSize(), 100);
      }
    });
  });

  // Sort functionality
  const sortSelect = document.querySelector('.sort-select');
  sortSelect.addEventListener('change', (e) => {
    const sortBy = e.target.value;
    let sorted = [...properties];

    switch (sortBy) {
      case 'Price (Low to High)':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'Price (High to Low)':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'Beds':
        sorted.sort((a, b) => b.beds - a.beds);
        break;
      case 'Baths':
        sorted.sort((a, b) => b.baths - a.baths);
        break;
      default:
        // Newest (default order)
        break;
    }


    renderPropertyCards(sorted);
  });

  // Save/favorite functionality
  document.addEventListener('click', (e) => {
    if (e.target.closest('.action-btn[title="Save"]')) {
      const btn = e.target.closest('.action-btn');
      btn.classList.toggle('saved');
      const svg = btn.querySelector('svg');
      if (btn.classList.contains('saved')) {
        svg.setAttribute('fill', 'currentColor');
      } else {
        svg.setAttribute('fill', 'none');
      }
    }
  });

  // Resizable Map Functionality
  const resizer = document.getElementById('dragMe');
  const leftPanel = document.querySelector('.listings-panel');
  const rightPanel = document.querySelector('.map-panel');
  const parentContainer = document.querySelector('.listings-main');

  let x = 0;
  let leftWidth = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;
    const leftStyle = window.getComputedStyle(leftPanel);
    leftWidth = parseInt(leftStyle.width, 10);

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // Disable selection while dragging
    document.body.style.userSelect = 'none';
    resizer.classList.add('resizing');
  };

  let parentWidth = parentContainer ? parentContainer.clientWidth : 0;
  let scrollTicking = false;

  window.addEventListener('resize', () => {
    if (parentContainer) parentWidth = parentContainer.clientWidth;
  }, { passive: true });

  const mouseMoveHandler = function (e) {
    if (!parentContainer) return;

    const dx = e.clientX - x;
    const newLeftWidth = leftWidth + dx;

    // Min/Max constraints
    if (newLeftWidth > 250 && newLeftWidth < parentWidth - 250) {
      leftPanel.style.width = `${newLeftWidth}px`;

      // Throttle map invalidation to avoid forced reflow on every pixel change
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          map.invalidateSize();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }
  };

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    document.body.style.userSelect = '';
    resizer.classList.remove('resizing');

    // Final map update
    setTimeout(() => map.invalidateSize(), 50);
  };

  if (resizer) {
    resizer.addEventListener('mousedown', mouseDownHandler);
  }
});
