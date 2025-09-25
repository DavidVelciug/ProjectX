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

                // Инициализация навигации для раздела машинного обучения при его открытии
                if (targetId === 'ml-section') {
                    initMlNavigation();
                }
                
                // Инициализация навигации для раздела 1.2 при его открытии
                if (targetId === 'section1-2') {
                    initParadigmNavigation();
                }
                
                // Инициализация навигации для раздела истории при его открытии
                if (targetId === 'section1-1') {
                    initHistoryNavigation();
                }
            });
        });

        // Навигация внутри раздела машинного обучения
        let currentMlPage = 1;
        const totalMlPages = 3;
        const mlPageIndicator = document.getElementById('ml-page-indicator');

        // Инициализация навигации для раздела машинного обучения
        function initMlNavigation() {
            currentMlPage = 1;
            updateMlPage();
        }

        // Обновление отображаемой страницы
        function updateMlPage() {
            // Скрытие всех страниц
            for (let i = 1; i <= totalMlPages; i++) {
                document.getElementById(`ml-page-${i}`).style.display = 'none';
            }

            // Отображение текущей страницы
            document.getElementById(`ml-page-${currentMlPage}`).style.display = 'block';

            // Обновление индикатора страницы
            mlPageIndicator.textContent = `Страница ${currentMlPage} из ${totalMlPages}`;

            // Отображение/скрытие кнопок навигации
            document.getElementById('ml-prev-btn').style.visibility = currentMlPage === 1 ? 'hidden' : 'visible';
            document.getElementById('ml-next-btn').style.visibility = currentMlPage === totalMlPages ? 'hidden' : 'visible';
        }

        // Обработка нажатия кнопки "Назад"
        document.getElementById('ml-prev-btn').addEventListener('click', () => {
            if (currentMlPage > 1) {
                currentMlPage--;
                updateMlPage();
                window.scrollTo(0, 0);
            }
        });

        // Обработка нажатия кнопки "Вперед"
        document.getElementById('ml-next-btn').addEventListener('click', () => {
            if (currentMlPage < totalMlPages) {
                currentMlPage++;
                updateMlPage();
                window.scrollTo(0, 0);
            }
        });

        // Навигация внутри раздела 1.2 (Основные парадигмы обучения)
        let currentParadigmPage = 1;
        const totalParadigmPages = 3;
        const paradigmPageIndicator = document.getElementById('paradigm-page-indicator');

        // Инициализация навигации для раздела 1.2
        function initParadigmNavigation() {
            currentParadigmPage = 1;
            updateParadigmPage();
        }

        // Обновление отображаемой страницы в разделе 1.2
        function updateParadigmPage() {
            // Скрытие всех страниц
            for (let i = 1; i <= totalParadigmPages; i++) {
                document.getElementById(`paradigm-page-${i}`).style.display = 'none';
            }

            // Отображение текущей страницы
            document.getElementById(`paradigm-page-${currentParadigmPage}`).style.display = 'block';

            // Обновление индикатора страницы
            paradigmPageIndicator.textContent = `Страница ${currentParadigmPage} из ${totalParadigmPages}`;

            // Отображение/скрытие кнопок навигации
            document.getElementById('paradigm-prev-btn').style.visibility = currentParadigmPage === 1 ? 'hidden' : 'visible';
            document.getElementById('paradigm-next-btn').style.visibility = currentParadigmPage === totalParadigmPages ? 'hidden' : 'visible';
        }

        // Обработка нажатия кнопки "Назад" в разделе 1.2
        document.getElementById('paradigm-prev-btn').addEventListener('click', () => {
            if (currentParadigmPage > 1) {
                currentParadigmPage--;
                updateParadigmPage();
                window.scrollTo(0, 0);
            }
        });

        // Обработка нажатия кнопки "Вперед" в разделе 1.2
        document.getElementById('paradigm-next-btn').addEventListener('click', () => {
            if (currentParadigmPage < totalParadigmPages) {
                currentParadigmPage++;
                updateParadigmPage();
                window.scrollTo(0, 0);
            }
        });

        // Навигация внутри раздела истории машинного обучения
        let currentHistoryPage = 1;
        const totalHistoryPages = 3;
        const historyPageIndicator = document.getElementById('history-page-indicator');

        // Инициализация навигации для раздела истории
        function initHistoryNavigation() {
            currentHistoryPage = 1;
            updateHistoryPage();
        }

        // Обновление отображаемой страницы в разделе истории
        function updateHistoryPage() {
            // Скрытие всех страниц
            for (let i = 1; i <= totalHistoryPages; i++) {
                document.getElementById(`history-page-${i}`).style.display = 'none';
            }

            // Отображение текущей страницы
            document.getElementById(`history-page-${currentHistoryPage}`).style.display = 'block';

            // Обновление индикатора страницы
            historyPageIndicator.textContent = `Страница ${currentHistoryPage} из ${totalHistoryPages}`;

            // Отображение/скрытие кнопок навигации
            document.getElementById('history-prev-btn').style.visibility = currentHistoryPage === 1 ? 'hidden' : 'visible';
            document.getElementById('history-next-btn').style.visibility = currentHistoryPage === totalHistoryPages ? 'hidden' : 'visible';
        }

        // Ообработка нажатия кнопки "Назад" в разделе истории
        document.getElementById('history-prev-btn').addEventListener('click', () => {
            if (currentHistoryPage > 1) {
                currentHistoryPage--;
                updateHistoryPage();
                window.scrollTo(0, 0);
            }
        });

        // Обработка нажатия кнопки "Вперед" в разделе истории
        document.getElementById('history-next-btn').addEventListener('click', () => {
            if (currentHistoryPage < totalHistoryPages) {
                currentHistoryPage++;
                updateHistoryPage();
                window.scrollTo(0, 0);
            }
        });

        // Инициализация навигации при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            // Проверяем, какой раздел активен при загрузке и инициализируем соответствующую навигацию
            const activeSection = document.querySelector('.content-section:not(.hidden)');
            if (activeSection) {
                if (activeSection.id === 'ml-section') {
                    initMlNavigation();
                } else if (activeSection.id === 'section1-2') {
                    initParadigmNavigation();
                } else if (activeSection.id === 'section1-1') {
                    initHistoryNavigation();
                }
            }
        });