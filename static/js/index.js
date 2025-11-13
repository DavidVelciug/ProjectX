// Проверяем, не объявлен ли stateManager глобально
if (typeof window.stateManager === 'undefined') {
    // Если нет, инициализируем менеджер состояния
    window.stateManager = new StateManager();
}

// Управление цветовой темой интерфейса
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

function updateThemeIcon() {
    if (themeIcon) {
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

if (themeToggle && themeIcon) {
    // Восстанавливаем тему при загрузке
    updateThemeIcon();
    
    // Переключение между темами
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        updateThemeIcon();

        // Сохраняем состояние темы
        document.dispatchEvent(new CustomEvent('themeChanged'));
    });
}

// Управление музыкой
const musicToggle = document.getElementById('musicToggle');
const youtubePlayer = document.getElementById('youtubePlayer');
const closePlayer = document.getElementById('closePlayer');
const youtubeIframe = document.querySelector('.youtube-iframe');

function updateMusicIcon() {
    if (musicToggle) {
        const isPlaying = !youtubePlayer.classList.contains('hidden');
        if (isPlaying) {
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }
    }
}

// Функция для переключения музыки
function toggleMusic() {
    const isPlaying = youtubePlayer.classList.contains('hidden');
    
    if (isPlaying) {
        // Включаем музыку
        youtubePlayer.classList.remove('hidden');
        // Автоматически запускаем воспроизведение
        if (youtubeIframe) {
            const currentSrc = youtubeIframe.src;
            if (!currentSrc.includes('autoplay=1')) {
                youtubeIframe.src = currentSrc.replace(/(\?|&)autoplay=0/, '') + '&autoplay=1';
            }
        }
    } else {
        // Выключаем музыку
        youtubePlayer.classList.add('hidden');
        // Останавливаем воспроизведение
        if (youtubeIframe) {
            youtubeIframe.src = youtubeIframe.src.replace('&autoplay=1', '&autoplay=0');
        }
    }
    
    updateMusicIcon();
    document.dispatchEvent(new CustomEvent('musicStateChanged'));
}

if (musicToggle && youtubePlayer && closePlayer) {
    // Восстанавливаем состояние музыки при загрузке
    updateMusicIcon();
    
    // Переключение музыки
    musicToggle.addEventListener('click', toggleMusic);

    // Закрытие плеера
    closePlayer.addEventListener('click', () => {
        youtubePlayer.classList.add('hidden');
        // Останавливаем воспроизведение при закрытии
        if (youtubeIframe) {
            youtubeIframe.src = youtubeIframe.src.replace('&autoplay=1', '&autoplay=0');
        }
        updateMusicIcon();
        document.dispatchEvent(new CustomEvent('musicStateChanged'));
    });

    // Автоматическое воспроизведение при загрузке страницы, если музыка была включена
    if (window.stateManager.state.music.playing) {
        setTimeout(() => {
            if (!youtubePlayer.classList.contains('hidden')) {
                // Убеждаемся, что автовоспроизведение включено
                const currentSrc = youtubeIframe.src;
                if (!currentSrc.includes('autoplay=1')) {
                    youtubeIframe.src = currentSrc + '&autoplay=1';
                }
            }
        }, 2000);
    }
}

// Отображение основного меню
const dropdownBtn = document.getElementById('dropdownBtn');
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dropdownContent = document.getElementById('dropdownContent');
        const isShowing = dropdownContent.classList.contains('show');

        // Закрываем все другие меню
        closeAllDropdowns();

        // Открываем/закрываем текущее меню
        if (!isShowing) {
            dropdownContent.classList.add('show');
            this.classList.add('active');
        } else {
            dropdownContent.classList.remove('show');
            this.classList.remove('active');
        }
    });
}

// Отображение боковой панели на мобильных устройствах
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('show');
            // Обновляем иконку меню
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

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

// Скрытие меню при клике вне области
document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-content')) {
        closeAllDropdowns();
    }
    
    // Закрытие боковой панели при клике вне на мобильных
    if (window.innerWidth < 992) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        if (sidebar && !event.target.closest('.sidebar') && !event.target.closest('.menu-toggle')) {
            sidebar.classList.remove('show');
            // Восстанавливаем иконку меню
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
});

