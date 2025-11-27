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

// Управление музыкой
const musicToggle = document.getElementById('musicToggle');
const youtubePlayer = document.getElementById('youtubePlayer');
const closePlayer = document.getElementById('closePlayer');
let isMusicPlaying = false;

// Переключение музыки
musicToggle.addEventListener('click', () => {
    isMusicPlaying = !isMusicPlaying;
    
    if (isMusicPlaying) {
        youtubePlayer.classList.remove('hidden');
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        youtubePlayer.classList.add('hidden');
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    }
});

// Закрытие плеера
closePlayer.addEventListener('click', () => {
    youtubePlayer.classList.add('hidden');
    musicToggle.classList.remove('playing');
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    isMusicPlaying = false;
});

// Отображение основного меню
document.getElementById('dropdownBtn').addEventListener('click', function () {
    document.getElementById('dropdownContent').classList.toggle('show');
});

// Отображение боковой панели на мобильных устройствах
document.getElementById('menuToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('show');
});

// Скрытие меню при клике вне области
window.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn')) {
        const dropdown = document.getElementById('dropdownContent');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
});

// Хранилище для навигации по темам
const sectionNavigation = {
    // Разделы и их порядок
    sections: [
        'welcome-section',
        'ml-section', 'section1-1', 'section1-2', 'section1-3', 'section1-4',
        'section2-1', 'section2-2', 'section2-3', 'section2-4', 'section2-5',
        'section3-1', 'section3-2', 'section3-3'
    ],
    
    // Получить индекс текущего раздела
    getCurrentIndex: function() {
        const currentSection = document.querySelector('.content-section:not(.hidden)');
        return currentSection ? this.sections.indexOf(currentSection.id) : -1;
    },
    
    // Перейти к следующему разделу
    nextSection: function() {
        const currentIndex = this.getCurrentIndex();
        if (currentIndex < this.sections.length - 1) {
            this.showSection(this.sections[currentIndex + 1]);
        }
    },
    
    // Перейти к предыдущему разделу
    prevSection: function() {
        const currentIndex = this.getCurrentIndex();
        if (currentIndex > 0) {
            this.showSection(this.sections[currentIndex - 1]);
        }
    },
    
    // Показать конкретный раздел
    showSection: function(sectionId) {
        // Скрыть все разделы
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Показать целевой раздел
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            window.scrollTo(0, 0);
            
            // Обновить активный пункт в сайдбаре
            this.updateActiveSidebarItem(sectionId);
            
            // Инициализировать навигацию раздела
            initSectionNavigation(sectionId);
        }
    },
    
    // Обновить активный пункт в сайдбаре
    updateActiveSidebarItem: function(sectionId) {
        // Убрать активный класс со всех пунктов
        document.querySelectorAll('.submenu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Добавить активный класс к текущему пункту
        const activeItem = document.querySelector(`[data-target="${sectionId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            
            // Прокрутить к активному элементу
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
};

// Отображение контента при выборе пункта меню
document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('data-target');
        sectionNavigation.showSection(targetId);

        // Скрытие боковой панели на мобильных устройствах после выбора
        if (window.innerWidth < 992) {
            document.getElementById('sidebar').classList.remove('show');
        }
    });
});

// Функция инициализации навигации для всех разделов
function initSectionNavigation(sectionId) {
    // Сброс всех навигаций к первой странице
    const sections = {
        'ml-section': { current: 1, total: 3, prefix: 'ml' },
        'section1-1': { current: 1, total: 3, prefix: 'history' },
        'section1-2': { current: 1, total: 3, prefix: 'paradigm' },
        'section2-1': { current: 1, total: 3, prefix: 'perceptron' },
        'section2-2': { current: 1, total: 3, prefix: 'mlp' },
        'section2-3': { current: 1, total: 3, prefix: 'cnn' },
        'section2-4': { current: 1, total: 4, prefix: 'components' },
        'section2-5': { current: 1, total: 4, prefix: 'activation' },
        'section3-1': { current: 1, total: 4, prefix: 'gradient' },
        'section3-2': { current: 1, total: 4, prefix: 'supervised' },
        'section3-3': { current: 1, total: 4, prefix: 'backprop' }
    };

    if (sections[sectionId]) {
        const config = sections[sectionId];
        updatePageDisplay(config.prefix, config.current, config.total, sectionId);
        setupNavigation(config.prefix, config.total, sectionId);
    }
}

// Обновление отображаемой страницы
function updatePageDisplay(prefix, currentPage, totalPages, sectionId) {
    // Скрытие всех страниц раздела
    for (let i = 1; i <= totalPages; i++) {
        const pageElement = document.getElementById(`${prefix}-page-${i}`);
        if (pageElement) {
            pageElement.style.display = 'none';
        }
    }

    // Отображение текущей страницы
    const currentPageElement = document.getElementById(`${prefix}-page-${currentPage}`);
    if (currentPageElement) {
        currentPageElement.style.display = 'block';
    }

    // Обновление индикатора страницы
    const indicator = document.getElementById(`${prefix}-page-indicator`);
    if (indicator) {
        indicator.textContent = `Страница ${currentPage} из ${totalPages}`;
    }

    // Обновление навигации между темами на последней странице
    updateThemeNavigation(sectionId, currentPage, totalPages);

    // Отображение/скрытие кнопок навигации по страницам
    const prevBtn = document.getElementById(`${prefix}-prev-btn`);
    const nextBtn = document.getElementById(`${prefix}-next-btn`);
    
    if (prevBtn) prevBtn.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = currentPage === totalPages ? 'hidden' : 'visible';
}

// Обновление навигации между темами
function updateThemeNavigation(sectionId, currentPage, totalPages) {
    const currentIndex = sectionNavigation.sections.indexOf(sectionId);
    const isLastPage = currentPage === totalPages;
    
    // Найти контейнер секции
    const sectionContainer = document.getElementById(sectionId);
    if (!sectionContainer) return;
    
    // Удалить старые кнопки навигации по темам
    const oldThemeNav = sectionContainer.querySelector('.theme-navigation-container');
    if (oldThemeNav) oldThemeNav.remove();
    
    // Добавить кнопки навигации по темам на последней странице
    if (isLastPage) {
        const themeNavContainer = document.createElement('div');
        themeNavContainer.className = 'theme-navigation-container';
        
        const themeNav = document.createElement('div');
        themeNav.className = 'theme-navigation';
        
        const prevThemeBtn = document.createElement('button');
        prevThemeBtn.className = 'nav-btn theme-prev-btn';
        prevThemeBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Предыдущая тема';
        prevThemeBtn.onclick = () => sectionNavigation.prevSection();
        
        const nextThemeBtn = document.createElement('button');
        nextThemeBtn.className = 'nav-btn theme-next-btn';
        nextThemeBtn.innerHTML = 'Следующая тема <i class="fas fa-arrow-right"></i>';
        nextThemeBtn.onclick = () => sectionNavigation.nextSection();
        
        // Скрыть кнопки, если это первая или последняя тема
        if (currentIndex === 0) {
            prevThemeBtn.style.display = 'none';
        }
        if (currentIndex === sectionNavigation.sections.length - 1) {
            nextThemeBtn.style.display = 'none';
        }
        
        // Добавить кнопки в контейнер
        themeNav.appendChild(prevThemeBtn);
        themeNav.appendChild(nextThemeBtn);
        themeNavContainer.appendChild(themeNav);
        
        // Добавить контейнер после основной навигации
        const sectionNav = sectionContainer.querySelector('.section-navigation');
        if (sectionNav) {
            sectionNav.parentNode.insertBefore(themeNavContainer, sectionNav.nextSibling);
        } else {
            // Если нет основной навигации, добавить в конец секции
            const lastPage = sectionContainer.querySelector(`#${sectionId.split('-').slice(0,2).join('-')}-page-${totalPages}`);
            if (lastPage) {
                lastPage.appendChild(themeNavContainer);
            } else {
                sectionContainer.appendChild(themeNavContainer);
            }
        }
    }
}

// Настройка навигации для раздела
function setupNavigation(prefix, totalPages, sectionId) {
    let currentPage = 1;
    
    // Обработка нажатия кнопки "Назад"
    const prevBtn = document.getElementById(`${prefix}-prev-btn`);
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updatePageDisplay(prefix, currentPage, totalPages, sectionId);
                window.scrollTo(0, 0);
            }
        };
    }

    // Обработка нажатия кнопки "Вперед"
    const nextBtn = document.getElementById(`${prefix}-next-btn`);
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePageDisplay(prefix, currentPage, totalPages, sectionId);
                window.scrollTo(0, 0);
            }
        };
    }
}

function initWelcomeSection() {
    // Добавление обработчиков для ссылок в welcome-section
    const theoryLinks = document.querySelectorAll('.theory-link');
    theoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            sectionNavigation.showSection(targetId);
        });
    });
}

// Инициализация навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.submenu-item');
    menuItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    
    // Проверяем, какой раздел активен при загрузке и инициализируем соответствующую навигацию
    const activeSection = document.querySelector('.content-section:not(.hidden)');
    if (activeSection) {
        sectionNavigation.updateActiveSidebarItem(activeSection.id);
        initSectionNavigation(activeSection.id);
    }
    initWelcomeSection();
});