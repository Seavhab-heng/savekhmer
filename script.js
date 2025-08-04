document.addEventListener('DOMContentLoaded', () => {
  fetch('assets/data/timeline.json')
    .then(response => response.json())
    .then(data => {
      const timelineContent = document.getElementById('timeline-content');
      data.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.style.animationDelay = `${index * 0.2}s`;
        div.innerHTML = `<strong>${item.date}</strong>: ${item.event}`;
        timelineContent.appendChild(div);
      });
    });
});
