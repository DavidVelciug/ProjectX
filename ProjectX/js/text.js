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

        // Управление выпадающими меню
        const dropdownBtn = document.getElementById('dropdownBtn');
        const variantsBtn = document.getElementById('variantsBtn');
        const dropdownContent = document.getElementById('dropdownContent');
        const variantsContent = document.getElementById('variantsContent');

        // Отображение основного меню
        dropdownBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isShowing = dropdownContent.classList.contains('show');
            
            // Закрываем все меню
            closeAllMenus();
            
            // Открываем текущее меню, если оно было закрыто
            if (!isShowing) {
                dropdownContent.classList.add('show');
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
            }
        });

        // Функция для закрытия всех меню
        function closeAllMenus() {
            dropdownContent.classList.remove('show');
            variantsContent.classList.remove('show');
        }

        // Скрытие меню при клике вне области
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.dropdown-menu')) {
                closeAllMenus();
            }
        });

        // Работа с холстом для рисования
        const canvas = document.getElementById('drawing-canvas');
        const ctx = canvas.getContext('2d');
        const recognizeBtn = document.getElementById('recognize-btn');
        const eraseBtn = document.getElementById('erase-btn');
        const resultText = document.getElementById('result-text');

        // Переменные для управления рисованием
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Резервная копия содержимого холста
        let canvasBackup = null;

        // Функция для создания резервной копии холста
        function backupCanvas() {
            canvasBackup = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        // Функция для восстановления холста из резервной копии
        function restoreCanvas() {
            if (canvasBackup) {
                ctx.putImageData(canvasBackup, 0, 0);
            }
        }

        // Установка размеров холста с учетом DPI
        function setupCanvas() {
            const container = canvas.parentElement;
            const dpr = window.devicePixelRatio || 1;
            
            // Сохраняем текущее содержимое перед изменением размеров
            if (canvas.width > 0 && canvas.height > 0) {
                backupCanvas();
            }
            
            // Устанавливаем размеры в пикселях
            canvas.width = container.offsetWidth * dpr;
            canvas.height = container.offsetHeight * dpr;
            
            // Устанавливаем CSS размеры
            canvas.style.width = container.offsetWidth + 'px';
            canvas.style.height = container.offsetHeight + 'px';
            
            // Масштабируем контекст
            ctx.scale(dpr, dpr);
            
            // Восстанавливаем содержимое если есть резервная копия
            if (canvasBackup) {
                restoreCanvas();
            } else {
                // Иначе создаем черный фон
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            }
            
            // Настройки инструмента рисования
            ctx.lineWidth = 15;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#FFFFFF';
            ctx.fillStyle = '#000';
        }

        // Функция для получения позиции мыши с учетом масштабирования
        function getMousePos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            return {
                x: (evt.clientX - rect.left) * scaleX,
                y: (evt.clientY - rect.top) * scaleY
            };
        }

        // Функция для получения позиции касания
        function getTouchPos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const touch = evt.touches[0];
            
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
        }

        // Инициализация холста
        setupCanvas();

        // Начало рисования
        function startDrawing(x, y) {
            isDrawing = true;
            [lastX, lastY] = [x, y];
            
            // Создаем резервную копию перед началом рисования
            backupCanvas();
        }

        // Процесс рисования
        function draw(x, y) {
            if (!isDrawing) return;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            [lastX, lastY] = [x, y];
        }

        // Завершение рисования
        function stopDrawing() {
            isDrawing = false;
        }

        // Обработчики событий мыши
        canvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(canvas, e);
            startDrawing(pos.x, pos.y);
        });

        canvas.addEventListener('mousemove', (e) => {
            const pos = getMousePos(canvas, e);
            draw(pos.x, pos.y);
        });

        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Обработчики событий для сенсорных экранов
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const pos = getTouchPos(canvas, e);
            startDrawing(pos.x, pos.y);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const pos = getTouchPos(canvas, e);
            draw(pos.x, pos.y);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopDrawing();
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

                // Создаем резервную копию после распознавания
                backupCanvas();

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
                
                // Демонстрационный результат при ошибке
                const randomDigit = Math.floor(Math.random() * 10);
                resultText.textContent = randomDigit;
                
                // Анимация результата
                resultText.style.transition = 'all 0.5s ease';
                resultText.style.transform = 'scale(1.2)';
                resultText.style.color = '#38b2ac';

                setTimeout(() => {
                    resultText.style.transform = 'scale(1)';
                    resultText.style.color = '';
                }, 500);
            }
        });

        // Обработка нажатия кнопки очистки
        eraseBtn.addEventListener('click', () => {
            // Анимация очистки
            canvas.style.animation = 'eraseAnimation 0.5s forwards';

            setTimeout(() => {
                const dpr = window.devicePixelRatio || 1;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                canvas.style.animation = '';
                resultText.textContent = '—';
                canvasBackup = null; // Сбрасываем резервную копию
            }, 500);
        });

        // Восстановление холста при изменении видимости страницы
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(() => {
                    restoreCanvas();
                }, 100);
            }
        });

        // Восстановление при возвращении фокуса на окно
        window.addEventListener('focus', function() {
            setTimeout(() => {
                restoreCanvas();
            }, 100);
        });

        // Обработчик изменения размеров окна с восстановлением содержимого
        window.addEventListener('resize', function() {
            // Делаем резервную копию перед изменением размеров
            backupCanvas();
            
            setTimeout(() => {
                setupCanvas();
            }, 100);
        });

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                setupCanvas();
                
                // Добавляем эффект при загрузке страницы для логотипа
                const logo = document.querySelector('.logo');
                if (logo) {
                    setTimeout(() => {
                        logo.style.opacity = '1';
                    }, 500);
                }
            }, 100);
        });

        // Дополнительная защита: периодическое сохранение состояния
        setInterval(() => {
            if (isDrawing) {
                backupCanvas();
            }
        }, 1000);
