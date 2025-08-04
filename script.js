document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
  });

  // Load Timeline (for index.html)
  if (document.getElementById('timeline-content')) {
    fetch('assets/data/timeline.json')
      .then(response => response.json())
      .then(data => {
        const timelineContent = document.getElementById('timeline-content');
        data.forEach((item, index) => {
          const div = document.createElement('div');
          div.className = 'timeline-item';
          div.style.animationDelay = `${index * 0.2}s`;
          div.innerHTML = `<strong>${item.date}</strong>: ${item.event}`;
          div.addEventListener('mouseenter', () => div.classList.add('hovered'));
          div.addEventListener('mouseleave', () => div.classList.remove('hovered'));
          timelineContent.appendChild(div);
        });
      });
  }

  // Load Weapons (for weapons.html)
  if (document.getElementById('weapons-content')) {
    const weaponsContent = document.getElementById('weapons-content');
    const filterButtons = document.querySelectorAll('#filter-menu button');
    fetch('assets/data/weapons.json')
      .then(response => response.json())
      .then(data => {
        renderWeapons(data, 'all');
        filterButtons.forEach(button => {
          button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            renderWeapons(data, filter);
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
          });
        });
      });

    function renderWeapons(data, filter) {
      weaponsContent.innerHTML = '';
      data.forEach(category => {
        if (filter === 'all' || filter === category.category) {
          category.weapons.forEach((weapon, index) => {
            const div = document.createElement('div');
            div.className = 'weapon-item';
            div.style.animationDelay = `${index * 0.2}s`;
            div.innerHTML = `
              <h3>${weapon.name}</h3>
              <p>${weapon.description || 'No description available.'}</p>
              ${weapon.image ? `<img src="${weapon.image}" alt="${weapon.name}" class="weapon-image">` : ''}
            `;
            div.addEventListener('mouseenter', () => div.classList.add('hovered'));
            div.addEventListener('mouseleave', () => div.classList.remove('hovered'));
            weaponsContent.appendChild(div);
          });
        }
      });
    }
  }

  // Load Map (for map.html)
  if (document.getElementById('map')) {
    const map = L.map('map').setView([14.39, 104.68], 8); // Center on Preah Vihear
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    // Current Date and Time
    const currentTime = document.getElementById('current-time');
    currentTime.textContent = `06:35 +08, 8/5/2025`; // Hardcoded to match system time

    // Heatmap Layer
    let heatLayer;
    // Military Regions Overlay
    let militaryOverlay;

    fetch('assets/data/province-metrics.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch province metrics');
        return response.json();
      })
      .then(data => {
        const provinceInfo = document.getElementById('province-info');
        const filterButtons = document.querySelectorAll('#filter-menu button');
        const overlayToggle = document.getElementById('overlay-toggle');

        // Initial render: all events
        renderMap(data, 'all');

        // Load Military Regions Overlay
        fetch('assets/data/military-regions.geojson')
          .then(response => {
            if (!response.ok) throw new Error('Failed to fetch military regions');
            return response.json();
          })
          .then(geojson => {
            militaryOverlay = L.geoJSON(geojson, {
              style: function (feature) {
                return {
                  fillColor: feature.properties.mask ? '#ff4500' : '#ffffff', // Orange for mask
                  fillOpacity: feature.properties.mask ? 0.4 : 0,          // 40% opacity
                  color: feature.properties.mask ? '#ff4500' : '#000000',  // Border color
                  weight: feature.properties.mask ? 2 : 0,                 // Border weight
                  opacity: feature.properties.mask ? 0.8 : 0,              // Border opacity
                  dashArray: feature.properties.mask ? '5, 5' : ''         // Dashed line for mask effect
                };
              },
              onEachFeature: (feature, layer) => {
                layer.bindPopup(`
                  <h3>${feature.properties.region}</h3>
                  <p>Country: ${feature.properties.country}</p>
                  <p>${feature.properties.description}</p>
                  <p>Opacity: 40%</p>
                `);
              }
            }).addTo(map); // Add overlay by default

            // Toggle Overlay
            overlayToggle.addEventListener('click', () => {
              if (map.hasLayer(militaryOverlay)) {
                map.removeLayer(militaryOverlay);
                overlayToggle.textContent = 'Show Military Regions';
              } else {
                map.addLayer(militaryOverlay);
                overlayToggle.textContent = 'Hide Military Regions';
              }
            });
          })
          .catch(error => console.error('Error loading military regions overlay:', error));

        // Filter functionality
        filterButtons.forEach(button => {
          button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            renderMap(data, filter);
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
          });
        });

        function renderMap(data, filter) {
          // Clear previous layers
          if (heatLayer) map.removeLayer(heatLayer);
          provinceInfo.innerHTML = '';
          map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
          });

          // Heatmap points
          const heatPoints = [];
          data.forEach(province => {
            province.events.forEach(event => {
              if (filter === 'all' || event.date === filter) {
                heatPoints.push([province.coordinates[0], province.coordinates[1], event.intensity]);
              }
            });
          });

          // Add heatmap
          heatLayer = L.heatLayer(heatPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'yellow', 0.65: 'orange', 1: 'red' }
          }).addTo(map);

          // Add markers and province info
          data.forEach(province => {
            if (province.events.length > 0) {
              const events = province.events.filter(event => filter === 'all' || event.date === filter);
              if (events.length > 0) {
                const marker = L.marker(province.coordinates, {
                  title: province.province
                }).addTo(map);
                marker.bindPopup(`
                  <h3>${province.province}</h3>
                  <p>Displaced: ${province.displaced || 0}</p>
                  <ul>${events.map(event => `<li><strong>${event.date}</strong>: ${event.description}</li>`).join('')}</ul>
                `);

                const div = document.createElement('div');
                div.className = 'event-item';
                div.innerHTML = `
                  <h3>${province.province}</h3>
                  <p>Displaced: ${province.displaced || 0}</p>
                  <ul>${events.map(event => `<li><strong>${event.date}</strong>: ${event.description}</li>`).join('')}</ul>
                `;
                div.addEventListener('mouseenter', () => div.classList.add('hovered'));
                div.addEventListener('mouseleave', () => div.classList.remove('hovered'));
                provinceInfo.appendChild(div);
              }
            }
          });
        }
      })
      .catch(error => console.error('Error loading province metrics:', error));
  }
});
