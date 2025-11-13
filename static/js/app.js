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

// ====================== Dropdown меню ======================
// Функция для закрытия всех выпадающих меню
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    dropdownBtns.forEach(btn => {
        btn.classList.remove('active');
    });
}

// Отображение основного меню навигации
const dropdownBtn = document.getElementById('dropdownBtn');
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dropdownContent = document.getElementById('dropdownContent');
        const isShowing = dropdownContent && dropdownContent.classList.contains('show');

        // Закрываем все другие меню
        closeAllDropdowns();

        // Открываем/закрываем текущее меню
        if (!isShowing && dropdownContent) {
            dropdownContent.classList.add('show');
            this.classList.add('active');
        }
    });
}

// Отображение меню вариантов
const variantsBtn = document.getElementById('variantsBtn');
if (variantsBtn) {
    variantsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const variantsContent = document.getElementById('variantsContent');
        const isShowing = variantsContent && variantsContent.classList.contains('show');

        // Закрываем все другие меню
        closeAllDropdowns();

        // Открываем/закрываем текущее меню
        if (!isShowing && variantsContent) {
            variantsContent.classList.add('show');
            this.classList.add('active');
        }
    });
}

// Скрытие меню при клике вне области
document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-content')) {
        closeAllDropdowns();
    }
});

// Закрытие меню при нажатии Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeAllDropdowns();
    }
});

// Закрытие меню при изменении размера окна
window.addEventListener('resize', function () {
    closeAllDropdowns();
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
