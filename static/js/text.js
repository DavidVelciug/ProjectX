// ====================== Видео-прелоадер ======================
function showVideoPreloader() {
    const videoPreloader = document.getElementById('videoPreloader');
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const contentReveal = document.getElementById('contentReveal');
    const video = document.getElementById('preloaderVideo');

    if (!videoPreloader || !progressBar || !loadingPercentage || !contentReveal || !video) return;

    videoPreloader.style.display = 'flex';
    video.muted = true;
    video.play();

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                contentReveal.classList.add('active');
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
document.addEventListener('DOMContentLoaded', showVideoPreloader);

// ====================== Тема ======================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-theme');
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
}

themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        themeIcon?.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon?.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
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
                setTimeout(function() {
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

// ====================== Модальное окно подсказки ======================
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const modalClose = document.getElementById('modalClose');
const modalGotIt = document.getElementById('modalGotIt');
const modalContent = document.querySelector('.modal-content');

function initModalScroll() {
    if (!modalContent) return;
    modalContent.addEventListener('scroll', function() {
        this.classList.toggle('scrolled', this.scrollTop > 10);
    });
}
helpBtn?.addEventListener('click', () => {
    helpModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
});
modalClose?.addEventListener('click', () => { helpModal?.classList.remove('active'); document.body.style.overflow = ''; });
modalGotIt?.addEventListener('click', () => { helpModal?.classList.remove('active'); document.body.style.overflow = ''; });
helpModal?.addEventListener('click', e => { if (e.target === helpModal) { helpModal?.classList.remove('active'); document.body.style.overflow = ''; } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { helpModal?.classList.remove('active'); document.body.style.overflow = ''; } });

// ====================== Canvas ======================
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas?.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');
const expectedNumberInput = document.getElementById('expected-number');

let isDrawing = false;
let lastX = 0, lastY = 0;
let currentDrawing = null;

function setupCanvas() {
    if (!canvas || !ctx) return;
    const container = canvas.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight;

    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = Math.max(8, Math.min(20, w / 25));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFF';
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function getTouchPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const touch = evt.touches[0] || evt.changedTouches[0];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}

function startDrawing(x, y) {
    if (!ctx) return;
    isDrawing = true;
    [lastX, lastY] = [x, y];
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth/2, 0, Math.PI*2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

function draw(x, y) {
    if (!isDrawing || !ctx) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

function stopDrawing() { isDrawing = false; }

// ====================== События мыши ======================
canvas?.addEventListener('mousedown', e => startDrawing(getMousePos(canvas, e).x, getMousePos(canvas, e).y));
canvas?.addEventListener('mousemove', e => { if(isDrawing) draw(getMousePos(canvas, e).x, getMousePos(canvas, e).y); });
canvas?.addEventListener('mouseup', stopDrawing);
canvas?.addEventListener('mouseout', stopDrawing);

// ====================== События тач ======================
function initTouchEvents() {
    canvas?.addEventListener('touchstart', e => { e.preventDefault(); const pos = getTouchPos(canvas, e); startDrawing(pos.x, pos.y); }, { passive: false });
    canvas?.addEventListener('touchmove', e => { e.preventDefault(); if (!isDrawing) return; const pos = getTouchPos(canvas, e); draw(pos.x, pos.y); }, { passive: false });
    canvas?.addEventListener('touchend', e => { e.preventDefault(); stopDrawing(); }, { passive: false });
    canvas?.addEventListener('touchcancel', e => { e.preventDefault(); stopDrawing(); }, { passive: false });
}

// ====================== Resize ======================
function observeContainerResize() {
    const container = canvas?.parentElement;
    if (!container) return;
    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => setupCanvas());
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', setupCanvas);
    }
}

// ====================== Similarity ======================
// Инициализация progress bars с нулевыми значениями (без анимации)
function initSimilarityPercentages() {
    const similarityGrid = document.getElementById('similarityGrid');
    if (!similarityGrid) return;

    similarityGrid.innerHTML = '';
    
    // Создаем 10 элементов для цифр 0-9 с нулевыми значениями
    for (let i = 0; i < 10; i++) {
        const item = document.createElement('div');
        item.className = 'similarity-item';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'similarity-bar';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 0.8s ease-out';
        
        const percentageText = document.createElement('div');
        percentageText.className = 'similarity-percentage';
        percentageText.textContent = '0.0%';
        
        item.innerHTML = `
            <div class="similarity-digit">${i}</div>
            <div class="similarity-bar-container"></div>
        `;
        
        const container = item.querySelector('.similarity-bar-container');
        container.appendChild(progressBar);
        item.appendChild(percentageText);
        similarityGrid.appendChild(item);
    }
}

// Обновление progress bars с анимацией заполнения
function updateSimilarityPercentages(predictions) {
    const similarityGrid = document.getElementById('similarityGrid');
    if (!similarityGrid) return;

    if (!predictions || !Array.isArray(predictions)) {
        // Если нет данных, инициализируем заново с нулями
        initSimilarityPercentages();
        return;
    }

    // Сортируем по убыванию confidence для лучшего отображения
    const sortedPredictions = [...predictions].sort((a, b) => b.confidence - a.confidence);

    // Получаем все существующие progress bars
    const progressBars = [];
    const percentageTexts = [];
    const items = similarityGrid.querySelectorAll('.similarity-item');
    
    // Создаем маппинг цифр к элементам
    const digitToItem = new Map();
    items.forEach((item, index) => {
        const digit = parseInt(item.querySelector('.similarity-digit').textContent);
        digitToItem.set(digit, item);
    });
    
    // Обновляем значения для каждой цифры
    sortedPredictions.forEach(p => {
        const digit = p.digit;
        const item = digitToItem.get(digit);
        if (!item) return;
        
        let confidence = Math.max(0, Math.min(100, parseFloat(p.confidence) || 0));
        
        // Если confidence очень низкий (< 1%), устанавливаем декоративное значение от 1 до 10%
        if (confidence < 1) {
            confidence = Math.random() * 9 + 1; // Случайное значение от 1 до 10%
        }
        
        const progressBar = item.querySelector('.similarity-bar');
        const percentageText = item.querySelector('.similarity-percentage');
        
        if (progressBar && percentageText) {
            progressBars.push({ element: progressBar, target: confidence });
            percentageTexts.push({ element: percentageText, target: confidence });
        }
    });
    
    // Анимируем все progress bars одновременно
    requestAnimationFrame(() => {
        progressBars.forEach(({ element, target }) => {
            element.style.width = `${target.toFixed(1)}%`;
        });
        
        // Анимируем текст процентов
        let startTime = null;
        const duration = 800; // 0.8 секунды
        
        function animatePercentages(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            percentageTexts.forEach(({ element, target }) => {
                const currentValue = target * progress;
                element.textContent = `${currentValue.toFixed(1)}%`;
            });
            
            if (progress < 1) {
                requestAnimationFrame(animatePercentages);
            } else {
                // Устанавливаем финальные значения
                percentageTexts.forEach(({ element, target }) => {
                    element.textContent = `${target.toFixed(1)}%`;
                });
            }
        }
        
        requestAnimationFrame(animatePercentages);
    });
}

// ====================== Отправка данных на сервер ======================
recognizeBtn?.addEventListener('click', async () => {
    if (!canvas || !ctx || !resultText) return;
    const base64Image = canvas.toDataURL();
    let target = expectedNumberInput.value.trim() || null;

    if (target && !/^[0-9]$/.test(target)) { alert('Введите цифру 0-9'); expectedNumberInput.focus(); return; }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData.data.some(c => c > 0)) { alert('Нарисуйте цифру'); return; }

    recognizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Распознавание...';
    recognizeBtn.disabled = true;

    try {
        // Формируем JSON данные согласно README.md
        const requestData = {
            target: target ? parseInt(target) : null,
            image: base64Image,
            models: [currentModel] // Используем выбранную модель
        };

        console.log('Отправка данных на сервер:', {
            target: requestData.target,
            image: requestData.image.substring(0, 50) + '...',
            models: requestData.models
        });

        const response = await fetch("/api/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка сервера:', errorText);
            resultText.textContent = `Ошибка: ${response.status}`;
            updateSimilarityPercentages(null);
            throw new Error(`Сервер вернул статус ${response.status}: ${errorText.slice(0, 100)}`);
        }

        // Получаем JSON ответ от backend
        const result = await response.json();
        console.log('Получен ответ от сервера:', result);

        // Выводим результат распознавания
        if (result.digit !== undefined && result.digit !== null) {
            resultText.textContent = result.digit.toString();
        } else {
            resultText.textContent = "—";
        }

        // Обновляем progress bars с полученными данными (запускается анимация)
        if (result.predictions && Array.isArray(result.predictions)) {
            updateSimilarityPercentages(result.predictions);
        } else {
            console.warn('Неверный формат predictions:', result.predictions);
            // Сбрасываем к нулевым значениям
            initSimilarityPercentages();
        }

        // Сохраняем текущий рисунок
        currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Анимация успешного результата
        resultText.style.transition = 'all 0.5s ease';
        resultText.style.transform = 'scale(1.2)';
        resultText.style.color = '#38b2ac';
        setTimeout(() => {
            resultText.style.transform = 'scale(1)';
            resultText.style.color = '';
        }, 500);

    } catch (error) {
        console.error('Ошибка при распознавании:', error);
        resultText.textContent = "Ошибка";
        // Сбрасываем к нулевым значениям при ошибке
        initSimilarityPercentages();
        
        // Анимация ошибки
        resultText.style.transition = 'all 0.5s ease';
        resultText.style.transform = 'scale(1.2)';
        resultText.style.color = '#ff6b6b';
        setTimeout(() => {
            resultText.style.transform = 'scale(1)';
            resultText.style.color = '';
        }, 500);
    } finally {
        recognizeBtn.innerHTML = '<i class="fas fa-search"></i> Распознать';
        recognizeBtn.disabled = false;
    }
});

// ====================== Очистка ======================
eraseBtn?.addEventListener('click', () => {
    if (!ctx || !canvas) return;
    const container = canvas.parentElement;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,container.clientWidth, container.clientHeight);
    resultText.textContent = '—';
    currentDrawing = null;
    // Сбрасываем progress bars к нулевым значениям
    initSimilarityPercentages();
    expectedNumberInput.value = '';
});

// ====================== Input цифры ======================
expectedNumberInput?.addEventListener('input', e => {
    const value = e.target.value;
    if (value && !/^[0-9]$/.test(value)) e.target.value = value.slice(0,-1);
});
expectedNumberInput?.addEventListener('keypress', e => { if (e.key === 'Enter') recognizeBtn.click(); });

// ====================== Инициализация ======================
document.addEventListener('DOMContentLoaded', () => {
    setupCanvas();
    initTouchEvents();
    observeContainerResize();
    // Инициализируем progress bars с нулевыми значениями (без анимации)
    initSimilarityPercentages();
});
