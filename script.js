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

  // Load Map (for map.html)
  if (document.getElementById('map')) {
    const map = L.map('map').setView([14.39, 104.68], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    const currentTime = document.getElementById('current-time');
    currentTime.textContent = `10:24 +07, 8/6/2025`; // Updated to match system time

    // [Rest of the map code remains unchanged]
  }

  // [Rest of the script.js remains unchanged]
});
