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

// Отображение основного меню
document.getElementById('dropdownBtn').addEventListener('click', function () {
    document.getElementById('dropdownContent').classList.toggle('show');
});

// Отображение меню вариантов
document.getElementById('variantsBtn').addEventListener('click', function () {
    document.getElementById('variantsContent').classList.toggle('show');
});

// Отображение боковой панели на мобильных устройствах
document.getElementById('menuToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('show');
});

// Скрытие меню при клике вне области
window.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn')) {
        const dropdown = document.getElementById('dropdownContent');
        const variantsDropdown = document.getElementById('variantsContent');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
        if (variantsDropdown.classList.contains('show')) {
            variantsDropdown.classList.remove('show');
        }
    }
});

// Отображение контента при выборе пункта меню
document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // Скрытие всех разделов контента
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Отображение выбранного раздела
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.remove('hidden');

        // Прокрутка к началу контента
        window.scrollTo(0, 0);

        // Скрытие боковой панели на мобильных устройствах после выбора
        if (window.innerWidth < 992) {
            document.getElementById('sidebar').classList.remove('show');
        }
    });
});