// [Previous code unchanged until map section]
if (document.getElementById('map')) {
  const map = L.map('map').setView([14.39, 104.68], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  const currentTime = document.getElementById('current-time');
  currentTime.textContent = `06:52 +08, 8/5/2025`;

  let heatLayer, militaryOverlay;

  fetch('assets/data/province-metrics.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch province metrics');
      return response.json();
    })
    .then(data => {
      const provinceInfo = document.getElementById('province-info');
      const filterButtons = document.querySelectorAll('#filter-menu button');
      const overlayToggle = document.getElementById('overlay-toggle');

      renderMap(data, 'all');

      const overlays = data.find(item => item.overlay === 'Military Regions');
      if (overlays) {
        militaryOverlay = L.geoJSON(overlays, {
          style: function (feature) {
            return {
              fillColor: feature.properties.color || '#ff4500',
              fillOpacity: feature.properties.opacity || 0.4,
              color: feature.properties.color || '#ff4500',
              weight: 2,
              opacity: 0.8,
              dashArray: '5, 5'
            };
          },
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <h3>${feature.properties.name}</h3>
              <p>Country: ${feature.properties.country || 'N/A'}</p>
              <p>${feature.properties.description || 'No description'}</p>
              <p>Opacity: ${(feature.properties.opacity * 100 || 40)}%</p>
            `);
          }
        }).addTo(map);

        overlayToggle.addEventListener('click', () => {
          if (map.hasLayer(militaryOverlay)) {
            map.removeLayer(militaryOverlay);
            overlayToggle.textContent = 'Show Military Regions';
          } else {
            map.addLayer(militaryOverlay);
            overlayToggle.textContent = 'Hide Military Regions';
          }
        });
      }

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filter = button.getAttribute('data-filter');
          renderMap(data, filter);
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
        });
      });

      function renderMap(data, filter) {
        if (heatLayer) map.removeLayer(heatLayer);
        provinceInfo.innerHTML = '';
        map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });

        const heatPoints = [];
        data.forEach(province => {
          if (province.events) {
            province.events.forEach(event => {
              if (filter === 'all' || event.date === filter) {
                if (event.date >= '2025-07-24' && event.date <= '2025-07-29') {
                  heatPoints.push([province.coordinates[0], province.coordinates[1], event.intensity * 1.5]);
                } else {
                  heatPoints.push([province.coordinates[0], province.coordinates[1], event.intensity]);
                }
              }
            });
          }
        });

        heatLayer = L.heatLayer(heatPoints, {
          radius: 25, blur: 15, maxZoom: 17, gradient: { 0.4: 'yellow', 0.65: 'orange', 1: 'red' }
        }).addTo(map);

        data.forEach(province => {
          if (province.events && province.events.length > 0) {
            const events = province.events.filter(event => filter === 'all' || event.date === filter);
            if (events.length > 0) {
              const marker = L.marker(province.coordinates, { title: province.province }).addTo(map);
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

        if (filter === 'all' || filter === '2025-07-29') {
          const oddarMeanchey = [14.15, 103.50];
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
// [Rest of the code unchanged]