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

// Отображение основного меню
document.getElementById('dropdownBtn').addEventListener('click', function () {
    document.getElementById('dropdownContent').classList.toggle('show');
});

// Отображение меню вариантов
document.getElementById('variantsBtn').addEventListener('click', function () {
    document.getElementById('variantsContent').classList.toggle('show');
});

// Скрытие меню при клике вне области
window.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn')) {
        const dropdown = document.getElementById('dropdownContent');
        const variantsDropdown = document.getElementById('variantsContent');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
        if (variantsDropdown.classList.contains('show')) {
            variantsDropdown.classList.remove('show');
        }
    }
});

// Работа с холстами для рисования
const drawingCanvas = document.getElementById('drawing-canvas');
const resultCanvas = document.getElementById('result-canvas');
const drawingCtx = drawingCanvas.getContext('2d');
const resultCtx = resultCanvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');
const digit = document.getElementById('digit');

// Установка размеров холстов
function resizeCanvases() {
    const container = drawingCanvas.parentElement;
    drawingCanvas.width = container.offsetWidth;
    drawingCanvas.height = container.offsetHeight;
    resultCanvas.width = container.offsetWidth;
    resultCanvas.height = container.offsetHeight;

    // Черный фон для холстов
    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    resultCtx.fillStyle = '#000';
    resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);
}

// Инициализация размеров холстов
resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// Состояние процесса рисования
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Настройки инструмента рисования
drawingCtx.lineWidth = 15;
drawingCtx.lineCap = 'round';
drawingCtx.lineJoin = 'round';
drawingCtx.strokeStyle = '#FFFFFF';

// Начало рисования
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Процесс рисования
function draw(e) {
    if (!isDrawing) return;

    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(e.offsetX, e.offsetY);
    drawingCtx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Завершение рисования
function stopDrawing() {
    isDrawing = false;
}

// Обработчики событий мыши
drawingCanvas.addEventListener('mousedown', startDrawing);
drawingCanvas.addEventListener('mousemove', draw);
drawingCanvas.addEventListener('mouseup', stopDrawing);
drawingCanvas.addEventListener('mouseout', stopDrawing);

// Обработчики событий для сенсорных экранов
drawingCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    drawingCanvas.dispatchEvent(mouseEvent);
});

drawingCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    drawingCanvas.dispatchEvent(mouseEvent);
});

drawingCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    drawingCanvas.dispatchEvent(mouseEvent);
});

// Обработка нажатия кнопки распознавания
recognizeBtn.addEventListener('click', () => {
    // Демонстрационный результат
    const randomDigit = Math.floor(Math.random() * 10);

    // Очистка холста результата
    resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    resultCtx.fillStyle = '#000';
    resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

    // Отображение результата на холсте
    resultCtx.font = '120px Arial';
    resultCtx.fillStyle = '#38b2ac';
    resultCtx.textAlign = 'center';
    resultCtx.textBaseline = 'middle';
    resultCtx.fillText(randomDigit, resultCanvas.width / 2, resultCanvas.height / 2);

    // Обновление текстового результата
    resultText.textContent = randomDigit;
    digit.textContent = randomDigit;

    // Анимация результата
    resultText.style.transition = 'all 0.5s ease';
    resultText.style.transform = 'scale(1.2)';
    resultText.style.color = '#38b2ac';

    setTimeout(() => {
        resultText.style.transform = 'scale(1)';
        resultText.style.color = '';
    }, 500);
});

// Обработка нажатия кнопки очистки
eraseBtn.addEventListener('click', () => {
    // Анимация очистки
    drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';

    setTimeout(() => {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingCtx.fillStyle = '#000';
        drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

        resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
        resultCtx.fillStyle = '#000';
        resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

        drawingCanvas.style.animation = '';
        resultText.textContent = '';
        digit.textContent = '';
    }, 500);
});

