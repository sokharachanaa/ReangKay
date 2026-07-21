/* ==========================================================================
   MAIN.JS — Shared behaviors across REANGKAY
   ========================================================================== */

// ---- Loading screen ----
window.addEventListener('load', () => {
  const ls = document.querySelector('.loading-screen');
  if(ls){
    setTimeout(() => ls.classList.add('hide'), 500);
  }
});

// ---- Button ripple effect ----
document.addEventListener('click', function(e){
  const btn = e.target.closest('.ripple');
  if(!btn) return;
  const rect = btn.getBoundingClientRect();
  const circle = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = size + 'px';
  circle.style.left = (e.clientX - rect.left - size/2) + 'px';
  circle.style.top = (e.clientY - rect.top - size/2) + 'px';
  circle.classList.add('ripple-effect');
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
});

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
if(revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      }
    });
  }, { threshold: .15 });
  revealEls.forEach(el => io.observe(el));
}

// ---- Toast notifications ----
function showToast(message, icon = 'fa-circle-check'){
  let toast = document.getElementById('globalToast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-r';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}
window.showToast = showToast;

// ---- Smooth scroll for in-page anchors ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
});

// ---- Reading progress bar (article page) ----
const progressBar = document.querySelector('.reading-progress');
if(progressBar){
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// ---- Bookmark toggle (localStorage-free, session only) ----
document.querySelectorAll('.bookmark-btn').forEach(btn => {
  btn.addEventListener('click', function(){
    this.classList.toggle('active');
    const icon = this.querySelector('i');
    const isActive = this.classList.contains('active');
    icon.classList.toggle('fa-solid', isActive);
    icon.classList.toggle('fa-regular', !isActive);
    showToast(isActive ? 'Saved to bookmarks' : 'Removed from bookmarks', 'fa-bookmark');
  });
});

// ---- Password visibility toggle ----
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', function(){
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');
    if(input.type === 'password'){
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// ---- Generic toggle switch (.toggle-r) ----
document.querySelectorAll('.toggle-r').forEach(t => {
  t.addEventListener('click', function(){
    this.classList.toggle('on');
    if(this.dataset.label){
      showToast(`${this.dataset.label} ${this.classList.contains('on') ? 'enabled' : 'disabled'}`, 'fa-toggle-on');
    }
    if(this.id === 'darkModeToggle'){
      document.documentElement.classList.toggle('dark-mode', this.classList.contains('on'));
    }
  });
});

// ---- Filter chips (single-select within group) ----
document.querySelectorAll('.filter-chip-group').forEach(group => {
  group.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
});

// ---- Star rating (feedback page) ----
document.querySelectorAll('.star-rate-group').forEach(group => {
  const stars = group.querySelectorAll('.star-rate');
  stars.forEach((star, idx) => {
    star.addEventListener('click', () => {
      stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
      group.dataset.value = idx + 1;
    });
  });
});

// ---- Simple form validation feedback (no real submission) ----
document.querySelectorAll('form[data-mock-submit]').forEach(form => {
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const msg = this.dataset.mockSubmit || 'Submitted successfully';
    showToast(msg, 'fa-circle-check');
    if(this.dataset.redirect){
      setTimeout(() => window.location.href = this.dataset.redirect, 900);
    }
  });
});

// ---- Search bar live filter (data-filter-target) ----
document.querySelectorAll('[data-search-input]').forEach(input => {
  input.addEventListener('input', function(){
    const targetSelector = this.dataset.searchInput;
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll(targetSelector).forEach(item => {
      const text = item.innerText.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });
});
