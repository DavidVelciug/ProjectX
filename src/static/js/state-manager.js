// Менеджер состояния приложения
class StateManager {
    constructor() {
        this.state = this.loadState();
        this.init();
    }

    init() {
        // Восстанавливаем состояние при загрузке страницы
        this.restoreState();
        
        // Сохраняем состояние перед закрытием страницы
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Сохраняем состояние при изменении темы
        document.addEventListener('themeChanged', () => {
            this.saveThemeState();
        });

        // Сохраняем состояние музыки
        document.addEventListener('musicStateChanged', () => {
            this.saveMusicState();
        });
    }

    loadState() {
        const saved = localStorage.getItem('appState');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Ошибка загрузки состояния:', e);
            }
        }
        
        // Состояние по умолчанию
        return {
            theme: 'dark',
            music: {
                playing: false,
                volume: 50,
                currentTime: 0
            },
            survey: {
                completed: false,
                answers: []
            },
            lastVisited: null
        };
    }

    saveState() {
        try {
            // Сохраняем текущее время воспроизведения музыки
            const youtubeIframe = document.querySelector('.youtube-iframe');
            if (youtubeIframe && this.state.music.playing) {
                // Сохраняем время воспроизведения
                this.state.music.currentTime = youtubeIframe.contentWindow.postMessage ? 
                    this.state.music.currentTime : 0;
            }
            
            localStorage.setItem('appState', JSON.stringify(this.state));
        } catch (e) {
            console.error('Ошибка сохранения состояния:', e);
        }
    }

    restoreState() {
        // Восстанавливаем тему
        if (this.state.theme === 'light') {
            document.body.classList.add('light-theme');
        }
        
        // Обновляем иконку темы
        if (typeof window.updateThemeIcon === 'function') {
            window.updateThemeIcon();
        }

        // Восстанавливаем состояние музыки
        if (this.state.music.playing) {
            const youtubePlayer = document.getElementById('youtubePlayer');
            if (youtubePlayer) {
                youtubePlayer.classList.remove('hidden');
                // Автоматически запускаем воспроизведение при загрузке страницы
                this.autoPlayMusic();
            }
        }
        
        // Обновляем иконку музыки
        if (typeof window.updateMusicIcon === 'function') {
            window.updateMusicIcon();
        }

        // Обновляем время последнего посещения
        this.state.lastVisited = new Date().toISOString();
        this.saveState();
    }

    autoPlayMusic() {
        // Ждем загрузки iframe и пытаемся запустить воспроизведение
        setTimeout(() => {
            const youtubeIframe = document.querySelector('.youtube-iframe');
            if (youtubeIframe) {
                // Пытаемся запустить воспроизведение
                youtubeIframe.src += '&autoplay=1';
            }
        }, 1000);
    }

    saveThemeState() {
        const isLightTheme = document.body.classList.contains('light-theme');
        this.state.theme = isLightTheme ? 'light' : 'dark';
        this.saveState();
    }

    saveMusicState() {
        const youtubePlayer = document.getElementById('youtubePlayer');
        if (youtubePlayer) {
            this.state.music.playing = !youtubePlayer.classList.contains('hidden');
        }
        this.saveState();
    }

    setSurveyCompleted(answers) {
        this.state.survey.completed = true;
        this.state.survey.answers = answers;
        this.saveState();
    }

    isSurveyCompleted() {
        return this.state.survey.completed;
    }

    getSurveyAnswers() {
        return this.state.survey.answers;
    }
}

// Создаем глобальный экземпляр менеджера состояния только если он еще не существует
if (typeof window.stateManager === 'undefined') {
    window.stateManager = new StateManager();
}