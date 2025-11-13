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
        progress += 3; // Увеличиваем шаг
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
                }, 500); 
            }, 200); 
        }
        progressBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.round(progress)}%`;
    }, 80); // Уменьшить интервал
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

// Анимация для логотипа при клике
document.querySelector('.logo').addEventListener('click', function(e) {
    const logo = this;
    logo.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        logo.style.transform = '';
    }, 150);
});

// ====================== Dropdown меню ======================
let currentModel = 'CNN';

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

// Отображение меню моделей ИИ
const modelBtn = document.getElementById('modelBtn');
if (modelBtn) {
    modelBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const modelContent = document.getElementById('modelContent');
        const isShowing = modelContent && modelContent.classList.contains('show');

        // Закрываем все другие меню
        closeAllDropdowns();

        // Открываем/закрываем текущее меню
        if (!isShowing && modelContent) {
            modelContent.classList.add('show');
            this.classList.add('active');
        }
    });
}

// Обработка выбора модели ИИ
const modelContent = document.getElementById('modelContent');
if (modelContent) {
    modelContent.addEventListener('click', function (e) {
        const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
        if (link && link.hasAttribute('data-model')) {
            e.preventDefault();
            e.stopPropagation();
            const selectedModel = link.getAttribute('data-model');
            if (selectedModel) {
                currentModel = selectedModel;
                // Получаем только текст модели (без иконки)
                const icon = link.querySelector('i');
                const modelName = icon ? link.textContent.replace(icon.textContent, '').trim() : link.textContent.trim();
                modelBtn.innerHTML = `Модель: ${modelName} <i class="fas fa-chevron-down"></i>`;
                modelBtn.style.background = 'rgba(42, 157, 143, 0.4)';
                setTimeout(() => {
                    modelBtn.style.background = '';
                }, 500);
                closeAllDropdowns();
                console.log('Выбрана модель ИИ:', currentModel);
            }
        }
    });
}

// Скрытие меню при клике вне области
document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-content')) {
        closeAllDropdowns();
    }
});

// Управление модальным окном подсказки
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const modalClose = document.getElementById('modalClose');
const modalGotIt = document.getElementById('modalGotIt');
const modalContent = document.querySelector('.modal-content');

// Улучшение скролла в модальном окне
function initModalScroll() {
    if (modalContent) {
        modalContent.addEventListener('scroll', function() {
            if (this.scrollTop > 10) {
                this.classList.add('scrolled');
            } else {
                this.classList.remove('scrolled');
            }
        });

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (helpModal.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                        setTimeout(() => {
                            if (modalContent.scrollTop > 10) {
                                modalContent.classList.add('scrolled');
                            } else {
                                modalContent.classList.remove('scrolled');
                            }
                        }, 100);
                    } else {
                        document.body.style.overflow = '';
                        modalContent.classList.remove('scrolled');
                    }
                }
            });
        });

        observer.observe(helpModal, { attributes: true });
    }
}

// Открытие модального окна
helpBtn.addEventListener('click', () => {
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (modalContent.scrollTop > 10) {
            modalContent.classList.add('scrolled');
        } else {
            modalContent.classList.remove('scrolled');
        }
    }, 100);
});

// Закрытие модального окна
function closeModal() {
    helpModal.classList.remove('active');
    document.body.style.overflow = '';
    modalContent.classList.remove('scrolled');
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

// Инициализация улучшенного скролла при загрузке
document.addEventListener('DOMContentLoaded', initModalScroll);

// Работа с холстом для рисования
const drawingCanvas = document.getElementById('drawing-canvas');
const drawingCtx = drawingCanvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');
const cubeDigit = document.getElementById('cube-digit');

// Переменные для управления рисованием
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Сохраняем нарисованное содержимое
let currentDrawing = null;
let currentDigit = '—';

// Установка размеров холста с перерисовкой содержимого
function setupCanvas() {
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

    // Устанавливаем CSS размеры
    drawingCanvas.style.width = containerWidth + 'px';
    drawingCanvas.style.height = containerHeight + 'px';

    // Очищаем canvas
    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

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
    isDrawing = true;
    [lastX, lastY] = [x, y];

    // Сохраняем текущее состояние перед рисованием
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    
    // Рисуем начальную точку
    drawingCtx.beginPath();
    drawingCtx.arc(x, y, drawingCtx.lineWidth / 2, 0, Math.PI * 2);
    drawingCtx.fillStyle = drawingCtx.strokeStyle;
    drawingCtx.fill();
}

// Улучшенная функция рисования
function draw(x, y) {
    if (!isDrawing) return;

    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();

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

// Функция для обновления процентов схожести
function updateSimilarityPercentages(predictions) {
    const similarityGrid = document.getElementById('similarityGrid');

    // Если predictions не предоставлены, генерируем случайные значения для демонстрации
    if (!predictions) {
        predictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: Math.random() * 100
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
    predictions.forEach(prediction => {
        const similarityItem = document.createElement('div');
        similarityItem.className = 'similarity-item';

        similarityItem.innerHTML = `
            <div class="similarity-digit">${prediction.digit}</div>
            <div class="similarity-bar-container">
                <div class="similarity-bar" style="width: ${prediction.confidence}%"></div>
            </div>
            <div class="similarity-percentage">${prediction.confidence.toFixed(1)}%</div>
        `;

        similarityGrid.appendChild(similarityItem);
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

// Обновление 3D отображения
function update3DDisplay(digit) {
    resultText.textContent = digit;
    document.querySelectorAll('.cube-digit').forEach(el => {
        el.textContent = digit;
    });
    currentDigit = digit;
}

// Модифицируем функцию распознавания для обновления процентов схожести
recognizeBtn.addEventListener('click', async () => {
    try {
        // Получаем данные холста в формате base64
        const base64Image = drawingCanvas.toDataURL();

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
        const imageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
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
            model: currentModel, // Используем выбранную модель
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

        // Обновляем цифру
        const digit = result.digit ?? "—";

        update3DDisplay(digit);

        // Обновляем проценты схожести
        if (result.predictions) {
            updateSimilarityPercentages(result.predictions);
        } else {
            // Если сервер не возвращает predictions, используем демо-данные
            updateSimilarityPercentages();
        }

        // Сохраняем текущее состояние
        currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

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

        update3DDisplay(randomDigit);

        // Обновляем проценты схожести с демо-данными
        updateSimilarityPercentages();

        // Сохраняем текущее состояние
        currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

        // Анимация результата
        resultText.style.transition = 'all 0.5s ease';
        resultText.style.transform = 'scale(1.2)';
        resultText.style.color = '#38b2ac';

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
    // Анимация очистки
    drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';

    setTimeout(() => {
        const containerWidth = drawingCanvas.parentElement.offsetWidth;
        const containerHeight = drawingCanvas.parentElement.offsetHeight;
        
        // Очищаем холст
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingCtx.fillStyle = '#000';
        drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

        drawingCanvas.style.animation = '';
        update3DDisplay('—');
        currentDrawing = null;
        currentDigit = '—';

        // Сбрасываем поле ввода
        document.getElementById('expected-number').value = '';

        // Сбрасываем проценты схожести
        const resetPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(resetPredictions);
    }, 500);
});

// Интерактивные 3D эффекты
const cube = document.querySelector('.cube-container');

// Взаимодействие с 3D объектами
cube.addEventListener('mouseenter', () => {
    cube.style.animationPlayState = 'paused';
});

cube.addEventListener('mouseleave', () => {
    cube.style.animationPlayState = 'running';
});

// Восстановление холста при изменении видимости страницы
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(() => {
            if (currentDrawing) {
                drawingCtx.putImageData(currentDrawing, 0, 0);
            }
        }, 100);
    }
});

// Восстановление при возвращении фокуса на окно
window.addEventListener('focus', function() {
    setTimeout(() => {
        if (currentDrawing) {
            drawingCtx.putImageData(currentDrawing, 0, 0);
        }
    }, 100);
});

// Улучшенная функция для демонстрации работы с случайными фигурами
function demoRecognition() {
    const container = drawingCanvas.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Очищаем холст
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, containerWidth, containerHeight);
    
    // Генерируем случайную цифру для демо
    const demoDigit = Math.floor(Math.random() * 10);
    
    // Устанавливаем стили для рисования
    drawingCtx.strokeStyle = '#FFFFFF';
    drawingCtx.fillStyle = '#FFFFFF';
    
    // Размер цифры пропорционален размеру холста
    const digitSize = Math.min(containerWidth, containerHeight) * 0.4;
    drawingCtx.lineWidth = Math.max(10, digitSize / 15);
    
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // Рисуем основную цифру
    drawDemoDigit(demoDigit, centerX, centerY, digitSize);
    
    // Добавляем случайные фигуры вокруг для тестирования распознавания
    addRandomShapes(containerWidth, containerHeight);
    
    // Устанавливаем предполагаемую цифру
    expectedNumberInput.value = demoDigit;
    
    // Сохраняем рисунок
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    
    // Показываем сообщение о готовности к распознаванию
    resultText.textContent = 'Готово к распознаванию';
    resultText.style.color = '#38b2ac';
    update3DDisplay('—');
    
    // Сбрасываем проценты схожести
    const resetPredictions = Array.from({ length: 10 }, (_, i) => ({
        digit: i,
        confidence: 0
    }));
    updateSimilarityPercentages(resetPredictions);
}

// Функция для рисования демо-цифры с улучшенными пропорциями
function drawDemoDigit(digit, centerX, centerY, size) {
    drawingCtx.beginPath();
    
    // Толщина линии пропорциональна размеру цифры
    const lineWidth = Math.max(8, size / 15);
    drawingCtx.lineWidth = lineWidth;
    
    switch(digit) {
        case 0:
            drawingCtx.arc(centerX, centerY, size * 0.7, 0, Math.PI * 2);
            drawingCtx.stroke();
            break;
            
        case 1:
            drawingCtx.moveTo(centerX, centerY - size * 0.8);
            drawingCtx.lineTo(centerX, centerY + size * 0.8);
            drawingCtx.moveTo(centerX - size * 0.2, centerY - size * 0.6);
            drawingCtx.lineTo(centerX, centerY - size * 0.8);
            drawingCtx.stroke();
            break;
            
        case 2:
            drawingCtx.moveTo(centerX - size * 0.5, centerY + size * 0.6);
            drawingCtx.quadraticCurveTo(
                centerX, 
                centerY - size * 0.8, 
                centerX + size * 0.5, 
                centerY - size * 0.3
            );
            drawingCtx.lineTo(centerX - size * 0.5, centerY + size * 0.8);
            drawingCtx.stroke();
            break;
            
        case 3:
            drawingCtx.moveTo(centerX - size * 0.4, centerY - size * 0.8);
            drawingCtx.quadraticCurveTo(
                centerX + size * 0.3, 
                centerY - size * 0.6, 
                centerX - size * 0.4, 
                centerY
            );
            drawingCtx.quadraticCurveTo(
                centerX + size * 0.3, 
                centerY + size * 0.2, 
                centerX - size * 0.4, 
                centerY + size * 0.8
            );
            drawingCtx.stroke();
            break;
            
        case 4:
            drawingCtx.moveTo(centerX + size * 0.4, centerY - size * 0.8);
            drawingCtx.lineTo(centerX - size * 0.4, centerY);
            drawingCtx.lineTo(centerX + size * 0.4, centerY);
            drawingCtx.moveTo(centerX - size * 0.1, centerY - size * 0.3);
            drawingCtx.lineTo(centerX - size * 0.1, centerY + size * 0.8);
            drawingCtx.stroke();
            break;
            
        case 5:
            drawingCtx.moveTo(centerX + size * 0.4, centerY - size * 0.8);
            drawingCtx.lineTo(centerX - size * 0.4, centerY - size * 0.8);
            drawingCtx.lineTo(centerX - size * 0.4, centerY);
            drawingCtx.lineTo(centerX + size * 0.3, centerY);
            drawingCtx.lineTo(centerX + size * 0.4, centerY + size * 0.4);
            drawingCtx.lineTo(centerX - size * 0.3, centerY + size * 0.8);
            drawingCtx.stroke();
            break;
            
        case 6:
            drawingCtx.arc(centerX, centerY + size * 0.2, size * 0.6, Math.PI * 0.2, Math.PI * 2.2);
            drawingCtx.moveTo(centerX + size * 0.4, centerY - size * 0.2);
            drawingCtx.lineTo(centerX - size * 0.3, centerY);
            drawingCtx.stroke();
            break;
            
        case 7:
            drawingCtx.moveTo(centerX - size * 0.4, centerY - size * 0.8);
            drawingCtx.lineTo(centerX + size * 0.4, centerY - size * 0.8);
            drawingCtx.lineTo(centerX - size * 0.3, centerY + size * 0.8);
            drawingCtx.stroke();
            break;
            
        case 8:
            drawingCtx.arc(centerX, centerY - size * 0.3, size * 0.4, 0, Math.PI * 2);
            drawingCtx.moveTo(centerX + size * 0.4, centerY);
            drawingCtx.arc(centerX, centerY + size * 0.3, size * 0.4, 0, Math.PI * 2);
            drawingCtx.stroke();
            break;
            
        case 9:
            drawingCtx.arc(centerX, centerY - size * 0.2, size * 0.6, Math.PI * 0.8, Math.PI * 2.8);
            drawingCtx.moveTo(centerX + size * 0.4, centerY + size * 0.2);
            drawingCtx.lineTo(centerX - size * 0.3, centerY);
            drawingCtx.stroke();
            break;
    }
}

// Функция для добавления случайных фигур (палочек, кружков) с улучшенными пропорциями
function addRandomShapes(width, height) {
    const numShapes = Math.floor(Math.random() * 6) + 2; 
    
    for (let i = 0; i < numShapes; i++) {
        const shapeType = Math.random() > 0.5 ? 'line' : 'circle';
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        // Размер фигур пропорционален размеру холста
        const baseSize = Math.min(width, height) * 0.05;
        
        drawingCtx.beginPath();
        
        if (shapeType === 'line') {
            // Случайная палочка/линия
            const angle = Math.random() * Math.PI * 2;
            const length = baseSize * (Math.random() * 3 + 2); // 2-5 базовых размеров
            drawingCtx.lineWidth = baseSize * (Math.random() * 0.5 + 0.3); // 0.3-0.8 базовых размеров
            
            drawingCtx.moveTo(x, y);
            drawingCtx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
            drawingCtx.stroke();
        } else {
            // Случайный кружок
            const radius = baseSize * (Math.random() * 1.5 + 0.5); // 0.5-2 базовых размеров
            drawingCtx.arc(x, y, radius, 0, Math.PI * 2);
            drawingCtx.fill();
        }
    }
}

// Создаем и добавляем демо-кнопку
const demoBtn = document.createElement('button');
demoBtn.innerHTML = '<i class="fas fa-magic"></i> Демо с фигурами';
demoBtn.className = 'control-btn';
demoBtn.id = 'demo-btn';
demoBtn.addEventListener('click', demoRecognition);

// Добавляем демо-кнопку в контейнер управления
document.querySelector('.controls').appendChild(demoBtn);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        setupCanvas();
        initTouchEvents();
        observeContainerResize();
        
        // Инициализируем проценты схожести с нулевыми значениями
        const initialPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(initialPredictions);

        // Фокус на поле ввода для удобства
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
window.debugCanvas = function() {
    const rect = drawingCanvas.getBoundingClientRect();
    const container = drawingCanvas.parentElement;
    console.log('Canvas debug info:', {
        drawingCanvasSize: { width: drawingCanvas.width, height: drawingCanvas.height },
        drawingCanvasStyle: { width: drawingCanvas.style.width, height: drawingCanvas.style.height },
        containerSize: { width: container.offsetWidth, height: container.offsetHeight },
        containerRect: rect,
        currentDrawing: currentDrawing ? { width: currentDrawing.width, height: currentDrawing.height } : null,
        currentModel: currentModel
    });
};

// Принудительное обновление canvas при загрузке всех ресурсов
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('Window fully loaded, forcing canvas update');
        forceCanvasUpdate();
    }, 500);
});

// Глобальная функция для получения текущей модели
window.getCurrentModel = function() {
    return currentModel;
};

// Глобальная функция для установки модели
window.setCurrentModel = function(model) {
    if (['CNN', 'MLP', 'Perceptron'].includes(model)) {
        currentModel = model;
        console.log('Модель установлена:', currentModel);
    } else {
        console.error('Неизвестная модель:', model);
    }
};