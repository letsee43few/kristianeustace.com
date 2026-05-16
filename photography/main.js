/* ============================================================
   KRISTIAN EUSTACE PHOTOGRAPHY — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV scroll state ── */
  const nav = document.getElementById('nav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ── */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');

  function closeMenu() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    const isOpen = !menu.classList.contains('open');
    toggle.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── LIGHTBOX ── */
  var galleryImgs = Array.from(document.querySelectorAll('.photo-item img'));

  if (galleryImgs.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&#8592;</button>' +
      '<div class="lightbox-img-wrap"><img class="lightbox-img" src="" alt=""></div>' +
      '<button class="lightbox-next" aria-label="Next">&#8594;</button>' +
      '<p class="lightbox-counter"></p>';
    document.body.appendChild(lb);

    var lbImg     = lb.querySelector('.lightbox-img');
    var lbCounter = lb.querySelector('.lightbox-counter');
    var current   = 0;

    function openLightbox(index) {
      current = index;
      lbImg.src = galleryImgs[current].src;
      lbImg.alt = galleryImgs[current].alt;
      lbCounter.textContent = (current + 1) + ' / ' + galleryImgs.length;
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    function showNext() {
      current = (current + 1) % galleryImgs.length;
      lbImg.src = galleryImgs[current].src;
      lbCounter.textContent = (current + 1) + ' / ' + galleryImgs.length;
    }

    function showPrev() {
      current = (current - 1 + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[current].src;
      lbCounter.textContent = (current + 1) + ' / ' + galleryImgs.length;
    }

    galleryImgs.forEach(function (img, i) {
      img.parentElement.addEventListener('click', function () { openLightbox(i); });
    });

    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); showNext(); });
    lb.querySelector('.lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); showPrev(); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === lb.querySelector('.lightbox-img-wrap')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft')  showPrev();
    });
  }

  /* ── FADE-IN via IntersectionObserver ── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

})();
