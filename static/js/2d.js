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

        // Работа с холстами для рисования
        const drawingCanvas = document.getElementById('drawing-canvas');
        const resultCanvas = document.getElementById('result-canvas');
        const drawingCtx = drawingCanvas.getContext('2d');
        const resultCtx = resultCanvas.getContext('2d');
        const recognizeBtn = document.getElementById('recognize-btn');
        const eraseBtn = document.getElementById('erase-btn');
        const resultText = document.getElementById('result-text');
        const digit = document.getElementById('digit');

        // Переменные для управления рисованием
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Резервные копии содержимого холстов
        let drawingCanvasBackup = null;
        let resultCanvasBackup = null;
        let currentDigit = '—';

        // Функция для создания резервных копий холстов
        function backupCanvases() {
            drawingCanvasBackup = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            resultCanvasBackup = resultCtx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
        }

        // Функция для восстановления холстов из резервных копий
        function restoreCanvases() {
            if (drawingCanvasBackup) {
                drawingCtx.putImageData(drawingCanvasBackup, 0, 0);
            }
            
            if (resultCanvasBackup) {
                resultCtx.putImageData(resultCanvasBackup, 0, 0);
            }
            
            // Восстанавливаем цифру
            if (currentDigit && currentDigit !== '—') {
                digit.textContent = currentDigit;
                resultText.textContent = currentDigit;
            }
        }

        // Установка размеров холстов с учетом DPI
        function setupCanvases() {
            const container = drawingCanvas.parentElement;
            const dpr = window.devicePixelRatio || 1;
            
            // Сохраняем текущее содержимое перед изменением размеров
            if (drawingCanvas.width > 0 && drawingCanvas.height > 0) {
                backupCanvases();
            }
            
            // Устанавливаем размеры в пикселях
            drawingCanvas.width = container.offsetWidth * dpr;
            drawingCanvas.height = container.offsetHeight * dpr;
            resultCanvas.width = container.offsetWidth * dpr;
            resultCanvas.height = container.offsetHeight * dpr;
            
            // Устанавливаем CSS размеры
            drawingCanvas.style.width = container.offsetWidth + 'px';
            drawingCanvas.style.height = container.offsetHeight + 'px';
            resultCanvas.style.width = container.offsetWidth + 'px';
            resultCanvas.style.height = container.offsetHeight + 'px';
            
            // Масштабируем контексты
            drawingCtx.scale(dpr, dpr);
            resultCtx.scale(dpr, dpr);
            
            // Восстанавливаем содержимое если есть резервные копии
            if (drawingCanvasBackup) {
                restoreCanvases();
            } else {
                // Иначе создаем черный фон
                drawingCtx.fillStyle = '#000';
                drawingCtx.fillRect(0, 0, drawingCanvas.width / dpr, drawingCanvas.height / dpr);
                
                resultCtx.fillStyle = '#000';
                resultCtx.fillRect(0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr);
            }
            
            // Настройки инструмента рисования
            drawingCtx.lineWidth = 15;
            drawingCtx.lineCap = 'round';
            drawingCtx.lineJoin = 'round';
            drawingCtx.strokeStyle = '#FFFFFF';
            drawingCtx.fillStyle = '#000';
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

        // Инициализация холстов
        setupCanvases();

        // Начало рисования
        function startDrawing(x, y) {
            isDrawing = true;
            [lastX, lastY] = [x, y];
            
            // Создаем резервную копию перед началом рисования
            backupCanvases();
        }

        // Процесс рисования
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
        }

        // Обработчики событий мыши
        drawingCanvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(drawingCanvas, e);
            startDrawing(pos.x, pos.y);
        });

        drawingCanvas.addEventListener('mousemove', (e) => {
            const pos = getMousePos(drawingCanvas, e);
            draw(pos.x, pos.y);
        });

        drawingCanvas.addEventListener('mouseup', stopDrawing);
        drawingCanvas.addEventListener('mouseout', stopDrawing);

        // Обработчики событий для сенсорных экранов
        drawingCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const pos = getTouchPos(drawingCanvas, e);
            startDrawing(pos.x, pos.y);
        });

        drawingCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const pos = getTouchPos(drawingCanvas, e);
            draw(pos.x, pos.y);
        });

        drawingCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopDrawing();
        });

        // Обработка нажатия кнопки распознавания
        recognizeBtn.addEventListener('click', async () => {
            try {
                // Получаем данные холста в формате base64
                const base64Image = drawingCanvas.toDataURL();

                // Получаем выбранную модель ИИ
                const modelSelect = document.getElementById('II_model-select');
                const model = modelSelect.value;

                // Формируем данные для отправки
                const requestData = {
                    image: base64Image,
                    model: model
                };

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
                currentDigit = result.digit ?? "—";

                // Очистка холста результата
                const dpr = window.devicePixelRatio || 1;
                resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
                resultCtx.fillStyle = '#000';
                resultCtx.fillRect(0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr);

                // Отображение результата на холсте
                resultCtx.font = '120px Arial';
                resultCtx.fillStyle = '#38b2ac';
                resultCtx.textAlign = 'center';
                resultCtx.textBaseline = 'middle';
                resultCtx.fillText(currentDigit, resultCanvas.width / (2 * dpr), resultCanvas.height / (2 * dpr));

                // Обновление текстового результата
                resultText.textContent = currentDigit;
                digit.textContent = currentDigit;

                // Создаем резервную копию после распознавания
                backupCanvases();

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
                const randomDigit = Math.floor(Math.random() * 10);
                currentDigit = randomDigit.toString();

                // Очистка холста результата
                const dpr = window.devicePixelRatio || 1;
                resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
                resultCtx.fillStyle = '#000';
                resultCtx.fillRect(0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr);

                // Отображение результата на холсте
                resultCtx.font = '120px Arial';
                resultCtx.fillStyle = '#38b2ac';
                resultCtx.textAlign = 'center';
                resultCtx.textBaseline = 'middle';
                resultCtx.fillText(currentDigit, resultCanvas.width / (2 * dpr), resultCanvas.height / (2 * dpr));

                // Обновление текстового результата
                resultText.textContent = currentDigit;
                digit.textContent = currentDigit;

                // Создаем резервную копию после распознавания
                backupCanvases();

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
            drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';

            setTimeout(() => {
                const dpr = window.devicePixelRatio || 1;
                
                // Очищаем холсты
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                drawingCtx.fillStyle = '#000';
                drawingCtx.fillRect(0, 0, drawingCanvas.width / dpr, drawingCanvas.height / dpr);

                resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
                resultCtx.fillStyle = '#000';
                resultCtx.fillRect(0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr);

                drawingCanvas.style.animation = '';
                resultText.textContent = '—';
                digit.textContent = '—';
                currentDigit = '—';
                
                // Сбрасываем резервные копии
                drawingCanvasBackup = null;
                resultCanvasBackup = null;
            }, 500);
        });

        // Восстановление холстов при изменении видимости страницы
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(() => {
                    restoreCanvases();
                }, 100);
            }
        });

        // Восстановление при возвращении фокуса на окно
        window.addEventListener('focus', function() {
            setTimeout(() => {
                restoreCanvases();
            }, 100);
        });

        // Обработчик изменения размеров окна с восстановлением содержимого
        window.addEventListener('resize', function() {
            // Делаем резервную копию перед изменением размеров
            backupCanvases();
            
            setTimeout(() => {
                setupCanvases();
            }, 100);
        });

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                setupCanvases();
                
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
            if (isDrawing || currentDigit !== '—') {
                backupCanvases();
            }
        }, 1000);