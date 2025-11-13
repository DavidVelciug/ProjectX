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