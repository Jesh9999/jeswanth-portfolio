
document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const toggle = document.createElement('div');
  toggle.innerHTML = '🌓';
  toggle.style.cursor = 'pointer';
  toggle.style.fontSize = '1.5rem';
  toggle.style.marginLeft = '1rem';
  document.querySelector('.nav.container').appendChild(toggle);
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // Typed.js animation
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
  script.onload = () => {
    new Typed('#typed-text', {
      strings: ['Hi, I\'m Jeswanth', 'Data Analyst', 'Data Engineer', 'Problem Solver'],
      typeSpeed: 60,
      backSpeed: 40,
      loop: true
    });
  };
  document.body.appendChild(script);

  // Scroll to top button
  const scrollBtn = document.createElement('div');
  scrollBtn.innerHTML = '⬆️';
  scrollBtn.id = 'scrollTopBtn';
  scrollBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 14px;border-radius:50%;font-size:20px;cursor:pointer;display:none;background:#4c6ef5;color:white;';
  document.body.appendChild(scrollBtn);

  scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  window.onscroll = () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  };
});
