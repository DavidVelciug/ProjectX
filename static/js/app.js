// Управление цветовой темой интерфейса
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Сохраненные предпочтения темы или системные настройки
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Применение сохраненной или системной темы
if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Переключение между темами
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Переменные для управления меню
let isDropdownOpen = false;
let isVariantsOpen = false;

// Функция для закрытия всех меню
function closeAllMenus() {
    const dropdownContent = document.getElementById('dropdownContent');
    const variantsContent = document.getElementById('variantsContent');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const variantsBtn = document.getElementById('variantsBtn');

    dropdownContent.classList.remove('show');
    variantsContent.classList.remove('show');

    dropdownBtn.classList.remove('menu-open');
    variantsBtn.classList.remove('menu-open');

    isDropdownOpen = false;
    isVariantsOpen = false;
}

// Отображение основного меню с улучшенной логикой
document.getElementById('dropdownBtn').addEventListener('click', function (e) {
    e.stopPropagation();

    const dropdownContent = document.getElementById('dropdownContent');
    const variantsContent = document.getElementById('variantsContent');
    const dropdownBtn = this;
    const variantsBtn = document.getElementById('variantsBtn');

    // Закрываем меню вариантов если оно открыто
    if (isVariantsOpen) {
        variantsContent.classList.remove('show');
        variantsBtn.classList.remove('menu-open');
        isVariantsOpen = false;
    }

    // Переключаем основное меню
    if (isDropdownOpen) {
        dropdownContent.classList.remove('show');
        dropdownBtn.classList.remove('menu-open');
        isDropdownOpen = false;
    } else {
        dropdownContent.classList.add('show');
        dropdownBtn.classList.add('menu-open');
        isDropdownOpen = true;
    }
});

// Отображение меню вариантов с улучшенной логикой
document.getElementById('variantsBtn').addEventListener('click', function (e) {
    e.stopPropagation();

    const dropdownContent = document.getElementById('dropdownContent');
    const variantsContent = document.getElementById('variantsContent');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const variantsBtn = this;

    // Закрываем основное меню если оно открыто
    if (isDropdownOpen) {
        dropdownContent.classList.remove('show');
        dropdownBtn.classList.remove('menu-open');
        isDropdownOpen = false;
    }

    // Переключаем меню вариантов
    if (isVariantsOpen) {
        variantsContent.classList.remove('show');
        variantsBtn.classList.remove('menu-open');
        isVariantsOpen = false;
    } else {
        variantsContent.classList.add('show');
        variantsBtn.classList.add('menu-open');
        isVariantsOpen = true;
    }
});

// Скрытие меню при клике вне области с улучшенной логикой
document.addEventListener('click', function (event) {
    const dropdownBtn = document.getElementById('dropdownBtn');
    const variantsBtn = document.getElementById('variantsBtn');
    const dropdownContent = document.getElementById('dropdownContent');
    const variantsContent = document.getElementById('variantsContent');

    // Проверяем, был ли клик вне кнопок меню
    const isClickInsideDropdown = dropdownBtn.contains(event.target) || dropdownContent.contains(event.target);
    const isClickInsideVariants = variantsBtn.contains(event.target) || variantsContent.contains(event.target);

    if (!isClickInsideDropdown && !isClickInsideVariants) {
        closeAllMenus();
    }
});

// Закрытие меню при нажатии Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeAllMenus();
    }
});

// Закрытие меню при изменении размера окна
window.addEventListener('resize', function () {
    closeAllMenus();
});

// Управление модальными окнами
document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', function () {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Закрытие модальных окон
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
        const modal = this.closest('.modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Закрытие модального окна при клике вне его области
window.addEventListener('click', function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Закрытие модального окна при нажатии Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Анимация при наведении на карточки
document.querySelectorAll('.interface-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.animation = 'pulseGlow 2s infinite';
    });

    card.addEventListener('mouseleave', function () {
        this.style.animation = '';
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.querySelectorAll('.interface-card').forEach(card => {
    observer.observe(card);
});

// Добавляем небольшую задержку для стабильности работы меню
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        // Инициализация завершена
        console.log('Система инициализирована');
    }, 100);
});
