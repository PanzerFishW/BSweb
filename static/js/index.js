// ============================================================
// Лучший сезон — глэмпинг: Основной JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('Лучший сезон — страница загружена');

  // ==========================================================
  // 1. FAQ АККОРДЕОН
  // ==========================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', function() {
      // Toggle active class
      this.classList.toggle('faq-active');
      
      // Find or create answer panel
      let answer = this.querySelector('.faq-answer');
      if (!answer) {
        answer = document.createElement('div');
        answer.className = 'faq-answer';
        // Add sample answers based on the question
        const question = this.querySelector('span')?.textContent || '';
        const answers = {
          'Как добраться до глэмпинга?': 'Глэмпинг расположен в Тульской области, в 3 км от усадьбы Поленово. Мы вышлем точные координаты и подробную инструкцию после бронирования. До места можно добраться на автомобиле по трассе М-2 «Крым» (около 2 часов от Москвы).',
          'Какие условия бронирования и отмены?': 'При бронировании взимается предоплата 50%. Полный возврат при отмене за 14 дней до заезда, 50% — за 7 дней. При отмене менее чем за 7 дней предоплата не возвращается.',
          'Есть ли завтраки?': 'Да, мы предлагаем завтраки из свежих фермерских продуктов. В стоимость проживания включён базовый завтрак. Также можно заказать расширенный завтрак или корзину для пикника.',
          'Можно ли кормить животных глэмпинга?': 'Да! У нас есть контактная ферма с козами, курами и кроликами. Можно покормить животных специальным кормом, который мы предоставляем. Приходите в утренние или вечерние часы.',
          'Можно ли с животными?': 'Да, мы принимаем гостей с домашними питомцами. Доплата за питомца составляет 1 000 ₽ за весь период проживания. Пожалуйста, укажите питомца при бронировании.',
          'Можно ли арендовать домик на месяц или больше?': 'Да, для длительного проживания действуют специальные условия. При бронировании от 7 ночей — скидка 20%, от 14 ночей — 30%. Свяжитесь с нами для обсуждения индивидуальных условий.',
        };
        const answerText = answers[question] || 'Пожалуйста, свяжитесь с нами для получения подробной информации: +7 (991) 255-08-37';
        answer.textContent = answerText;
        this.appendChild(answer);
      } else {
        answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
      }
    });
  });

  // Add CSS for FAQ answers dynamically
  const style = document.createElement('style');
  style.textContent = `
    .faq-item {
      flex-direction: column;
      align-items: stretch !important;
      padding: 0 !important;
      border-radius: 10px !important;
      overflow: hidden;
    }
    .faq-item > span {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      padding: 12px 32px;
      width: 100%;
    }
    .faq-item > .arrow {
      flex-shrink: 0;
    }
    .faq-answer {
      padding: 0 32px 16px 32px;
      font-size: 18px;
      font-weight: 400;
      line-height: 1.5;
      color: rgba(255,255,255,0.9);
      border-top: 1px solid rgba(255,255,255,0.2);
      margin-top: 0;
      display: none;
    }
    .faq-item.faq-active .faq-answer {
      display: block;
    }
    .faq-item.faq-active .arrow {
      transform: rotate(180deg);
    }
    .faq-item .arrow {
      transition: transform 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  // ==========================================================
  // 2. ХЕРО-ФОРМА: ИНТЕРАКТИВНЫЕ ПОЛЯ
  // ==========================================================
  const heroForm = document.querySelector('.hero-form');
  if (heroForm) {
    // Replace static div fields with actual inputs
    const fields = heroForm.querySelectorAll('.field');
    if (fields.length >= 3) {
      // Date input check-in
      const checkinField = fields[0];
      const checkinLabel = checkinField.querySelector('span');
      checkinField.innerHTML = `
        <svg viewBox="0 0 16 18"><rect x="1" y="2" width="14" height="14" rx="2" stroke="white" fill="none"/><path d="M1 6h14" stroke="white"/></svg>
        <input type="date" class="hero-date-input" value="" placeholder="Дата въезда" style="background: transparent; border: none; color: white; font-size: 16px; font-family: 'Montserrat', sans-serif; outline: none; width: 100%;" />
      `;
      const dateInput = checkinField.querySelector('input');
      if (dateInput) {
        // Set min date to today
        const today = new Date();
        dateInput.min = today.toISOString().split('T')[0];
      }

      // Date input check-out
      const checkoutField = fields[1];
      checkoutField.innerHTML = `
        <svg viewBox="0 0 16 18"><rect x="1" y="2" width="14" height="14" rx="2" stroke="white" fill="none"/><path d="M1 6h14" stroke="white"/></svg>
        <input type="date" class="hero-date-input" value="" placeholder="Дата выезда" style="background: transparent; border: none; color: white; font-size: 16px; font-family: 'Montserrat', sans-serif; outline: none; width: 100%;" />
      `;

      // Guest count field
      const guestField = fields[2];
      guestField.innerHTML = `
        <svg viewBox="0 0 12 16"><rect x="1" y="1" width="10" height="14" rx="1" stroke="white" fill="none"/><circle cx="6" cy="6" r="2.5" stroke="white" fill="none"/></svg>
        <select class="hero-guest-select" style="background: transparent; border: none; color: white; font-size: 16px; font-family: 'Montserrat', sans-serif; outline: none; width: 100%; cursor: pointer;">
          <option value="1" style="color: #494949;">1 гость</option>
          <option value="2" style="color: #494949;" selected>2 гостя</option>
          <option value="3" style="color: #494949;">3 гостя</option>
          <option value="4" style="color: #494949;">4 гостя</option>
          <option value="5" style="color: #494949;">5 гостей</option>
          <option value="6" style="color: #494949;">6 гостей</option>
          <option value="7" style="color: #494949;">7 гостей</option>
          <option value="8" style="color: #494949;">8 гостей</option>
        </select>
      `;
    }

    // Make the booking button actually work
    const bookingBtn = heroForm.querySelector('.btn-light');
    if (bookingBtn) {
      bookingBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const checkin = heroForm.querySelectorAll('.hero-date-input')[0]?.value || 'не указана';
        const checkout = heroForm.querySelectorAll('.hero-date-input')[1]?.value || 'не указана';
        const guests = heroForm.querySelector('.hero-guest-select')?.value || '1';
        
        let message = 'Заявка на бронирование:\n';
        message += `Дата заезда: ${checkin}\n`;
        message += `Дата выезда: ${checkout}\n`;
        message += `Гостей: ${guests}\n`;
        message += `\nСпасибо! Мы свяжемся с вами для подтверждения.`;
        
        alert(message);
      });
    }
  }

  // ==========================================================
  // 3. ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
  // ==========================================================
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

  // ==========================================================
  // 4. КНОПКИ "ЗАБРОНИРОВАТЬ": ОБЩАЯ ОБРАБОТКА
  // ==========================================================
  document.querySelectorAll('.btn-book, .btn-book-card, .btn-primary, .btn-gold, .btn-confirm-booking').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Only handle if it's not inside a modal (modal has its own handler)
      if (!this.closest('.modal-content')) {
        e.preventDefault();
        const houseName = this.closest('.house-card')?.querySelector('h3')?.textContent || 
                          this.closest('.card')?.querySelector('h3')?.textContent || '';
        let message = 'Заявка на бронирование';
        if (houseName) {
          message += `: ${houseName}`;
        }
        message += '\n\nСпасибо! Мы свяжемся с вами для подтверждения.';
        alert(message);
      }
    });
  });
});
