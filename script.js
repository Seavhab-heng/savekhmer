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


document.addEventListener('DOMContentLoaded', () => {
  // [Previous code for Hamburger, Timeline, Weapons unchanged]

  // Load Map (for map.html)
  if (document.getElementById('map')) {
    // [Previous map code unchanged]
  }

  // Load Blog (for blog/index.html)
  if (document.getElementById('blog')) {
    const currentTime = document.getElementById('current-time');
    currentTime.textContent = `12:33 +08, 8/5/2025`; // Updated to match system time

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');
    const articleList = document.getElementById('article-list');
    const fullArticle = document.getElementById('full-article');

    // Sample news articles based on provided events
    const newsArticles = [
      {
        title: "Thai Airstrikes Escalate Near Preah Vihear",
        date: "2025-07-24",
        shortDescription: "Thai F-16 jets dropped MK-82 bombs near Preah Vihear Temple, intensifying the conflict.",
        fullContent: `
          <h2>Thai Airstrikes Escalate Near Preah Vihear</h2>
          <p><strong>Date:</strong> July 24, 2025</p>
          <p>On July 24, 2025, Thai F-16 jets conducted airstrikes, dropping MK-82 bombs near the historic Preah Vihear Temple, a UNESCO World Heritage site. The attack marked a significant escalation in the ongoing Cambodia-Thailand border conflict, displacing over 32,558 people. Cambodian forces reported heavy casualties, while Thailand claimed the strikes targeted military positions. International observers are calling for an immediate ceasefire.</p>
        `
      },
      {
        title: "Ceasefire Signed but Tensions Remain",
        date: "2025-07-29",
        shortDescription: "A ceasefire was signed, but Thai forces captured unarmed Cambodian troops near Oddar Meanchey.",
        fullContent: `
          <h2>Ceasefire Signed but Tensions Remain</h2>
          <p><strong>Date:</strong> July 29, 2025</p>
          <p>On July 29, 2025, a ceasefire was officially signed to halt the Cambodia-Thailand border conflict. However, tensions flared when Thai forces captured 20 unarmed Cambodian troops near Oddar Meanchey, displacing an additional 39,546 individuals. Cambodia denounced the action as a violation, while Thailand argued it was a response to border incursions. The Global Border Commission is set to investigate.</p>
        `
      },
      {
        title: "GBC Meeting Scheduled Post-Ceasefire",
        date: "2025-08-01",
        shortDescription: "The Global Border Commission plans a meeting to address ongoing disputes.",
        fullContent: `
          <h2>GBC Meeting Scheduled Post-Ceasefire</h2>
          <p><strong>Date:</strong> August 1, 2025</p>
          <p>Following the July 29 ceasefire, the Global Border Commission announced a meeting scheduled for August 5, 2025, to address the ongoing Cambodia-Thailand border dispute. The agenda includes the recent capture of unarmed troops and the displacement crisis affecting over 70,000 people. Both nations are urged to present evidence to resolve the conflict peacefully.</p>
        `
      }
    ];

    // Generate news files in blog folder (simulated)
    function generateNewsFiles() {
      newsArticles.forEach(article => {
        const filename = `blog/${article.date.replace(/-/g, '')}-${article.title.toLowerCase().replace(/\s+/g, '-')}.html`;
        const content = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="${article.shortDescription}">
            <meta name="keywords" content="Cambodia, Thailand, border conflict, 2025, news">
            <meta name="author" content="Justice Campaign">
            <meta name="robots" content="index, follow">
            <meta name="generator" content="xAI Custom Tool">
            <meta property="og:title" content="${article.title}">
            <meta property="og:description" content="${article.shortDescription}">
            <meta property="og:image" content="https://justices.cam/assets/images/conflict-banner.jpg">
            <meta property="og:url" content="https://justices.cam/${filename}">
            <meta property="og:type" content="article">
            <link rel="sitemap" type="application/xml" title="Sitemap" href="https://justices.cam/sitemap.xml">
            <link rel="icon" href="../assets/icons/favicon.ico">
            <link rel="stylesheet" href="../styles.css">
            <title>${article.title} | Cambodia-Thailand Border Conflict 2025</title>
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NRC6TTH5');</script>
          </head>
          <body>
            <header>
              <button id="menu-toggle" aria-label="Toggle menu" class="hamburger">
                <span></span><span></span><span></span>
              </button>
              <nav aria-label="Main navigation" id="main-nav">
                <ul>
                  <li><a href="../index.html">Home</a></li>
                  <li><a href="../map.html">Map</a></li>
                  <li><a href="../weapons.html">Weapons</a></li>
                  <li><a href="../war-criminal.html">War Crimes</a></li>
                  <li><a href="../donate.html">Donate</a></li>
                  <li><a href="index.html">Blog</a></li>
                </ul>
              </nav>
            </header>
            <main>
              <section id="news-article">
                ${article.fullContent}
              </section>
            </main>
            <footer>
              <p>&copy; 2025 Cambodia-Thailand Conflict Documentary</p>
            </footer>
            <script src="../script.js"></script>
            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NRC6TTH5"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->
          </body>
          </html>
        `;
        // Simulated file generation (in a real environment, use fs.writeFile)
        console.log(`Generated: ${filename}`);
      });
    }

    // Initial display
    function displayArticles(startDate, endDate) {
      articleList.innerHTML = '';
      const filteredArticles = newsArticles.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate >= new Date(startDate) && articleDate <= new Date(endDate);
      });

      filteredArticles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'article-item';
        div.innerHTML = `
          <h3>${article.title}</h3>
          <p><strong>Date:</strong> ${article.date}</p>
          <p>${article.shortDescription}</p>
          <button class="read-more" data-date="${article.date}">Read More</button>
        `;
        div.addEventListener('mouseenter', () => div.classList.add('hovered'));
        div.addEventListener('mouseleave', () => div.classList.remove('hovered'));
        articleList.appendChild(div);
      });

      // Clear full article on filter
      fullArticle.innerHTML = '';
    }

    // Read More functionality
    articleList.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-more')) {
        const date = e.target.getAttribute('data-date');
        const article = newsArticles.find(a => a.date === date);
        if (article) {
          fullArticle.innerHTML = article.fullContent;
        }
      }
    });

    // Filter button event
    filterBtn.addEventListener('click', () => {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      displayArticles(startDate, endDate);
    });

    // Initial load
    displayArticles('2025-07-01', '2025-08-05');
    generateNewsFiles();
  }
});