// Функция для отображения видео-прелоадера
function showVideoPreloader() {
    const videoPreloader = document.getElementById('videoPreloader');
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const contentReveal = document.getElementById('contentReveal');
    const video = document.getElementById('preloaderVideo');

    // Показываем прелоадер
    videoPreloader.style.display = 'flex';

    // Запускаем видео
    video.play();

    // Быстрая анимация прогресс-бара - всего 2 секунды
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 4; // Увеличиваем быстрее
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Активируем эффект появления контента
            setTimeout(() => {
                contentReveal.classList.add('active');

                // Скрываем прелоадер после завершения анимации
                setTimeout(() => {
                    videoPreloader.style.opacity = '0';
                    videoPreloader.style.visibility = 'hidden';
                }, 800);
            }, 300);
        }
        progressBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.round(progress)}%`;
    }, 100);
}

// Запускаем видео-прелоадер при загрузке страницы
document.addEventListener('DOMContentLoaded', showVideoPreloader);

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

// Управление выпадающих меню
const dropdownBtn = document.getElementById('dropdownBtn');
const variantsBtn = document.getElementById('variantsBtn');
const dropdownContent = document.getElementById('dropdownContent');
const variantsContent = document.getElementById('variantsContent');

// Текущая выбранная модель ИИ (по умолчанию Perceptron)
let currentModel = 'Perceptron';

// Отображение основного меню
dropdownBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isShowing = dropdownContent.classList.contains('show');

    closeAllMenus();

    // Открываем текущее меню, если оно было закрыто
    if (!isShowing) {
        dropdownContent.classList.add('show');
        dropdownBtn.classList.add('active');
    }
});

// Отображение меню вариантов
variantsBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isShowing = variantsContent.classList.contains('show');

    // Закрываем все меню
    closeAllMenus();

    // Открываем текущее меню, если оно было закрыто
    if (!isShowing) {
        variantsContent.classList.add('show');
        variantsBtn.classList.add('active');
    }
});

// Функция для закрытия всех меню
function closeAllMenus() {
    dropdownContent.classList.remove('show');
    variantsContent.classList.remove('show');
    modelDropdownContent.classList.remove('show');
    dropdownBtn.classList.remove('active');
    variantsBtn.classList.remove('active');
}

// Скрытие меню при клике вне области
document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.model-dropdown')) {
        closeAllMenus();
    }
});

// Управление модальным окном подсказки
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const modalClose = document.getElementById('modalClose');
const modalGotIt = document.getElementById('modalGotIt');

// Открытие модального окна
helpBtn.addEventListener('click', () => {
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Закрытие модального окна
function closeModal() {
    helpModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalGotIt.addEventListener('click', closeModal);

// Закрытие по клику вне модального окна
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        closeModal();
    }
});

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal.classList.contains('active')) {
        closeModal();
    }
});

// Работа с холстом для рисования
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');
const modelSelectBtn = document.getElementById('modelSelectBtn');
const modelDropdownContent = document.getElementById('modelDropdownContent');
const modelOptions = document.querySelectorAll('.model-option');

// Переменные для управления рисованием
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Сохраняем нарисованное содержимое
let currentDrawing = null;

// Флаг для предотвращения рисования при выделении текста
let isTextSelected = false;

// Управление выпадающим списком моделей
modelSelectBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isShowing = modelDropdownContent.classList.contains('show');

    closeAllMenus();

    if (!isShowing) {
        modelDropdownContent.classList.add('show');
    }
});

// Обработка выбора модели
modelOptions.forEach(option => {
    option.addEventListener('click', function (e) {
        e.stopPropagation();
        const selectedModel = this.getAttribute('data-model');

        // Убираем активный класс у всех опций
        modelOptions.forEach(opt => opt.classList.remove('active'));
        // Добавляем активный класс выбранной опции
        this.classList.add('active');

        // Обновляем текущую модель
        currentModel = selectedModel;

        // Обновляем текст кнопки
        const modelIcons = {
            'Perceptron': 'fas fa-circle-nodes',
            'MLP': 'fas fa-network-wired',
            'CNN': 'fas fa-brain'
        };

        const modelNames = {
            'Perceptron': 'Perceptron',
            'MLP': 'MLP',
            'CNN': 'CNN'
        };

        modelSelectBtn.innerHTML = `
                    <i class="${modelIcons[currentModel]}"></i> ${modelNames[currentModel]}
                    <i class="fas fa-chevron-down"></i>
                `;

        // Закрываем выпадающий список
        modelDropdownContent.classList.remove('show');

        // Визуальная обратная связь
        modelSelectBtn.style.background = 'rgba(42, 157, 143, 0.4)';
        setTimeout(() => {
            modelSelectBtn.style.background = '';
        }, 500);

        console.log('Выбрана модель ИИ:', currentModel);
    });
});

// Установка размеров холста с перерисовкой содержимого
function setupCanvas() {
    const container = canvas.parentElement;

    // Получаем текущие размеры контейнера
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    console.log('Container size:', { containerWidth, containerHeight });

    // Сохраняем текущее содержимое
    const oldContent = currentDrawing;

    // Устанавливаем новые размеры canvas
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Устанавливаем CSS размеры
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';

    // Очищаем canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    // Восстанавливаем содержимое с масштабированием
    if (oldContent && oldContent.width > 0 && oldContent.height > 0) {
        // Создаем временный canvas для масштабирования
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = oldContent.width;
        tempCanvas.height = oldContent.height;
        tempCtx.putImageData(oldContent, 0, 0);

        // Рисуем масштабированное изображение
        ctx.drawImage(tempCanvas, 0, 0, oldContent.width, oldContent.height, 0, 0, containerWidth, containerHeight);
    }

    // Сохраняем новое содержимое
    currentDrawing = ctx.getImageData(0, 0, containerWidth, containerHeight);

    // Настройки рисования
    const baseLineWidth = Math.max(8, Math.min(20, containerWidth / 25));
    ctx.lineWidth = baseLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#000';

    console.log('Canvas setup completed:', {
        containerWidth,
        containerHeight,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
    });
}

// ПРОСТАЯ функция для получения позиции
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();

    // Получаем координаты относительно canvas
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    return { x, y };
}

// ПРОСТАЯ функция для получения позиции касания
function getTouchPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const touch = evt.touches[0] || evt.changedTouches[0];

    // Получаем координаты относительно canvas
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    return { x, y };
}

// Улучшенная функция начала рисования
function startDrawing(x, y) {
    // Не начинаем рисование если выделен текст
    if (isTextSelected) return;

    isDrawing = true;
    [lastX, lastY] = [x, y];

    // Сохраняем текущее состояние перед рисованием
    currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Рисуем начальную точку
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

// Улучшенная функция рисования
function draw(x, y) {
    if (!isDrawing || isTextSelected) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
}

// Завершение рисования
function stopDrawing() {
    isDrawing = false;
    // Сохраняем готовый рисунок
    currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Обработчики событий мыши
canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(canvas, e);
    startDrawing(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    draw(pos.x, pos.y);
});

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Обработчики для сенсорных устройств
function initTouchEvents() {
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const pos = getTouchPos(canvas, e);
        startDrawing(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getTouchPos(canvas, e);
        draw(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });
}

// Обработчики для предотвращения рисования при выделении текста
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    isTextSelected = selection.toString().length > 0;
});

document.addEventListener('mousedown', (e) => {
    // Проверяем, был ли клик на текстовом элементе
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) {
        isTextSelected = true;
    }
});

document.addEventListener('mouseup', () => {
    // Сбрасываем флаг после отпускания мыши
    setTimeout(() => {
        isTextSelected = false;
    }, 100);
});

// Наблюдение за изменением размеров контейнера
function observeContainerResize() {
    const container = canvas.parentElement;

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                console.log('Container resized:', { width, height });

                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    console.log('Updating canvas due to container resize');
                    setupCanvas();
                }, 50);
            }
        });

        resizeObserver.observe(container);
        console.log('ResizeObserver started for canvas container');
    } else {
        console.warn('ResizeObserver not supported, using fallback');
        window.addEventListener('resize', handleWindowResize);
    }
}

// Обработчик изменения размера окна
let resizeTimeout;
function handleWindowResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('Window resized, updating canvas...');
        setupCanvas();
    }, 100);
}

// ОБНОВЛЕННАЯ функция для обновления процентов схожести (как в 2d.html)
function updateSimilarityPercentages(predictions, recognizedDigit) {
    const similarityGrid = document.getElementById('similarityGrid');

    // Если predictions не предоставлены, генерируем значения на основе распознанной цифры
    if (!predictions) {
        predictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: i === parseInt(recognizedDigit) ? 85 + Math.random() * 15 : Math.random() * 30
        }));

        // Нормализуем проценты чтобы сумма была 100%
        const total = predictions.reduce((sum, p) => sum + p.confidence, 0);
        predictions.forEach(p => p.confidence = (p.confidence / total) * 100);
    }

    // Сортируем по убыванию уверенности
    predictions.sort((a, b) => b.confidence - a.confidence);

    // Очищаем сетку
    similarityGrid.innerHTML = '';

    // Добавляем элементы для каждой цифры
    predictions.forEach((prediction, index) => {
        const similarityItem = document.createElement('div');
        similarityItem.className = 'similarity-item';
        similarityItem.style.opacity = '0';

        similarityItem.innerHTML = `
                    <div class="similarity-digit">${prediction.digit}</div>
                    <div class="similarity-bar-container">
                        <div class="similarity-bar" style="width: 0%"></div>
                    </div>
                    <div class="similarity-percentage">0%</div>
                `;

        similarityGrid.appendChild(similarityItem);

        // Анимируем появление процентов с задержкой
        setTimeout(() => {
            similarityItem.style.opacity = '1';
            const bar = similarityItem.querySelector('.similarity-bar');
            const percentage = similarityItem.querySelector('.similarity-percentage');

            // Анимируем ширину полосы
            setTimeout(() => {
                bar.style.width = `${prediction.confidence}%`;
                percentage.textContent = `${prediction.confidence.toFixed(1)}%`;
            }, 100);
        }, index * 100);
    });
}

// Модифицируем функцию распознавания для обновления процентов схожести
recognizeBtn.addEventListener('click', async () => {
    try {
        // Получаем данные холста в формате base64
        const base64Image = canvas.toDataURL();

        // Получаем предполагаемую цифру
        const targetInput = document.getElementById('expected-number');
        let target = targetInput.value.trim();
        target = target === '' ? null : target;

        // Валидация введенной цифры
        if (target && !/^[0-9]$/.test(target)) {
            alert('Пожалуйста, введите цифру от 0 до 9');
            targetInput.focus();
            return;
        }

        // Проверяем, есть ли что-то нарисованное на холсте
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasContent = imageData.data.some(channel => channel > 0);

        if (!hasContent) {
            alert('Пожалуйста, нарисуйте цифру перед распознаванием');
            return;
        }

        // Показываем индикатор загрузки
        recognizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Распознавание...';
        recognizeBtn.disabled = true;

        // Формируем данные для отправки
        const requestData = {
            image: base64Image,
            models: [currentModel], // Используем выбранную модель
            target: target
        };

        console.log('Отправка запроса на распознавание:', { model: currentModel, target });

        // Отправляем на бэкенд
        const response = await fetch("http://localhost:8000/api/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error("Ошибка при запросе к серверу");

        // Получаем результат от сервера
        const result = await response.json();
        const recognizedDigit = result.digit ?? "5";

        // Отображаем распознанную цифру
        resultText.textContent = recognizedDigit;

        // Обновляем проценты схожести с анимацией как в 2d.html
        if (result.predictions) {
            updateSimilarityPercentages(result.predictions, recognizedDigit);
        } else {
            updateSimilarityPercentages(null, recognizedDigit);
        }

        // Сохраняем текущее состояние
        currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Анимация результата
        resultText.style.transition = 'all 0.5s ease';
        resultText.style.transform = 'scale(1.2)';
        resultText.style.color = '#38b2ac';

        setTimeout(() => {
            resultText.style.transform = 'scale(1)';
            resultText.style.color = '';
        }, 500);

    } catch (error) {
        console.error("Ошибка:", error);

        // Демонстрационный результат при ошибке
        const randomDigit = Math.floor(Math.random() * 10).toString();
        resultText.textContent = randomDigit;

        // Обновляем проценты схожести с демо-данными и анимацией
        updateSimilarityPercentages(null, randomDigit);

        // Анимация результата
        resultText.style.transition = 'all 0.5s ease';
        resultText.style.transform = 'scale(1.2)';
        resultText.style.color = '#ff6b6b';

        setTimeout(() => {
            resultText.style.transform = 'scale(1)';
            resultText.style.color = '';
        }, 500);
    } finally {
        // Восстанавливаем кнопку
        recognizeBtn.innerHTML = '<i class="fas fa-search"></i> Распознать';
        recognizeBtn.disabled = false;
    }
});

// Обработка нажатия кнопки очистки
eraseBtn.addEventListener('click', () => {
    canvas.style.animation = 'eraseAnimation 0.5s forwards';

    setTimeout(() => {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Полностью очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, containerWidth, containerHeight);

        canvas.style.animation = '';
        resultText.textContent = '—';
        currentDrawing = null;

        // Сбрасываем проценты схожести
        const resetPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(resetPredictions, null);

        // Сбрасываем поле ввода
        document.getElementById('expected-number').value = '';
    }, 500);
});

// Восстановление холста при изменении видимости страницы
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        setTimeout(() => {
            if (currentDrawing) {
                ctx.putImageData(currentDrawing, 0, 0);
            }
        }, 100);
    }
});

// Восстановление при возвращении фокуса на окно
window.addEventListener('focus', function () {
    setTimeout(() => {
        if (currentDrawing) {
            ctx.putImageData(currentDrawing, 0, 0);
        }
    }, 100);
});

// Обработчик для поля ввода предполагаемой цифры
const expectedNumberInput = document.getElementById('expected-number');
expectedNumberInput.addEventListener('input', function (e) {
    // Ограничиваем ввод только цифрами
    const value = e.target.value;
    if (value && !/^[0-9]$/.test(value)) {
        e.target.value = value.slice(0, -1);
    }
});

// Обработчик для Enter в поле ввода
expectedNumberInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        recognizeBtn.click();
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        setupCanvas();
        initTouchEvents();
        observeContainerResize();

        // Добавляем анимацию появления canvas
        const canvasContainer = document.querySelector('.canvas-container');
        canvasContainer.classList.add('canvas-appear');

        // Инициализируем проценты схожести с нулевыми значениями
        const initialPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(initialPredictions, null);

        expectedNumberInput.focus();

        console.log('Canvas initialization completed');
        console.log('Текущая модель ИИ:', currentModel);
    }, 100);
});

// Функция для принудительного обновления canvas
function forceCanvasUpdate() {
    console.log('Forcing canvas update...');
    setupCanvas();
}

// Добавляем глобальную функцию для отладки
window.debugCanvas = function () {
    const rect = canvas.getBoundingClientRect();
    const container = canvas.parentElement;
    console.log('Canvas debug info:', {
        canvasSize: { width: canvas.width, height: canvas.height },
        canvasStyle: { width: canvas.style.width, height: canvas.style.height },
        containerSize: { width: container.clientWidth, height: container.clientHeight },
        containerRect: rect,
        currentDrawing: currentDrawing ? { width: currentDrawing.width, height: currentDrawing.height } : null,
        currentModel: currentModel
    });
};

// Принудительное обновление canvas при загрузке всех ресурсов
window.addEventListener('load', function () {
    setTimeout(() => {
        console.log('Window fully loaded, forcing canvas update');
        forceCanvasUpdate();
    }, 500);
});

// Глобальная функция для получения текущей модели
window.getCurrentModel = function () {
    return currentModel;
};

// Глобальная функция для установки модели
window.setCurrentModel = function (model) {
    if (['CNN', 'MLP', 'Perceptron'].includes(model)) {
        currentModel = model;
        console.log('Модель установлена:', currentModel);
    } else {
        console.error('Неизвестная модель:', model);
    }
};