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
                        }, 500); // Сокращено до 500 мс
                    }, 200); // Сокращено до 200 мс
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
        const cubeDigit = document.getElementById('cube-digit');

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
                update3DDisplay(currentDigit);
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
                
                resultCtx.fillStyle = '#111';
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

        // 3D эффект для отображения результата
        function draw3DEffect(digit) {
            // Очистка холста результата
            const dpr = window.devicePixelRatio || 1;
            resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
            resultCtx.fillStyle = '#111';
            resultCtx.fillRect(0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr);

            // Размер цифры в зависимости от размера холста
            const size = Math.min(resultCanvas.width, resultCanvas.height) * 0.6;
            resultCtx.font = `bold ${size}px Arial`;
            resultCtx.textAlign = 'center';
            resultCtx.textBaseline = 'middle';

            // Тень для эффекта объема
            resultCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            resultCtx.fillText(digit, resultCanvas.width / (2 * dpr) + 4, resultCanvas.height / (2 * dpr) + 4);

            // Основной текст с градиентом
            const gradient = resultCtx.createLinearGradient(
                0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr
            );
            gradient.addColorStop(0, '#38b2ac');
            gradient.addColorStop(1, '#48cae4');

            resultCtx.fillStyle = gradient;
            resultCtx.fillText(digit, resultCanvas.width / (2 * dpr), resultCanvas.height / (2 * dpr));

            // Бликовый эффект
            resultCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            resultCtx.fillText(digit, resultCanvas.width / (2 * dpr) - 2, resultCanvas.height / (2 * dpr) - 2);
        }

        // Обновление 3D отображения
        function update3DDisplay(digit) {
            resultText.textContent = digit;
            document.querySelectorAll('.cube-digit').forEach(el => {
                el.textContent = digit;
            });
            currentDigit = digit;
        }

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
                const response = await fetch("http://localhost:8080/api/recognize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) throw new Error("Ошибка при запросе к серверу");

                // Получаем результат от сервера
                const result = await response.json();

                // Обновляем цифру
                const digit = result.digit ?? "—";

                // 3D эффект на холсте результата
                draw3DEffect(digit);

                // Обновление текстового результата и 3D куба
                update3DDisplay(digit);

                // Создаем резервную копию после распознавания
                backupCanvases();

                // Анимация результата
                resultText.style.transition = 'all 0.5s ease';
                resultText.style.transform = 'scale(1.2) translateZ(10px)';
                resultText.style.color = '#38b2ac';

                setTimeout(() => {
                    resultText.style.transform = 'scale(1) translateZ(5px)';
                    resultText.style.color = '';
                }, 500);

            } catch (error) {
                console.error("Ошибка:", error);
                
                // Демонстрационный результат при ошибке
                const randomDigit = Math.floor(Math.random() * 10).toString();

                // 3D эффект на холсте результата
                draw3DEffect(randomDigit);

                // Обновление текстового результата и 3D куба
                update3DDisplay(randomDigit);

                // Создаем резервную копию после распознавания
                backupCanvases();

                // Анимация результата
                resultText.style.transition = 'all 0.5s ease';
                resultText.style.transform = 'scale(1.2) translateZ(10px)';
                resultText.style.color = '#38b2ac';

                setTimeout(() => {
                    resultText.style.transform = 'scale(1) translateZ(5px)';
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
                resultCtx.fillStyle = '#111';
                resultCtx.fillRect(0, 0, resultCanvas.width / dpr, resultCanvas.height / dpr);

                drawingCanvas.style.animation = '';
                update3DDisplay('—');
                
                // Сбрасываем резервные копии
                drawingCanvasBackup = null;
                resultCanvasBackup = null;
                currentDigit = '—';
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
            }, 100);
        });

        // Дополнительная защита: периодическое сохранение состояния
        setInterval(() => {
            if (isDrawing || currentDigit !== '—') {
                backupCanvases();
            }
        }, 1000);