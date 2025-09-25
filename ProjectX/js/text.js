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
        if (dropdown.classList.contains('show')) dropdown.classList.remove('show');
        if (variantsDropdown.classList.contains('show')) variantsDropdown.classList.remove('show');
    }
});

// Работа с холстом для рисования
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');

// Установка размеров холста
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Черный фон для холста
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Инициализация размеров холста
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Состояние процесса рисования
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Настройки инструмента рисования
ctx.lineWidth = 15;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#FFFFFF';

// Начало рисования
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Процесс рисования
function draw(e) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Завершение рисования
function stopDrawing() {
    isDrawing = false;
}

// Обработчики событий мыши
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Обработчики событий для сенсорных экранов
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// Обработка нажатия кнопки распознавания
recognizeBtn.addEventListener('click', async () => {
    try {
        // Получаем данные холста в формате base64
        const base64Image = canvas.toDataURL();

        // Получаем выбранную модель ИИ
        const modelSelect = document.getElementById('II_model-select');
        const model = modelSelect.value;

        // Получаем предполагаемую цифру
        const targetInput = document.getElementById('expected-number');
        let target = targetInput.value.trim();
        target = target === '' ? null : target;

        // Формируем данные для отправки
        const requestData = {
            image: base64Image,
            model: model,
            target: target
        };

        // Отправляем на бэкенд
        const response = await fetch("http://localhost:8080/api/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error("Ошибка при запросе к серверу");

        // Получаем результат от сервера
        const result = await response.json();

        // Отображаем распознанную цифру
        resultText.textContent = result.digit ?? "—";

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
        resultText.textContent = "Ошибка";
    }
});

// Обработка нажатия кнопки очистки
eraseBtn.addEventListener('click', () => {
    // Анимация очистки
    canvas.style.animation = 'eraseAnimation 0.5s forwards';

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.style.animation = '';
        resultText.textContent = '—';
    }, 500);
});
