// Функция для отображения видео-прелоадера
function showVideoPreloader() {
    const videoPreloader = document.getElementById('videoPreloader');
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const contentReveal = document.getElementById('contentReveal');
    const video = document.getElementById('preloaderVideo');

    // Показываем прелоадер
    videoPreloader.style.display = 'flex';

    // Запускаем видео с обработкой ошибок
    video.play().catch(error => {
        console.log('Video play error:', error);
        // Продолжаем анимацию даже если видео не загрузилось
    });

    // Быстрая анимация прогресс-бара - всего 2 секунды
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 3; // Увеличиваем быстрее
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

// Получить элементы для нового выпадающего списка
const modelSelectBtn = document.getElementById('modelSelectBtn');
const modelDropdownContent = document.getElementById('modelDropdownContent');
const modelOptions = document.querySelectorAll('.model-option');

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
            'MLP': 'fas fa-network-wired'
        };

        const modelNames = {
            'Perceptron': 'Perceptron',
            'MLP': 'MLP'
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

// Работа с холстами для рисования
const drawingCanvas = document.getElementById('drawing-canvas');
const resultCanvas = document.getElementById('result-canvas');
const drawingCtx = drawingCanvas.getContext('2d');
const resultCtx = resultCanvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');

// Переменные для управления рисованием
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingPaths = [];

// Сохраняем нарисованное содержимое
let currentDrawing = null;

// Флаг для предотвращения рисования при выделении текста
let isTextSelected = false;

// Установка размеров холстов с перерисовкой содержимого
function setupCanvases() {
    const container = drawingCanvas.parentElement;

    // Получаем текущие размеры контейнера
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    console.log('Container size:', { containerWidth, containerHeight });

    // Сохраняем текущее содержимое
    const oldContent = currentDrawing;

    // Устанавливаем новые размеры canvas
    drawingCanvas.width = containerWidth;
    drawingCanvas.height = containerHeight;
    resultCanvas.width = containerWidth;
    resultCanvas.height = containerHeight;

    // Устанавливаем CSS размеры
    drawingCanvas.style.width = containerWidth + 'px';
    drawingCanvas.style.height = containerHeight + 'px';
    resultCanvas.style.width = containerWidth + 'px';
    resultCanvas.style.height = containerHeight + 'px';

    // Очищаем canvas
    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, containerWidth, containerHeight);
    resultCtx.fillStyle = '#000';
    resultCtx.fillRect(0, 0, containerWidth, containerHeight);

    // Восстанавливаем содержимое с масштабированием
    if (oldContent && oldContent.width > 0 && oldContent.height > 0) {
        // Создаем временный canvas для масштабирования
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = oldContent.width;
        tempCanvas.height = oldContent.height;
        tempCtx.putImageData(oldContent, 0, 0);

        // Рисуем масштабированное изображение
        drawingCtx.drawImage(tempCanvas, 0, 0, oldContent.width, oldContent.height, 0, 0, containerWidth, containerHeight);
    }

    // Сохраняем новое содержимое
    currentDrawing = drawingCtx.getImageData(0, 0, containerWidth, containerHeight);

    // Настройки рисования
    const baseLineWidth = Math.max(8, Math.min(20, containerWidth / 25));
    drawingCtx.lineWidth = baseLineWidth;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    drawingCtx.strokeStyle = '#FFFFFF';
    drawingCtx.fillStyle = '#000';

    // Настройки для результата
    resultCtx.fillStyle = '#000';
    resultCtx.strokeStyle = '#38b2ac';

    console.log('Canvas setup completed:', {
        containerWidth,
        containerHeight,
        drawingCanvasWidth: drawingCanvas.width,
        drawingCanvasHeight: drawingCanvas.height
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
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

    // Добавляем новый путь
    drawingPaths.push([{ x, y }]);

    // Рисуем начальную точки
    drawingCtx.beginPath();
    drawingCtx.arc(x, y, drawingCtx.lineWidth / 2, 0, Math.PI * 2);
    drawingCtx.fillStyle = drawingCtx.strokeStyle;
    drawingCtx.fill();
}

// Улучшенная функция рисования
function draw(x, y) {
    if (!isDrawing || isTextSelected) return;

    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();

    // Добавляем точку в текущий путь
    if (drawingPaths.length > 0) {
        drawingPaths[drawingPaths.length - 1].push({ x, y });
    }

    [lastX, lastY] = [x, y];
}

// Завершение рисования
function stopDrawing() {
    isDrawing = false;
    // Сохраняем готовый рисунок
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// Обработчики событий мыши
drawingCanvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(drawingCanvas, e);
    startDrawing(pos.x, pos.y);
});

drawingCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(drawingCanvas, e);
    draw(pos.x, pos.y);
});

