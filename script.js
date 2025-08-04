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

    // Load all weapons initially
    fetch('assets/data/weapons.json')
      .then(response => response.json())
      .then(data => {
        renderWeapons(data, 'all');

        // Filter functionality
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
});