// Обработка ресайза окна
window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('show');
        }
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Инициализация опросника
function initSurvey() {
    const surveyIcon = document.getElementById('surveyIcon');
    const surveyModal = document.getElementById('surveyModal');
    const surveyContent = document.getElementById('surveyContent');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('surveyProgress');

    if (!surveyIcon || !surveyModal || !surveyContent) return;

    // Проверяем, не завершен ли уже опрос
    if (window.stateManager.isSurveyCompleted()) {
        surveyIcon.classList.add('hidden');
        return;
    }

    let currentQuestion = 0;
    let answers = [];
    let surveyCompleted = false;

    // Вопросы для опросника
    const questions = [
        {
            question: "Насколько вам интересна тема машинного обучения?",
            options: [
                "Очень интересна",
                "Интересна",
                "Нейтрально",
                "Не очень интересна",
                "Совсем не интересна"
            ],
            stats: [45, 30, 15, 7, 3]
        },
        {
            question: "Как вы оцениваете свой уровень знаний в области нейронных сетей?",
            options: [
                "Эксперт",
                "Продвинутый",
                "Средний",
                "Начинающий",
                "Новичок"
            ],
            stats: [5, 15, 35, 30, 15]
        },
        {
            question: "Как часто вы используете технологии машинного обучения в работе или учебе?",
            options: [
                "Ежедневно",
                "Несколько раз в неделю",
                "Несколько раз в месяц",
                "Редко",
                "Никогда"
            ],
            stats: [10, 20, 25, 30, 15]
        },
        {
            question: "Насколько полезным для вас был материал на этом сайте?",
            options: [
                "Очень полезен",
                "Полезен",
                "Нейтрально",
                "Не очень полезен",
                "Бесполезен"
            ],
            stats: [40, 35, 15, 7, 3]
        },
        {
            question: "Хотели бы вы углубленно изучить тему нейронных сетей?",
            options: [
                "Определенно да",
                "Вероятно да",
                "Не уверен(а)",
                "Вероятно нет",
                "Определенно нет"
            ],
            stats: [50, 25, 15, 7, 3]
        }
    ];

    // Показываем иконку опросника через 1.5 минуты
    setTimeout(() => {
        if (!window.stateManager.isSurveyCompleted()) {
            surveyIcon.classList.remove('hidden');
        }
    }, 90000);

    // Открытие опросника
    surveyIcon.addEventListener('click', () => {
        surveyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showQuestion(0);
    });

    // Закрытие опросника при клике вне контейнера
    surveyModal.addEventListener('click', (e) => {
        if (e.target === surveyModal) {
            closeSurvey();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && surveyModal.classList.contains('active')) {
            closeSurvey();
        }
    });

    // Навигация по вопросам
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                completeSurvey();
            }
        });
    }

    // Функция показа вопроса
    function showQuestion(index) {
        const question = questions[index];
        
        if (progressBar) {
            progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
        }
        
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.textContent = index === questions.length - 1 ? 'Завершить' : 'Далее';
        
        let html = `
            <div class="survey-question">
                <h3>${question.question}</h3>
                <div class="survey-options">
        `;
        
        question.options.forEach((option, i) => {
            const isSelected = answers[index] === i;
            html += `
                <div class="survey-option ${isSelected ? 'selected' : ''}" data-index="${i}">
                    ${option}
                </div>
            `;
        });
        
        html += `</div>`;
        
        if (answers[index] !== undefined) {
            html += `
                <div class="survey-stats">
                    <p>Другие пользователи ответили так:</p>
                    <div class="stats-bars">
            `;
            
            question.stats.forEach((stat, i) => {
                const isUserAnswer = answers[index] === i;
                html += `
                    <div class="stat-bar ${isUserAnswer ? 'user-answer' : ''}" style="width: ${stat}%">
                        <span>${stat}%</span>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        html += `</div>`;
        surveyContent.innerHTML = html;
        
        document.querySelectorAll('.survey-option').forEach(option => {
            option.addEventListener('click', () => {
                const selectedIndex = parseInt(option.getAttribute('data-index'));
                answers[index] = selectedIndex;
                
                document.querySelectorAll('.survey-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                option.classList.add('selected');
                showQuestion(index);
            });
        });
    }

    function completeSurvey() {
        surveyCompleted = true;
        window.stateManager.setSurveyCompleted(answers);
        
        surveyContent.innerHTML = `
            <div class="survey-completion">
                <h3>Спасибо за участие в опросе!</h3>
                <p>Ваши ответы помогут нам улучшить контент сайта.</p>
            </div>
        `;
        
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) {
            nextBtn.textContent = 'Закрыть';
            nextBtn.onclick = closeSurvey;
        }
        if (progressBar) progressBar.style.width = '100%';
    }

    function closeSurvey() {
        surveyModal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (surveyCompleted) {
            surveyIcon.classList.add('hidden');
        }
        
        if (!surveyCompleted) {
            currentQuestion = 0;
            answers = [];
            showQuestion(0);
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) {
                nextBtn.onclick = null;
                nextBtn.textContent = 'Далее';
            }
        }
    }
}

// Подсветка текущей страницы в сайдбаре
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.submenu-item');
    
    menuItems.forEach(item => {
        // Убираем активный класс со всех элементов
        item.classList.remove('active');
        
        // Добавляем активный класс к текущей странице
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
            
            // Прокручиваем к активному элементу
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    });
}

// Инициализация навигации для welcome-section
function initWelcomeSection() {
    const theoryLinks = document.querySelectorAll('.theory-link');
    theoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHref = this.getAttribute('href');
            if (targetHref && targetHref !== '#') {
                window.location.href = targetHref;
            }
        });
    });

    // Обработка ссылок в навигационном промо
    const navigationPromoLinks = document.querySelectorAll('.navigation-promo a');
    navigationPromoLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHref = this.getAttribute('href');
            if (targetHref && targetHref !== '#') {
                window.location.href = targetHref;
            }
        });
    });
}

// Управление анимациями и взаимодействиями
function initAnimations() {
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

    // Наблюдаем за карточками и блоками
    document.querySelectorAll('.feature-card, .advantage-card, .app-card, .era-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Инициализация интерактивных элементов
function initInteractiveElements() {
    // Обработка кликов по карточкам приложений
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Добавление эффекта наведения на кнопки навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Функция для обновления индикатора загрузки
function showLoadingIndicator() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Загрузка...</p>
            </div>
        `;
    }
}

// Функция для показа сообщения об ошибке
function showError(message) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>${message}</p>
                <button onclick="window.location.href='index.html'" class="nav-btn">
                    <i class="fas fa-arrow-left"></i> На главную
                </button>
            </div>
        `;
    }
}

// Глобальные функции для навигации
window.navigateToSection = function(sectionId) {
    const sectionMap = {
        'ml-section': 'section-ml',
        'section1-1': 'section-history',
        'section1-2': 'section-paradigms',
        'section1-3': 'section-blackbox',
        'section1-4': 'section-research',
        'section2-1': 'section-perceptron',
        'section2-2': 'section-mlp',
        'section2-3': 'section-cnn',
        'section2-4': 'section-components',
        'section2-5': 'section-activation',
        'section3-1': 'section-gradient',
        'section3-2': 'section-supervised',
        'section3-3': 'section-backpropagation'
    };

    const targetPage = sectionMap[sectionId];
    if (targetPage) {
        window.location.href = targetPage;
    }
};

// Функция для плавного скролла к элементам
window.smoothScrollTo = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Обработка специальных клавиш
document.addEventListener('keydown', function(e) {
    // Ctrl + / для поиска (можно добавить поиск позже)
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        // Здесь можно добавить функциональность поиска
        console.log('Поиск активирован');
    }
    
    // Escape для закрытия модальных окон
    if (e.key === 'Escape') {
        closeAllDropdowns();
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('show');
        
        const surveyModal = document.getElementById('surveyModal');
        if (surveyModal) surveyModal.classList.remove('active');
        
        const youtubePlayer = document.getElementById('youtubePlayer');
        if (youtubePlayer) {
            youtubePlayer.classList.add('hidden');
            updateMusicIcon();
        }
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('Страница загружена, состояние восстановлено');
    
    // Инициализируем подсветку текущей страницы
    highlightCurrentPage();
    
    // Инициализируем опросник
    initSurvey();
    
    // Инициализируем welcome-section если мы на главной странице
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        initWelcomeSection();
    }
    
    // Инициализируем анимации
    initAnimations();
    
    // Инициализируем интерактивные элементы
    initInteractiveElements();
    
    // Восстанавливаем состояние прокрутки если есть
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedScroll));
            sessionStorage.removeItem('scrollPosition');
        }, 100);
    }
});

// Сохранение позиции прокрутки перед переходом
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
});

// Обработчики событий для менеджера состояния
document.addEventListener('themeChanged', function() {
    if (window.stateManager) {
        window.stateManager.saveThemeState();
    }
});

document.addEventListener('musicStateChanged', function() {
    if (window.stateManager) {
        window.stateManager.saveMusicState();
    }
});

// Глобальные утилиты для отладки
window.debugState = function() {
    console.log('Текущее состояние:', window.stateManager.state);
    console.log('Опрос завершен:', window.stateManager.isSurveyCompleted());
};

window.resetSurvey = function() {
    window.stateManager.state.survey.completed = false;
    window.stateManager.state.survey.answers = [];
    window.stateManager.saveState();
    const surveyIcon = document.getElementById('surveyIcon');
    if (surveyIcon) {
        surveyIcon.classList.remove('hidden');
    }
    console.log('Опрос сброшен');
};

// Автоматическое обновление года в футере (если есть)
function updateFooterYear() {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

// Инициализация аналитики (базовая)
function initAnalytics() {
    // Простая аналитика - отслеживание просмотров страниц
    const pageView = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    };
    
    // Сохраняем в localStorage для простоты
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push(pageView);
    localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100))); // Храним последние 100 записей
}

// Инициализация Service Worker для оффлайн-работы (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker зарегистрирован: ', registration.scope);
        }, function(err) {
            console.log('Ошибка регистрации ServiceWorker: ', err);
        });
    });
}

// Экспорт функций для глобального использования
window.initSurvey = initSurvey;
window.highlightCurrentPage = highlightCurrentPage;
window.closeAllDropdowns = closeAllDropdowns;
window.showLoadingIndicator = showLoadingIndicator;
window.showError = showError;
window.updateThemeIcon = updateThemeIcon;
window.updateMusicIcon = updateMusicIcon;
window.toggleMusic = toggleMusic;

console.log('Index.js успешно загружен и инициализирован');