drawingCanvas.addEventListener('mouseup', stopDrawing);
drawingCanvas.addEventListener('mouseout', stopDrawing);

// Обработчики для сенсорных устройств
function initTouchEvents() {
    drawingCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const pos = getTouchPos(drawingCanvas, e);
        startDrawing(pos.x, pos.y);
    }, { passive: false });

    drawingCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getTouchPos(drawingCanvas, e);
        draw(pos.x, pos.y);
    }, { passive: false });

    drawingCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });

    drawingCanvas.addEventListener('touchcancel', (e) => {
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
    const container = drawingCanvas.parentElement;

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                console.log('Container resized:', { width, height });

                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    console.log('Updating canvas due to container resize');
                    setupCanvases();
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
        setupCanvases();
    }, 100);
}

// Функция для обновления процентов схожести (ИСПРАВЛЕННАЯ)
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

// Функция для показа результата распознавания
function showRecognitionResult(digit) {
    const resultContainer = resultCanvas.parentElement;

    // Очищаем canvas результата
    resultCtx.fillStyle = '#000';
    resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

    // Рисуем цифру
    const fontSize = Math.min(resultCanvas.width, resultCanvas.height) * 0.6;
    resultCtx.font = `bold ${fontSize}px Arial`;
    resultCtx.fillStyle = '#38b2ac';
    resultCtx.textAlign = 'center';
    resultCtx.textBaseline = 'middle';

    // Анимируем появление цифры
    resultCanvas.classList.add('digit-reveal');
    resultCtx.fillText(digit, resultCanvas.width / 2, resultCanvas.height / 2);

    // Убираем класс анимации после завершения
    setTimeout(() => {
        resultCanvas.classList.remove('digit-reveal');
    }, 2000);
}

// Обработка нажатия кнопки очистки
eraseBtn.addEventListener('click', () => {
    // Анимация очистки
    drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';

    setTimeout(() => {
        const containerWidth = drawingCanvas.parentElement.offsetWidth;
        const containerHeight = drawingCanvas.parentElement.offsetHeight;

        // Очищаем холсты
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingCtx.fillStyle = '#000';
        drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

        resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
        resultCtx.fillStyle = '#000';
        resultCtx.fillRect(0, 0, containerWidth, containerHeight);

        drawingCanvas.style.animation = '';
        drawingPaths = [];

        // Сбрасываем поле ввода
        document.getElementById('expected-number').value = '';

        // Сбрасываем проценты схожести
        const resetPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(resetPredictions, null);
    }, 500);
});

// Восстановление холстов при изменении видимости страницы
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        setTimeout(() => {
            if (currentDrawing) {
                drawingCtx.putImageData(currentDrawing, 0, 0);
            }
        }, 100);
    }
});

// Восстановление при возвращении фокуса на окно
window.addEventListener('focus', function () {
    setTimeout(() => {
        if (currentDrawing) {
            drawingCtx.putImageData(currentDrawing, 0, 0);
        }
    }, 100);
});

// Функция для открытия страницы с анимацией MLP в соседней вкладке
function openMlpAnimation(recognizedDigit, predictions) {
    // Сохраняем распознанную цифру и предсказания для передачи на страницу анимации
    localStorage.setItem('recognizedDigit', recognizedDigit);
    localStorage.setItem('predictions', JSON.stringify(predictions));
    // Сохраняем текущую тему
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');

    // Открываем страницу с анимацией в соседней вкладке
    window.open('mlp-animation', '_blank');

    console.log('Страница с анимацией MLP открыта в соседней вкладке');
}

// Функция для открытия страницы с анимацией Perceptron в соседней вкладке
function openPerceptronAnimation(recognizedDigit, predictions) {
    // Сохраняем распознанную цифру и предсказания для передачи на страницу анимации
    localStorage.setItem('recognizedDigit', recognizedDigit);
    localStorage.setItem('predictions', JSON.stringify(predictions));
    // Сохраняем текущую тему
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');

    // Открываем страницу с анимацией в соседней вкладке
    window.open('perceptron-animation', '_blank');

    console.log('Страница с анимацией Perceptron открыта в соседней вкладке');
}

