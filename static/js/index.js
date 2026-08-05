document.addEventListener('DOMContentLoaded', function() {
  // ===== Аккордеон FAQ =====
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const group = this.closest('.faq-group');
      if (group) {
        group.classList.toggle('active');
      }
    });
  });

  // ===== Плавный скролл к якорям =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ===== Анимация появления секций =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    observer.observe(aboutSection);
  }

  // ===== Авто-скролл от hero к about =====
  let autoScrollExecuted = false;
  let scrollBlocked = false;

  function blockScroll() {
    if (scrollBlocked) return;
    scrollBlocked = true;
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    window.__scrollBlockers = { preventScroll };
  }

  function unblockScroll() {
    if (!scrollBlocked) return;
    scrollBlocked = false;
    if (window.__scrollBlockers) {
      document.removeEventListener('wheel', window.__scrollBlockers.preventScroll);
      document.removeEventListener('touchmove', window.__scrollBlockers.preventScroll);
      delete window.__scrollBlockers;
    }
  }

  function performAutoScroll() {
    if (autoScrollExecuted) return;
    autoScrollExecuted = true;
    const about = document.querySelector('.about');
    if (!about) return;
    const aboutTop = about.getBoundingClientRect().top + window.pageYOffset;
    const currentScroll = window.pageYOffset;
    if (currentScroll >= aboutTop - 100) {
      return;
    }
    blockScroll();
    about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      unblockScroll();
    }, 2000);
  }

  function firstScrollHandler(e) {
    if (autoScrollExecuted || scrollBlocked) return;
    window.removeEventListener('wheel', firstScrollHandler);
    window.removeEventListener('touchmove', firstScrollHandler);
    performAutoScroll();
  }
  window.addEventListener('wheel', firstScrollHandler, { passive: true });
  window.addEventListener('touchmove', firstScrollHandler, { passive: true });

  // ===== Фиксированный header: динамический отступ =====
  const header = document.querySelector('.header');
  if (header) {
    const updateHeaderOffset = () => {
      const height = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', height + 'px');
    };
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);
  }

  // ===== Смена цвета header при прокрутке hero =====
  const hero = document.querySelector('.hero');
  if (hero && header) {
    const observerHero = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      });
    }, { threshold: 0, rootMargin: '-1px 0px 0px 0px' });
    observerHero.observe(hero);
  }

  // ===== Анимация лапки с использованием currentColor =====
  const pawIcon = document.querySelector('.paw-icon');
  if (pawIcon) {
    const staticSvg = `<svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2316_2651)">
        <path d="M16 6.47324C16 4.13333 17.318 0 19.5268 0C21.7357 0 24 3.97295 24 6.47324C24 8.97354 22.2093 11 20 11C17.7907 11 16 8.97311 16 6.47324Z" fill="currentColor"/>
        <path d="M24.4429 27.1753C23.3884 27.9823 22.0624 28.1293 20.8283 27.9042C19.5942 27.6791 18.4232 27.1131 17.2567 26.5768C17.2493 26.5734 17.2419 26.5701 17.2346 26.5668C15.8139 25.9147 14.1861 25.9147 12.7654 26.5668C12.7577 26.5701 12.7503 26.5734 12.7429 26.5772C11.5764 27.1135 10.4054 27.6795 9.1713 27.9046C7.93717 28.1297 6.61079 27.9831 5.55665 27.1757C4.50211 26.3688 3.79484 24.8074 4.05356 23.3317C4.29177 21.9751 5.24423 20.9768 6.22251 20.2517C7.20079 19.5266 8.28035 18.9468 9.07126 17.9419C9.88677 16.9056 10.3144 15.518 10.9905 14.3443C11.0004 14.3267 11.0106 14.3092 11.0213 14.2912C12.8175 11.2363 17.1829 11.2363 18.9787 14.2912C18.989 14.3092 18.9992 14.3267 19.0095 14.3443C19.6856 15.518 20.1132 16.9056 20.9287 17.9419C21.7197 18.9468 22.7992 19.5266 23.7775 20.2517C24.7558 20.9768 25.7082 21.9751 25.9464 23.3317C26.2052 24.8074 25.4979 26.3688 24.4433 27.1757L24.4429 27.1753Z" fill="currentColor"/>
        <path d="M4.9274 17.7822C3.17059 18.4739 1.11714 17.4637 0.340609 15.5258C-0.43592 13.5879 0.130159 9.79961 1.88697 9.10789C3.64379 8.41617 5.97547 11.2071 6.70221 13.021C7.47874 14.9589 6.68422 17.0904 4.92782 17.7822H4.9274Z" fill="currentColor"/>
        <path d="M6.00042 6.47324C6.00042 3.97295 8.26427 0 10.4732 0C12.682 0 14 4.13333 14 6.47324C14 8.97311 12.2093 11 10 11C7.7907 11 6 8.97311 6 6.47324H6.00042Z" fill="currentColor"/>
        <path d="M29.659 15.5258C28.8825 17.4637 26.8287 18.4739 25.0723 17.7822C23.3156 17.0904 22.5211 14.9589 23.298 13.021C24.0247 11.2075 26.3563 8.41616 28.1131 9.10788C29.8698 9.7996 30.4359 13.5879 29.6594 15.5258H29.659Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_2316_2651"><rect width="30" height="28" fill="white"/></clipPath>
      </defs>
    </svg>`;

    const hoverSvg = `<svg width="30" height="23" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2316_2645)">
        <path d="M16 5.31731C16 3.39524 17.318 0 19.5268 0C21.7357 0 24 3.2635 24 5.31731C24 7.37112 22.2093 9.03571 20 9.03571C17.7907 9.03571 16 7.37077 16 5.31731Z" fill="currentColor"/>
        <path d="M24.4429 22.3226C23.3884 22.9855 22.0624 23.1063 20.8283 22.9213C19.5942 22.7364 18.4232 22.2715 17.2567 21.831C17.2493 21.8282 17.2419 21.8255 17.2346 21.8227C15.8139 21.2871 14.1861 21.2871 12.7654 21.8227C12.7577 21.8255 12.7503 21.8282 12.7429 21.8313C11.5764 22.2718 10.4054 22.7367 9.1713 22.9217C7.93717 23.1066 6.61079 22.9862 5.55665 22.323C4.50211 21.6601 3.79484 20.3776 4.05356 19.1654C4.29177 18.051 5.24423 17.231 6.22251 16.6353C7.20079 16.0397 8.28035 15.5635 9.07126 14.738C9.88677 13.8868 10.3144 12.747 10.9905 11.7828C11.0004 11.7684 11.0106 11.754 11.0213 11.7393C12.8175 9.22981 17.1829 9.22981 18.9787 11.7393C18.989 11.754 18.9992 11.7684 19.0095 11.7828C19.6856 12.747 20.1132 13.8868 20.9287 14.738C21.7197 15.5635 22.7992 16.0397 23.7775 16.6353C24.7558 17.231 25.7082 18.051 25.9464 19.1654C26.2052 20.3776 25.4979 21.6601 24.4433 22.323L24.4429 22.3226Z" fill="currentColor"/>
        <path d="M4.9274 14.6067C3.17059 15.1749 1.11714 14.3451 0.340609 12.7533C-0.43592 11.1614 0.130159 8.04964 1.88697 7.48144C3.64379 6.91325 5.97547 9.20579 6.70221 10.6958C7.47874 12.2876 6.68422 14.0385 4.92782 14.6067H4.9274Z" fill="currentColor"/>
        <path d="M6.00042 5.31731C6.00042 3.2635 8.26427 0 10.4732 0C12.682 0 14 3.39524 14 5.31731C14 7.37077 12.2093 9.03571 10 9.03571C7.7907 9.03571 6 7.37077 6 5.31731H6.00042Z" fill="currentColor"/>
        <path d="M29.659 12.7533C28.8825 14.3451 26.8287 15.1749 25.0723 14.6067C23.3156 14.0385 22.5211 12.2876 23.298 10.6958C24.0247 9.20613 26.3563 6.91324 28.1131 7.48143C29.8698 8.04963 30.4359 11.1614 29.6594 12.7533H29.659Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_2316_2645"><rect width="30" height="23" fill="white"/></clipPath>
      </defs>
    </svg>`;

    pawIcon.innerHTML = staticSvg;
    pawIcon.addEventListener('mouseenter', () => {
      pawIcon.innerHTML = hoverSvg;
    });
    pawIcon.addEventListener('mouseleave', () => {
      pawIcon.innerHTML = staticSvg;
    });
  }
});