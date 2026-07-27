document.addEventListener('DOMContentLoaded', function () {

  // --- Данные домиков ---
  const housesData = {
    1: {
      name: 'Первый домик',
      price: 8000,
      img: 'static/images/houses/house-1.jpg',
      description: 'Уютный домик‑лофт с собственной сауной и панорамным видом на лес для 2-4 гостей. Идеальное место для семейного отдыха или романтических выходных. Площадь дома 30м² + терраса 24м². Безлимитный Wi‑Fi, оснащенная кухня, отдельная мангальная зона и ротанговая мебель.'
    },
    2: {
      name: 'Второй домик',
      price: 6000,
      img: 'static/images/houses/house-2.png',
      description: 'Домик с камином и уютной атмосферой. 4 спальных места, идеально для компании друзей или семьи.'
    },
    3: {
      name: 'Третий домик',
      price: 6000,
      img: 'static/images/houses/house-3.png',
      description: 'Просторный дом с панорамными окнами и камином. Разместит до 4 гостей.'
    },
    4: {
      name: 'Четвертый домик',
      price: 6000,
      img: 'static/images/houses/house-4.png',
      description: 'Уединённый домик на краю леса с камином и террасой. Идеален для спокойного отдыха.'
    }
  };

  // --- Элементы модального окна ---
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const titleEl = document.getElementById('modalTitle');
  const imgMainEl = document.getElementById('galleryMain');
  const descEl = document.getElementById('modalDescription');
  const priceEl = document.getElementById('modalPrice');

  const checkInDisplay = document.getElementById('checkInDisplay');
  const checkOutDisplay = document.getElementById('checkOutDisplay');

  const adultsCount = document.getElementById('adultsCount');
  const childrenCount = document.getElementById('childrenCount');
  const petsCount = document.getElementById('petsCount');

  const calendar1 = document.getElementById('calendar1');
  const calendar2 = document.getElementById('calendar2');

  const nightsSpan = document.querySelector('.total-price .details span:first-child');
  const guestsSpan = document.querySelector('.total-price .details span:last-child');
  const confirmBtn = document.getElementById('confirmBookingBtn');

  // Кнопки навигации календаря
  const navLeft = document.querySelector('.calendar-nav-btn.prev');
  const navRight = document.querySelector('.calendar-nav-btn.next');

  // --- Состояние ---
  let currentHouseId = null;
  let currentPricePerNight = 0;
  let selectedDates = { checkIn: null, checkOut: null };
  let nights = 0;
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  // --- Генерация календаря ---
  function generateCalendar(container, year, month) {
    if (!container) return;
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    container.innerHTML = '';

    // Заголовок (чистый текст без стрелок)
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = `${months[month]} ${year}`;
    container.appendChild(header);

    // Сетка дней недели
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    daysOfWeek.forEach(day => {
      const dayName = document.createElement('div');
      dayName.className = 'calendar-day-name';
      dayName.textContent = day;
      grid.appendChild(dayName);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const offset = (firstDay === 0) ? 6 : firstDay - 1;

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day muted';
      grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = d;
      const date = new Date(year, month, d);
      dayEl.dataset.date = date.toISOString().split('T')[0];
      grid.appendChild(dayEl);
    }

    container.appendChild(grid);
  }

  // --- Отрисовка двух календарей ---
  function renderCalendars() {
    generateCalendar(calendar1, currentYear, currentMonth);
    generateCalendar(calendar2, currentYear, currentMonth + 1);
    attachDateListeners();
    applySelection();
    markToday();
  }

  // --- Навигация по стрелкам ---
  navLeft.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendars();
  });

  navRight.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendars();
  });

  // --- События кликов на даты ---
  function attachDateListeners() {
    document.querySelectorAll('.calendar-day:not(.muted)').forEach(day => {
      day.removeEventListener('click', dateClickHandler);
      day.addEventListener('click', dateClickHandler);
    });
  }

  function dateClickHandler(e) {
    const dayEl = e.currentTarget;
    const dateStr = dayEl.dataset.date;
    if (!dateStr) return;
    const date = new Date(dateStr + 'T00:00:00');

    if (!selectedDates.checkIn) {
      selectedDates.checkIn = date;
      clearSelection();
      dayEl.classList.add('active');
    } else if (!selectedDates.checkOut) {
      if (date > selectedDates.checkIn) {
        selectedDates.checkOut = date;
        highlightRange(selectedDates.checkIn, selectedDates.checkOut);
      } else {
        selectedDates.checkIn = date;
        selectedDates.checkOut = null;
        clearSelection();
        dayEl.classList.add('active');
      }
    } else {
      selectedDates.checkIn = date;
      selectedDates.checkOut = null;
      clearSelection();
      dayEl.classList.add('active');
    }

    updateSummary();
    updateDateDisplay();
  }

  // --- Выделение ---
  function clearSelection() {
    document.querySelectorAll('.calendar-day.active, .calendar-day.range').forEach(el => {
      el.classList.remove('active', 'range');
    });
  }

  function highlightRange(start, end) {
    const dayElements = document.querySelectorAll('.calendar-day:not(.muted)');
    dayElements.forEach(el => {
      const d = new Date(el.dataset.date + 'T00:00:00');
      if (d.getTime() === start.getTime() || d.getTime() === end.getTime()) {
        el.classList.add('active'); // Круг
      } else if (d > start && d < end) {
        el.classList.add('range'); // Прямоугольник
      }
    });
  }

  function applySelection() {
    if (selectedDates.checkIn) {
      const startEl = findDayElement(selectedDates.checkIn);
      if (startEl) startEl.classList.add('active');
    }
    if (selectedDates.checkOut) {
      const endEl = findDayElement(selectedDates.checkOut);
      if (endEl) endEl.classList.add('active');
      if (selectedDates.checkIn && selectedDates.checkOut) {
        highlightRange(selectedDates.checkIn, selectedDates.checkOut);
      }
    }
  }

  // --- Красная точка "Сегодня" ---
  function markToday() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dateStr = today.toISOString().split('T')[0];
    const el = document.querySelector(`.calendar-day[data-date="${dateStr}"]`);
    if (el) {
      el.classList.add('today');
    }
  }

  function findDayElement(date) {
    const dateStr = date.toISOString().split('T')[0];
    return document.querySelector(`.calendar-day[data-date="${dateStr}"]`);
  }

  // --- Обновление UI ---
  function updateDateDisplay() {
    if (selectedDates.checkIn) {
      const d = selectedDates.checkIn;
      checkInDisplay.textContent = formatDate(d);
    } else {
      checkInDisplay.textContent = '--.--.----';
    }
    if (selectedDates.checkOut) {
      const d = selectedDates.checkOut;
      checkOutDisplay.textContent = formatDate(d);
    } else {
      checkOutDisplay.textContent = '--.--.----';
    }
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function updateSummary() {
    const adults = parseInt(adultsCount.textContent) || 0;
    const children = parseInt(childrenCount.textContent) || 0;
    const pets = parseInt(petsCount.textContent) || 0;
    const totalGuests = adults + children + pets;

    nights = 0;
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const diff = Math.abs(selectedDates.checkOut - selectedDates.checkIn);
      nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    let totalPrice = 0;
    if (nights > 0) {
      totalPrice = currentPricePerNight * nights;
    }

    nightsSpan.textContent = nights > 0 ? `🕒 ${nights} ночи` : '🕒 0 ночей';
    guestsSpan.textContent = totalGuests > 0 ? `👤 ${totalGuests} гость${totalGuests > 1 ? 'я' : ''}` : '👤 0 гостей';
    priceEl.textContent = totalPrice > 0 ? `${totalPrice.toLocaleString()} ₽` : '0 ₽';
  }

  // --- Сброс и открытие ---
  function resetBookingState() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDates.checkIn = today;
    selectedDates.checkOut = null;
    nights = 0;

    adultsCount.textContent = '0';
    childrenCount.textContent = '0';
    petsCount.textContent = '0';

    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();

    clearSelection();
    renderCalendars();
    updateDateDisplay();
    updateSummary();
  }

  function openModal(houseId) {
    const data = housesData[houseId];
    if (!data) return;

    currentHouseId = houseId;
    currentPricePerNight = data.price;

    titleEl.textContent = data.name;
    imgMainEl.style.backgroundImage = `url('${data.img}')`;
    descEl.textContent = data.description;

    resetBookingState();

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // --- Кнопки открытия ---
  document.querySelectorAll('.btn-book-house').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.house-card');
      if (card && card.dataset.houseId) {
        openModal(parseInt(card.dataset.houseId));
      } else {
        openModal(1);
      }
    });
  });

  document.querySelectorAll('.btn-book-header, .footer .btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(1);
    });
  });

  document.querySelector('.search-btn').addEventListener('click', function (e) {
    e.preventDefault();
    openModal(1);
  });

  // --- Счётчики гостей ---
  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const action = this.dataset.action;
      const span = document.getElementById(targetId + 'Count');
      let val = parseInt(span.textContent) || 0;
      if (action === 'plus') val++;
      else if (action === 'minus' && val > 0) val--;
      span.textContent = val;
      updateSummary();
    });
  });

  // --- Подтверждение брони ---
  confirmBtn.addEventListener('click', function () {
    const adults = adultsCount.textContent;
    const children = childrenCount.textContent;
    const pets = petsCount.textContent;
    const house = titleEl.textContent;
    const total = priceEl.textContent;

    alert(`Бронирование:\nДомик: ${house}\nНочей: ${nights}\nВзрослые: ${adults}\nДети: ${children}\nПитомцы: ${pets}\nИтого: ${total}`);
    closeModal();
  });

});