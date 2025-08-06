document.addEventListener('DOMContentLoaded', () => {
  const currentTime = document.getElementById('current-time');
  currentTime.textContent = `10:24 +07, 8/6/2025`; // Updated to match system time

  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const filterBtn = document.getElementById('filter-btn');
  const articleList = document.getElementById('article-list');
  const fullArticle = document.getElementById('full-article');

  // Updated news articles including the new events
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
      title: "Thai Heavy Machinery Encroaches An Ses Territory",
      date: "2025-08-04",
      shortDescription: "Since 11 AM on August 4, Thai forces have used excavators to enter and lay barbed wire in Cambodia's An Ses area, despite objections.",
      fullContent: `
        <h2>Thai Heavy Machinery Encroaches An Ses Territory</h2>
        <p><strong>Date:</strong> August 4-5, 2025</p>
        <p>Since 11 AM on August 4, 2025, until the morning of August 5, 2025, Thai armed forces have been using heavy machinery, including excavators, to encroach upon Cambodia's sovereign territory in the An Ses area. Despite strong objections from Cambodian forces, they have laid barbed wire. This area has been under full Cambodian military control since the ceasefire took effect at midnight on July 28, 2025. The Cambodian Ministry of Defense has condemned this action as a violation of territorial integrity.</p>
      `
    },
    {
      title: "International Red Cross Visits 18 Detained Cambodian Soldiers",
      date: "2025-08-05",
      shortDescription: "The International Red Cross visited 18 Cambodian soldiers detained by Thailand on August 5, 2025, with Thai reports denying torture claims.",
      fullContent: `
        <h2>International Red Cross Visits 18 Detained Cambodian Soldiers</h2>
        <p><strong>Date:</strong> August 5, 2025</p>
        <p>On August 5, 2025, the International Red Cross visited the location where 18 Cambodian soldiers are detained by Thai forces. Thai newspaper Khaosod reported that the Thai Army allowed the Red Cross to meet the soldiers, asserting no torture occurred. However, no direct footage of the soldiers was provided, with only images of Thai military meetings with the Red Cross available. Cambodia continues to seek their immediate release, citing international humanitarian law concerns.</p>
      `
    },
    {
      title: "ASEAN Observer Group Departs for Ceasefire Monitoring",
      date: "2025-08-03",
      shortDescription: "The ASEAN Military Observer Group, led by Malaysia’s Colonel Nazlee Bin Abdul Rahim, left Phnom Penh to monitor the ceasefire in Oddar Meanchey and Preah Vihear.",
      fullContent: `
        <h2>ASEAN Observer Group Departs for Ceasefire Monitoring</h2>
        <p><strong>Date:</strong> August 3, 2025</p>
        <p>On August 3, 2025, the ASEAN Military Observer Group (Interim), comprising representatives from Indonesia, Laos, Myanmar, the Philippines, Singapore, and Vietnam, and led by Colonel Nazlee Bin Abdul Rahim, Malaysia’s Defense Attaché to Cambodia, departed from Phnom Penh. They headed to Oddar Meanchey and Preah Vihear provinces—areas impacted by recent clashes—to monitor the ceasefire implementation for two weeks. This mission follows the July 28, 2025, ceasefire agreement in Malaysia, aiming to ensure peace and stability for both nations.</p>
      `
    },
    {
      title: "Thailand Notified of ASEAN Observer Team Visit",
      date: "2025-08-03",
      shortDescription: "Cambodia’s Ministry of National Defense informed Thailand’s Defense Attaché of the ASEAN Observer Team’s visit to border areas from August 3, 2025.",
      fullContent: `
        <h2>Thailand Notified of ASEAN Observer Team Visit</h2>
        <p><strong>Date:</strong> August 3, 2025</p>
        <p>On August 3, 2025, Cambodia’s Department of International Relations of the Ministry of National Defense formally notified Thailand’s Defense Attaché in Cambodia about the ASEAN Defence Attaché Observer Team (Interim), led by Malaysia’s Defense Attaché and including other participating countries. The team is set to visit affected border areas in Oddar Meanchey and Preah Vihear provinces starting August 3 to oversee ceasefire compliance.</p>
      `
    },
    {
      title: "Cambodia Warns of Thai Offensive Plans",
      date: "2025-08-03",
      shortDescription: "Cambodia reports Thai military plans to attack from Tamone Thom to Anseh, breaching the ceasefire, prompting international appeals.",
      fullContent: `
        <h2>Cambodia Warns of Thai Offensive Plans</h2>
        <p><strong>Date:</strong> August 3, 2025</p>
        <p>At 10:49 AM on August 3, 2025, Cambodia’s Ministry of National Defense reported that Thai military, with authorities, ordered civilians in Surin Province to evacuate by night, signaling plans for attacks from Tamone Thom Temple to Anseh, including Preah Vihear Temple. This alleged offensive, set before the August 7 GBC meeting in Malaysia, violates the July 28 ceasefire. Cambodia appeals to the international community to prevent this breach and urges Thailand to respect the truce for regional stability.</p>
      `
    },
    {
      title: "GBC Delegation Arrives in Malaysia for Talks",
      date: "2025-08-03",
      shortDescription: "The Cambodia-Thailand GBC Secretariat delegation arrived in Malaysia on August 3 for meetings from August 4-7, 2025.",
      fullContent: `
        <h2>GBC Delegation Arrives in Malaysia for Talks</h2>
        <p><strong>Date:</strong> August 3, 2025</p>
        <p>On the afternoon of August 3, 2025, the delegation of the Cambodia-Thailand General Border Committee (GBC) Secretariat arrived safely in Malaysia. They are preparing for the GBC Secretariat Meeting (August 4-6, 2025) and the Extraordinary GBC Meeting on August 7, 2025, aimed at enhancing ceasefire implementation and bilateral trust.</p>
      `
    },
    {
      title: "Thai Forces Violate Ceasefire with An Ses Incursion",
      date: "2025-08-04",
      shortDescription: "At 11 AM on August 4, Thai forces entered An Ses with excavators and barbed wire, defying Cambodia’s sovereignty claims.",
      fullContent: `
        <h2>Thai Forces Violate Ceasefire with An Ses Incursion</h2>
        <p><strong>Date:</strong> August 4, 2025</p>
        <p>At 11 AM on August 4, 2025, Thai armed forces, accompanied by excavators, entered the An Ses area—Cambodian sovereign territory—and laid barbed wire despite strong objections. Cambodia, having hosted foreign defense attachés on July 30, asserts full control since the July 28 ceasefire. This act is deemed a flagrant violation, prompting Cambodia to call for international intervention to uphold the truce.</p>
      `
    },
    {
      title: "GBC Secretariat Meeting Continues in Kuala Lumpur",
      date: "2025-08-05",
      shortDescription: "The GBC Secretariat, led by Major General Sin Sokha, met in Kuala Lumpur from August 4-6 to strengthen ceasefire credibility.",
      fullContent: `
        <h2>GBC Secretariat Meeting Continues in Kuala Lumpur</h2>
        <p><strong>Date:</strong> August 5, 2025</p>
        <p>On August 5, 2025, in Kuala Lumpur, the Cambodia-Thailand General Border Committee (GBC) Secretariat, led by Major General Sin Sokha, continued discussions to enhance the ceasefire’s effectiveness and build mutual trust. The meeting, held from August 4-6, precedes the Extraordinary GBC Meeting on August 7, 2025.</p>
      `
    },
    {
      title: "Thai Provocations Escalate in An Ses Area",
      date: "2025-08-05",
      shortDescription: "Thai forces used excavators and dug trenches in An Ses from 9:09 AM, prompting Cambodian calls for withdrawal.",
      fullContent: `
        <h2>Thai Provocations Escalate in An Ses Area</h2>
        <p><strong>Date:</strong> August 5, 2025</p>
        <p>At 9:09 AM on August 5, 2025, Thai forces in An Ses used excavators to clear land, followed by trench digging at 9:53 AM and further activity by 10:55 AM, 15 meters from Cambodian positions. These actions violate the ceasefire, leading Cambodia to demand an immediate withdrawal, though discussions continue without resolution.</p>
      `
    },
    {
      title: "Barbed Wire Removed in An Ses After Negotiations",
      date: "2025-08-05",
      shortDescription: "Thai-installed barbed wire in An Ses was removed by 5:30 PM on August 5 after talks with Cambodian forces.",
      fullContent: `
        <h2>Barbed Wire Removed in An Ses After Negotiations</h2>
        <p><strong>Date:</strong> August 5, 2025</p>
        <p>By 5:30 PM on August 5, 2025, the barbed wire illegally installed by Thai forces in An Ses on August 4 was removed, and machinery ceased operations following negotiations with Cambodian forces. The area, under Cambodian control since the July 28 ceasefire, remains a focal point of tension.</p>
      `
    }
  ];

  // Generate news files in blog folder (simulated)
  function generateNewsFiles() {
    newsArticles.forEach(article => {
      const filename = `${article.date.replace(/-/g, '')}-${article.title.toLowerCase().replace(/\s+/g, '-')}.html`;
      const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="${article.shortDescription}">
          <meta name="keywords" content="Cambodia, Thailand, border conflict, 2025, news, ${article.title.toLowerCase().replace(/\s+/g, '-')}, An Ses, Red Cross, ASEAN, ceasefire">
          <meta name="author" content="Justice Campaign">
          <meta name="robots" content="index, follow">
          <meta name="generator" content="xAI Custom Tool">
          <meta property="og:title" content="${article.title}">
          <meta property="og:description" content="${article.shortDescription}">
          <meta property="og:image" content="https://justices.cam/assets/images/conflict-banner.jpg">
          <meta property="og:url" content="https://justices.cam/blog/${filename}">
          <meta property="og:type" content="article">
          <link rel="sitemap" type="application/xml" title="Sitemap" href="https://justices.cam/sitemap.xml">
          <link rel="icon" href="../assets/icons/favicon.ico">
          <link rel="stylesheet" href="styles.css">
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
                <li><a href="../dont-thai-to-me.html">Don't Thai to Me</a></li>
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
          <script src="script.js"></script>
          <!-- Google Tag Manager (noscript) -->
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NRC6TTH5"
          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
          <!-- End Google Tag Manager (noscript) -->
        </body>
        </html>
      `;
      // Simulated file generation (in a real environment, use fs.writeFile)
      console.log(`Generated: blog/${filename}`);
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
  displayArticles('2025-07-01', '2025-08-06');
  generateNewsFiles();
});
