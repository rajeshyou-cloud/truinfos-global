// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const siteNav   = document.getElementById('site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Industry dropdown toggle
const dropdown = document.getElementById('industry-dropdown');
const dropBtn  = dropdown && dropdown.querySelector('.nav-dropdown-toggle');

if (dropdown && dropBtn) {
  dropBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    dropBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    dropBtn.setAttribute('aria-expanded', 'false');
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      dropBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
