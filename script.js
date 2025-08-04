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
    currentTime.textContent = `07:14 +08, 8/5/2025`; // Updated to match system time

    // Heatmap Layer
    let heatLayer;

    fetch('assets/data/province-metrics.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch province metrics');
        return response.json();
      })
      .then(data => {
        const provinceInfo = document.getElementById('province-info');
        const filterButtons = document.querySelectorAll('#filter-menu button');

        // Initial render: all events
        renderMap(data, 'all');

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

          // Heatmap points (updated for July 24-29 events)
          const heatPoints = [];
          data.forEach(province => {
            if (province.events) {
              province.events.forEach(event => {
                if (filter === 'all' || event.date === filter) {
                  if (event.date >= '2025-07-24' && event.date <= '2025-07-29') {
                    heatPoints.push([province.coordinates[0], province.coordinates[1], event.intensity * 1.5]); // Increased intensity for escalation
                  } else {
                    heatPoints.push([province.coordinates[0], province.coordinates[1], event.intensity]);
                  }
                }
              });
            }
          });

          // Add heatmap
          heatLayer = L.heatLayer(heatPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'yellow', 0.65: 'orange', 1: 'red' }
          }).addTo(map);

          // Add markers and province info (updated for July 24-29)
          data.forEach(province => {
            if (province.events && province.events.length > 0) {
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

          // Add specific marker for July 29 event (Oddar Meanchey)
          if (filter === 'all' || filter === '2025-07-29') {
            const oddarMeanchey = [14.15, 103.50]; // Approximate coordinates
            const marker = L.marker(oddarMeanchey, { title: 'Oddar Meanchey' }).addTo(map);
            marker.bindPopup(`
              <h3>Oddar Meanchey</h3>
              <p>Date: July 29, 2025</p>
              <p>Description: Thai forces captured unarmed Cambodian troops post-ceasefire.</p>
            `);
          }
        }
      })
      .catch(error => console.error('Error loading province metrics:', error));
  }
});