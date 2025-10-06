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

        // Функция для закрытия всех меню
        function closeAllMenus() {
            const dropdownContent = document.getElementById('dropdownContent');
            const dropdownBtn = document.getElementById('dropdownBtn');

            dropdownContent.classList.remove('show');
            dropdownBtn.classList.remove('menu-open');

            isDropdownOpen = false;
        }

        // Отображение основного меню с улучшенной логикой
        document.getElementById('dropdownBtn').addEventListener('click', function (e) {
            e.stopPropagation();

            const dropdownContent = document.getElementById('dropdownContent');
            const dropdownBtn = this;

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

        // Скрытие меню при клике вне области с улучшенной логикой
        document.addEventListener('click', function (event) {
            const dropdownBtn = document.getElementById('dropdownBtn');
            const dropdownContent = document.getElementById('dropdownContent');

            // Проверяем, был ли клик вне кнопок меню
            const isClickInsideDropdown = dropdownBtn.contains(event.target) || dropdownContent.contains(event.target);

            if (!isClickInsideDropdown) {
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

        // Управление музыкой
        const musicToggle = document.getElementById('musicToggle');
        const youtubePlayer = document.getElementById('youtubePlayer');
        const closePlayer = document.getElementById('closePlayer');

        musicToggle.addEventListener('click', function() {
            youtubePlayer.classList.toggle('hidden');
            musicToggle.classList.toggle('playing');
        });

        closePlayer.addEventListener('click', function() {
            youtubePlayer.classList.add('hidden');
            musicToggle.classList.remove('playing');
        });

        // Анимация появления элементов при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за всеми анимируемыми элементами
        document.querySelectorAll('.feature-card, .tech-item, .timeline-item, .team-member').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        // Добавляем небольшую задержку для стабильности работы меню
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(() => {
                console.log('Система "О проекте" инициализирована');
            }, 100);
        });
