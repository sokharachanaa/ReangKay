/* ==========================================================================
   NAVIGATION.JS — active states & nav helpers
   ========================================================================== */

(function(){
  const page = (window.location.pathname.split('/').pop() || 'index.html');

  // Highlight active top-nav link
  document.querySelectorAll('.topnav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if(href === page || (page === '' && href === 'index.html')){
      link.classList.add('active');
    }
  });

  // Highlight active bottom-nav item
  document.querySelectorAll('.bottomnav .bn-item').forEach(item => {
    const href = item.getAttribute('href');
    if(href === page || (page === '' && href === 'index.html')){
      item.classList.add('active');
    }
  });

  // Sticky header shadow on scroll
  const topnav = document.querySelector('.topnav');
  if(topnav){
    window.addEventListener('scroll', () => {
      topnav.style.boxShadow = window.scrollY > 6 ? '0 4px 16px rgba(27,42,74,.08)' : 'none';
    });
  }
})();

// Gender tab switcher (Information page)
function switchGenderTab(gender){
  document.querySelectorAll('.gender-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gender === gender);
  });
  document.querySelectorAll('[data-gender-panel]').forEach(panel => {
    panel.style.display = panel.dataset.genderPanel === gender ? '' : 'none';
  });
}
window.switchGenderTab = switchGenderTab;

// Bottom-nav "More" / notification badge demo
document.addEventListener('DOMContentLoaded', () => {
  const bell = document.querySelector('#notifBell');
  if(bell){
    bell.addEventListener('click', () => {
      const dot = bell.querySelector('.notif-dot');
      if(dot) dot.remove();
      if(window.showToast) showToast('No new notifications', 'fa-bell');
    });
  }
});

const chips = document.querySelectorAll(".filter-chip");

chips.forEach(chip => {
    chip.addEventListener("click", () => {

        // Remove active from all chips
        chips.forEach(c => c.classList.remove("active"));

        // Keep the clicked chip active
        chip.classList.add("active");

    });
});