// Обработчик для кнопки распознавания
recognizeBtn.addEventListener('click', async () => {
    try {
        // Проверяем, выбрана ли модель
        if (!currentModel) {
            alert('Пожалуйста, выберите модель ИИ для распознавания');
            return;
        }

        // Получаем данные холста
        const base64Image = drawingCanvas.toDataURL();
        const targetInput = document.getElementById('expected-number');
        let target = targetInput.value.trim();
        target = target === '' ? null : target;

        if (target && !/^[0-9]$/.test(target)) {
            alert('Пожалуйста, введите цифру от 0 до 9');
            targetInput.focus();
            return;
        }

        const imageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
        const hasContent = imageData.data.some(channel => channel > 0);

        if (!hasContent) {
            alert('Пожалуйста, нарисуйте цифру перед распознаванием');
            return;
        }

        recognizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Распознавание...';
        recognizeBtn.disabled = true;

        const requestData = {
            image: base64Image,
            models: [currentModel],
            target: target
        };

        // Отправляем запрос на сервер с обработкой ошибок
        try {
            const response = await fetch("http://localhost:8000/api/recognize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error("Ошибка при запросе к серверу");

            const result = await response.json();
            const recognizedDigit = result.digit ?? "5";
            const predictions = result.predictions;

            // Показываем результат распознавания
            showRecognitionResult(recognizedDigit);

            // Обновляем проценты схожести
            updateSimilarityPercentages(predictions, recognizedDigit);

            // В зависимости от выбранной модели открываем соответствующую анимацию
            if (currentModel === 'MLP') {
                openMlpAnimation(recognizedDigit, predictions);
            } else if (currentModel === 'Perceptron') {
                openPerceptronAnimation(recognizedDigit, predictions);
            }

            // Сохраняем текущее состояние
            currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

        } catch (fetchError) {
            console.error("Ошибка при запросе:", fetchError);
            throw new Error("Сервер недоступен");
        }

    } catch (error) {
        console.error("Ошибка:", error);

        // Демонстрационный результат при ошибке
        const randomDigit = Math.floor(Math.random() * 10).toString();
        const demoPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: i === parseInt(randomDigit) ? 85 + Math.random() * 15 : Math.random() * 30
        }));

        // Нормализуем проценты
        const total = demoPredictions.reduce((sum, p) => sum + p.confidence, 0);
        demoPredictions.forEach(p => p.confidence = (p.confidence / total) * 100);

        // Показываем результат с демо-данными
        showRecognitionResult(randomDigit);
        updateSimilarityPercentages(demoPredictions, randomDigit);

        // В зависимости от выбранной модели открываем соответствующую анимацию
        if (currentModel === 'MLP') {
            openMlpAnimation(randomDigit, demoPredictions);
        } else if (currentModel === 'Perceptron') {
            openPerceptronAnimation(randomDigit, demoPredictions);
        }

        // Показываем сообщение об ошибке
        alert('Сервер распознавания недоступен. Показаны демонстрационные результаты.');

    } finally {
        recognizeBtn.innerHTML = '<i class="fas fa-search"></i> Распознать';
        recognizeBtn.disabled = false;
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        setupCanvases();
        initTouchEvents();
        observeContainerResize();

        // Добавляем анимацию появления canvas
        const canvasContainers = document.querySelectorAll('.canvas-container');
        canvasContainers.forEach(container => {
            container.classList.add('canvas-appear');
        });

        // Инициализируем проценты схожести с нулевыми значениями
        const initialPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(initialPredictions, null);

        // Фокус на поле ввода для удобства
        expectedNumberInput.focus();

        console.log('Canvas initialization completed');
        console.log('Текущая модель ИИ:', currentModel);
    }, 100);
});

// Функция для принудительного обновления canvas
function forceCanvasUpdate() {
    console.log('Forcing canvas update...');
    setupCanvases();
}

// Добавляем глобальную функцию для отладки
window.debugCanvas = function () {
    const rect = drawingCanvas.getBoundingClientRect();
    const container = drawingCanvas.parentElement;
    console.log('Canvas debug info:', {
        drawingCanvasSize: { width: drawingCanvas.width, height: drawingCanvas.height },
        drawingCanvasStyle: { width: drawingCanvas.style.width, height: drawingCanvas.style.height },
        resultCanvasSize: { width: resultCanvas.width, height: resultCanvas.height },
        containerSize: { width: container.offsetWidth, height: container.offsetHeight },
        containerRect: rect,
        currentDrawing: currentDrawing ? { width: currentDrawing.width, height: currentDrawing.height } : null,
        currentModel: currentModel,
        drawingPaths: drawingPaths.length
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
    if (['MLP', 'Perceptron'].includes(model)) {
        currentModel = model;
        console.log('Модель установлена:', currentModel);
    } else {
        console.error('Неизвестная модель:', model);
    }
};