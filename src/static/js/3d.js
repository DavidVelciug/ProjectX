// Переменные для Three.js
let scene, camera, renderer, cubes = [];
let cubeGroup, countersGroup, digitsGroup, animationInProgress = false;
let cubeStats = { empty: 0, low: 0, high: 0 };
let counterPositions = {};
let controls;
let animationPhase = 0;
let animationTime = 0;
let recognizedDigit = '0';

// Координаты счетчиков (можно менять)
const COUNTER_POSITIONS_CONFIG = {
    empty: { x: -12, y: -5, z: 5 },
    low: { x: 0, y: -5, z: 5 },
    high: { x: 12, y: -5, z: 5 }
};

// Координаты цифр (можно менять)
const DIGITS_POSITION_CONFIG = {
    xSpacing: 3.5,
    y: -8,
    z: 7
};

// Тексты этапов анимации (можно менять)
const STAGE_TEXTS = {
    init: "Инициализация анимации...",
    showCanvas: "Показ исходного изображения",
    prepare: "Подготовка к анализу",
    pixelize: "Разбивка на пиксели",
    analyze: "Анализ пикселей",
    sorting: "Сортировка пикселей по категориям",
    counting: "Подсчет результатов",
    result: "Результат распознавания: ",
    complete: "Анимация завершена. Управляйте камерой свободно."
};

// Параметры анимации (можно менять)
const ANIMATION_CONFIG = {
    totalTime: 20000,
    cameraPosition: { x: 0, y: 0, z: 25 },
    cubeSize: 0.3,
    cubeSpacing: 0.1,
    gridSize: 28,
    parabolaHeight: 2,
    rotationSpeed: 0.08,
    batchSize: 40,
    batchDelay: 50,
    flightSpeed: 2.5
};

// Функция для отображения видео-прелоадера
function showVideoPreloader() {
    const videoPreloader = document.getElementById('videoPreloader');
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const contentReveal = document.getElementById('contentReveal');
    const video = document.getElementById('preloaderVideo');

    videoPreloader.style.display = 'flex';

    if (video) {
        video.play().catch(error => {
            console.log('Video play error:', error);
        });
    }

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                if (contentReveal) {
                    contentReveal.classList.add('active');
                }
                setTimeout(() => {
                    videoPreloader.style.opacity = '0';
                    videoPreloader.style.visibility = 'hidden';
                }, 800);
            }, 300);
        }
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (loadingPercentage) {
            loadingPercentage.textContent = `${Math.round(progress)}%`;
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', showVideoPreloader);

// Управление цветовой темой интерфейса
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

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
}

// Управление выпадающими меню
const dropdownBtn = document.getElementById('dropdownBtn');
const variantsBtn = document.getElementById('variantsBtn');
const dropdownContent = document.getElementById('dropdownContent');
const variantsContent = document.getElementById('variantsContent');

// Текущая выбранная модель ИИ (по умолчанию CNN)
let currentModel = 'CNN';

// Элементы выпадающего списка моделей
const modelSelectBtn = document.getElementById('modelSelectBtn');
const modelDropdownContent = document.getElementById('modelDropdownContent');
const modelOptions = document.querySelectorAll('.model-option');

if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isShowing = dropdownContent.classList.contains('show');
        closeAllMenus();
        if (!isShowing) {
            dropdownContent.classList.add('show');
            dropdownBtn.classList.add('active');
        }
    });
}

if (variantsBtn) {
    variantsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isShowing = variantsContent.classList.contains('show');
        closeAllMenus();
        if (!isShowing) {
            variantsContent.classList.add('show');
            variantsBtn.classList.add('active');
        }
    });
}

// Управление выпадающим списком моделей
if (modelSelectBtn) {
    modelSelectBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isShowing = modelDropdownContent.classList.contains('show');
        
        closeAllMenus();
        
        if (!isShowing) {
            modelDropdownContent.classList.add('show');
        }
    });
}

// Обработка выбора модели
if (modelOptions) {
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
}

function closeAllMenus() {
    if (dropdownContent) dropdownContent.classList.remove('show');
    if (variantsContent) variantsContent.classList.remove('show');
    if (modelDropdownContent) modelDropdownContent.classList.remove('show');
    if (dropdownBtn) dropdownBtn.classList.remove('active');
    if (variantsBtn) variantsBtn.classList.remove('active');
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.model-dropdown')) {
        closeAllMenus();
    }
});

// Управление модальным окном с анимацией
const animationModal = document.getElementById('animationModal');
const animationModalClose = document.getElementById('animationModalClose');

function closeAnimationModal() {
    if (animationModal) {
        animationModal.classList.remove('active');
    }
    document.body.style.overflow = '';

    if (animationInProgress) {
        cancelAnimationFrame(animationInProgress);
        animationInProgress = false;
    }

    // Очищаем сцену
    if (scene) {
        if (cubeGroup && scene.children.includes(cubeGroup)) {
            scene.remove(cubeGroup);
        }
        if (countersGroup && scene.children.includes(countersGroup)) {
            scene.remove(countersGroup);
        }
        if (digitsGroup && scene.children.includes(digitsGroup)) {
            scene.remove(digitsGroup);
        }
        cubes = [];
    }
}

if (animationModalClose) {
    animationModalClose.addEventListener('click', closeAnimationModal);
}

if (animationModal) {
    animationModal.addEventListener('click', (e) => {
        if (e.target === animationModal) {
            closeAnimationModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && animationModal && animationModal.classList.contains('active')) {
        closeAnimationModal();
    }
});

// Обновление индикатора этапа анимации
function updateStageIndicator(stage) {
    const stageIndicator = document.getElementById('stageIndicator');
    const stageText = document.getElementById('stageText');

    if (stageIndicator && stageText) {
        stageText.textContent = stage;
    }
}

// Упрощенные easing-функции для производительности
const EasingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
};

// Инициализация Three.js сцены
function initThreeJS() {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found!');
        return;
    }

    // Очищаем контейнер
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Создаем сцену
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1c2e);

    // Создаем камеру с настройками из конфигурации
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(
        ANIMATION_CONFIG.cameraPosition.x,
        ANIMATION_CONFIG.cameraPosition.y,
        ANIMATION_CONFIG.cameraPosition.z
    );

    // Создаем рендерер с оптимизациями
    renderer = new THREE.WebGLRenderer({
        antialias: false, // Отключаем сглаживание для производительности
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Ограничиваем pixel ratio
    container.appendChild(renderer.domElement);

    // Добавляем OrbitControls для управления камерой
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI;

    // Включаем управление камерой с самого начала
    controls.enabled = true;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    // Группы объектов
    cubeGroup = new THREE.Group();
    countersGroup = new THREE.Group();
    digitsGroup = new THREE.Group();

    scene.add(cubeGroup);
    scene.add(countersGroup);
    scene.add(digitsGroup);

    // Инициализируем позиции счетчиков из конфигурации
    counterPositions = {
        empty: new THREE.Vector3(
            COUNTER_POSITIONS_CONFIG.empty.x,
            COUNTER_POSITIONS_CONFIG.empty.y,
            COUNTER_POSITIONS_CONFIG.empty.z
        ),
        low: new THREE.Vector3(
            COUNTER_POSITIONS_CONFIG.low.x,
            COUNTER_POSITIONS_CONFIG.low.y,
            COUNTER_POSITIONS_CONFIG.low.z
        ),
        high: new THREE.Vector3(
            COUNTER_POSITIONS_CONFIG.high.x,
            COUNTER_POSITIONS_CONFIG.high.y,
            COUNTER_POSITIONS_CONFIG.high.z
        )
    };

    window.addEventListener('resize', () => {
        if (container && camera && renderer) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });

    console.log('Three.js initialized successfully');
}

// Создание 3D счетчиков
function create3DCounters() {
    if (!countersGroup) return;

    // Очищаем предыдущие счетчики
    while (countersGroup.children.length > 0) {
        countersGroup.remove(countersGroup.children[0]);
    }

    const counterTypes = [
        { type: 'empty', label: 'Черное', color: 0x111111 },
        { type: 'low', label: 'Серое', color: 0x666666 },
        { type: 'high', label: 'Белое', color: 0xffffff }
    ];

    counterTypes.forEach((counter, index) => {
        const position = counterPositions[counter.type];
        if (!position) return;

        // Создаем текстовую метку для типа куба
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        context.fillStyle = '#38b2ac';
        context.font = 'bold 60px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(counter.label, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const labelGeometry = new THREE.PlaneGeometry(6, 3);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(position.x, position.y + 3.5, position.z + 1);
        countersGroup.add(label);

        // Создаем текстовый элемент для отображения числа
        const countCanvas = document.createElement('canvas');
        const countContext = countCanvas.getContext('2d');
        countCanvas.width = 256;
        countCanvas.height = 128;
        countContext.fillStyle = '#38b2ac';
        countContext.font = 'bold 80px Arial';
        countContext.textAlign = 'center';
        countContext.textBaseline = 'middle';
        countContext.fillText('0', countCanvas.width / 2, countCanvas.height / 2);

        const countTexture = new THREE.CanvasTexture(countCanvas);
        const countLabelMaterial = new THREE.MeshBasicMaterial({
            map: countTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const countLabelGeometry = new THREE.PlaneGeometry(2, 1);
        const countLabel = new THREE.Mesh(countLabelGeometry, countLabelMaterial);
        countLabel.position.set(position.x, position.y + 1.5, position.z + 1);
        countLabel.userData = { type: counter.type, canvas: countCanvas, context: countContext };
        countersGroup.add(countLabel);
    });
}

// Обновление счетчиков
function updateCounters() {
    countersGroup.children.forEach(child => {
        if (child.userData && child.userData.canvas) {
            const type = child.userData.type;
            const count = cubeStats[type] || 0;

            child.userData.context.clearRect(0, 0, child.userData.canvas.width, child.userData.canvas.height);
            child.userData.context.fillStyle = '#38b2ac';
            child.userData.context.font = 'bold 80px Arial';
            child.userData.context.textAlign = 'center';
            child.userData.context.textBaseline = 'middle';
            child.userData.context.fillText(count.toString(), child.userData.canvas.width / 2, child.userData.canvas.height / 2);

            child.material.map.needsUpdate = true;
        }
    });
}

// Создание 3D кубиков на основе изображения
function create3DCubesFromImage() {
    if (!cubeGroup) return;

    // Очищаем предыдущие кубики
    while (cubeGroup.children.length > 0) {
        cubeGroup.remove(cubeGroup.children[0]);
    }
    cubes = [];
    cubeStats = { empty: 0, low: 0, high: 0 };

    const gridSize = ANIMATION_CONFIG.gridSize;
    const spacing = ANIMATION_CONFIG.cubeSpacing;
    const cubeSize = ANIMATION_CONFIG.cubeSize;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = gridSize;
    tempCanvas.height = gridSize;

    // Рисуем изображение на временном canvas
    tempCtx.drawImage(drawingCanvas, 0, 0, gridSize, gridSize);
    const pixelData = tempCtx.getImageData(0, 0, gridSize, gridSize).data;

    // Используем один материал для каждого типа для оптимизации
    const emptyMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const lowMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const highMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    // Создаем геометрию один раз для оптимизации
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const idx = (y * gridSize + x) * 4;
            const r = pixelData[idx];
            const brightness = r;

            let material, cubeType;
            if (brightness > 200) {
                material = highMaterial;
                cubeType = 'high';
            } else if (brightness > 50) {
                material = lowMaterial;
                cubeType = 'low';
            } else {
                material = emptyMaterial;
                cubeType = 'empty';
            }

            const cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.x = (x - gridSize / 2) * (cubeSize + spacing);
            cube.position.y = (gridSize / 2 - y) * (cubeSize + spacing);
            cube.position.z = 0;

            // Сохраняем данные для анимации
            cube.userData = {
                originalPosition: cube.position.clone(),
                type: cubeType,
                targetPosition: counterPositions[cubeType].clone(),
                arrived: false,
                counted: false,
                alreadyCounted: false,
                batchIndex: Math.floor(Math.random() * 5), // УМЕНЬШЕНО количество партий для одновременного полета
                startTime: 0
            };

            cubeGroup.add(cube);
            cubes.push(cube);
        }
    }

    console.log('Cubes created:', cubes.length);
    updateCounters();
}

// Создание 3D цифр
function create3DDigits(digit) {
    if (!digitsGroup) return;

    while (digitsGroup.children.length > 0) {
        digitsGroup.remove(digitsGroup.children[0]);
    }

    // Создаем цифры от 0 до 9
    for (let i = 0; i < 10; i++) {
        const isHighlighted = i === parseInt(digit);

        // Создаем текстовую метку для цифры
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        // Все цифры изначально серые
        context.fillStyle = '#666666';
        context.font = 'bold 160px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(i.toString(), canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const digitMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const digitGeometry = new THREE.PlaneGeometry(3, 3);
        const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);

        // Позиционируем цифры в ряд внизу с настройками из конфигурации
        digitMesh.position.set(
            (i - 4.5) * DIGITS_POSITION_CONFIG.xSpacing,
            DIGITS_POSITION_CONFIG.y,
            DIGITS_POSITION_CONFIG.z
        );

        // Сохраняем данные для обновления цвета позже
        digitMesh.userData = {
            digit: i,
            canvas: canvas,
            context: context,
            material: digitMaterial,
            isHighlighted: isHighlighted
        };

        digitsGroup.add(digitMesh);
    }

    // УМЕНЬШЕНО время до подсветки распознанной цифры до 3 секунд
    setTimeout(() => {
        highlightRecognizedDigit(digit);
    }, 3000);
}

// Подсветка распознанной цифры
function highlightRecognizedDigit(digit) {
    digitsGroup.children.forEach(digitMesh => {
        const digitValue = digitMesh.userData.digit;
        const isHighlighted = digitValue === parseInt(digit);

        if (isHighlighted) {
            // Обновляем canvas для подсвеченной цифры
            digitMesh.userData.context.clearRect(0, 0, digitMesh.userData.canvas.width, digitMesh.userData.canvas.height);
            digitMesh.userData.context.fillStyle = '#38b2ac';
            digitMesh.userData.context.font = 'bold 160px Arial';
            digitMesh.userData.context.textAlign = 'center';
            digitMesh.userData.context.textBaseline = 'middle';
            digitMesh.userData.context.fillText(digitValue.toString(), digitMesh.userData.canvas.width / 2, digitMesh.userData.canvas.height / 2);

            // Обновляем текстуру
            digitMesh.userData.material.map.needsUpdate = true;
        }
    });
}

// Запуск 3D анимации
function start3DAnimation(digit) {
    if (!scene || !camera || !renderer) {
        console.error('Three.js not initialized!');
        return;
    }

    recognizedDigit = digit;
    animationPhase = 0;
    animationTime = 0;
    const totalAnimationTime = ANIMATION_CONFIG.totalTime;

    create3DCounters();

    // Инициализируем анимацию партиями
    let currentBatch = 0;
    let batches = Array.from({ length: 5 }, (_, i) =>
        cubes.filter(cube => cube.userData.batchIndex === i)
    );

    function animate() {
        if (!animationInProgress) return;

        animationInProgress = requestAnimationFrame(animate);
        animationTime += 16;
        const progress = Math.min(animationTime / totalAnimationTime, 1);

        // Фаза 1: Показ исходного холста (0-10%)
        if (progress < 0.1) {
            animationPhase = 0;
            cubeGroup.visible = true;
            countersGroup.visible = false;
            digitsGroup.visible = false;
            updateStageIndicator(STAGE_TEXTS.showCanvas);
        }
        // Фаза 2: Пауза после показа холста (10-15%)
        else if (progress < 0.15) {
            if (animationPhase < 1) {
                animationPhase = 1;
                updateStageIndicator(STAGE_TEXTS.prepare);
            }
        }
        // Фаза 3: Разбивка на кубы (15-20%)
        else if (progress < 0.2) {
            if (animationPhase < 2) {
                animationPhase = 2;
                updateStageIndicator(STAGE_TEXTS.pixelize);
            }
        }
        // Фаза 4: Пауза после разбивки (20-25%)
        else if (progress < 0.25) {
            if (animationPhase < 3) {
                animationPhase = 3;
                updateStageIndicator(STAGE_TEXTS.analyze);
            }
        }
        // Фаза 5: Полет кубиков к счетчикам (25-70%) - УСКОРЕН полет
        else if (progress < 0.7) {
            if (animationPhase < 4) {
                animationPhase = 4;
                countersGroup.visible = true;
                updateStageIndicator(STAGE_TEXTS.sorting);
            }

            const phaseProgress = (progress - 0.25) / 0.45;

            let cubesToCount = [];
            let arrivedCubes = 0;

            // Анимируем только активные партии для производительности
            const activeBatches = Math.min(currentBatch + 1, batches.length);

            for (let i = 0; i < activeBatches; i++) {
                const batch = batches[i];
                // УВЕЛИЧЕНА скорость активации партий
                const batchProgress = Math.min(phaseProgress * ANIMATION_CONFIG.flightSpeed - i * 0.15, 1);

                if (batchProgress > 0) {
                    batch.forEach(cube => {
                        if (!cube.userData.arrived) {
                            const startPos = cube.userData.originalPosition;
                            const endPos = cube.userData.targetPosition;

                            // Ускоренная анимация
                            const easedProgress = EasingFunctions.easeInOutCubic(batchProgress);

                            if (easedProgress < 1) {
                                // Быстрое движение
                                cube.position.lerpVectors(startPos, endPos, easedProgress);

                                // Меньшая параболическая траектория для более прямого полета
                                const parabolaHeight = ANIMATION_CONFIG.parabolaHeight;
                                const parabola = 4 * parabolaHeight * easedProgress * (1 - easedProgress);
                                cube.position.y += parabola;

                                // Ускоренное вращение
                                cube.rotation.x += ANIMATION_CONFIG.rotationSpeed;
                                cube.rotation.y += ANIMATION_CONFIG.rotationSpeed * 0.8;

                                // Собираем кубы для подсчета (уменьшено пороговое значение)
                                if (easedProgress > 0.6 && !cube.userData.counted) {
                                    cube.userData.counted = true;
                                    cubesToCount.push(cube);
                                }
                            } else {
                                cube.userData.arrived = true;
                                cube.position.copy(endPos);
                                arrivedCubes++;
                            }
                        } else {
                            arrivedCubes++;
                        }
                    });
                }
            }

            // Быстро активируем новые партии
            if (phaseProgress > currentBatch * 0.15 && currentBatch < batches.length - 1) {
                currentBatch++;
            }

            // Обновляем счетчики группами для производительности
            if (cubesToCount.length > 0) {
                // Обновляем статистику
                cubesToCount.forEach(cube => {
                    if (!cube.userData.alreadyCounted) {
                        cubeStats[cube.userData.type]++;
                        cube.userData.alreadyCounted = true;
                    }
                });

                // Обновляем счетчики не чаще чем раз в 50ms для более быстрого отображения
                if (animationTime % 50 < 16) {
                    updateCounters();
                }
            }

            // Обновляем текст этапа когда большинство кубов прибыло
            if (arrivedCubes > cubes.length * 0.9 && animationPhase === 4) {
                updateStageIndicator(STAGE_TEXTS.counting);
            }
        }
        // Фаза 6: Пауза после подсчета кубов (70-75%)
        else if (progress < 0.75) {
            if (animationPhase < 5) {
                animationPhase = 5;
                updateStageIndicator(STAGE_TEXTS.counting);
            }
        }
        // Фаза 7: Показ цифр (75-90%)
        else if (progress < 0.9) {
            if (animationPhase < 6) {
                animationPhase = 6;
                create3DDigits(recognizedDigit);
                digitsGroup.visible = true;
                updateStageIndicator(STAGE_TEXTS.result + recognizedDigit);
            }
        }
        // Фаза 8: Финальная пауза (90-100%)
        else {
            if (animationPhase < 7) {
                animationPhase = 7;
                updateStageIndicator(STAGE_TEXTS.complete);
            }
        }

        // Обновляем управление камерой
        controls.update();

        renderer.render(scene, camera);

        if (progress >= 1) {
            cancelAnimationFrame(animationInProgress);
            animationInProgress = false;
            // Включаем полное управление камерой после завершения анимации
            controls.enabled = true;
        }
    }

    animationInProgress = requestAnimationFrame(animate);
}

// Работа с холстом для рисования
const drawingCanvas = document.getElementById('drawing-canvas');
const drawingCtx = drawingCanvas ? drawingCanvas.getContext('2d') : null;
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentDrawing = null;

// Флаг для предотвращения рисования при выделении текста
let isTextSelected = false;

function setupCanvas() {
    if (!drawingCanvas || !drawingCtx) return;

    const container = drawingCanvas.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const oldContent = currentDrawing;

    drawingCanvas.width = containerWidth;
    drawingCanvas.height = containerHeight;
    drawingCanvas.style.width = containerWidth + 'px';
    drawingCanvas.style.height = containerHeight + 'px';

    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

    if (oldContent && oldContent.width > 0 && oldContent.height > 0) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = oldContent.width;
        tempCanvas.height = oldContent.height;
        tempCtx.putImageData(oldContent, 0, 0);
        drawingCtx.drawImage(tempCanvas, 0, 0, oldContent.width, oldContent.height, 0, 0, containerWidth, containerHeight);
    }

    currentDrawing = drawingCtx.getImageData(0, 0, containerWidth, containerHeight);
    const baseLineWidth = Math.max(8, Math.min(20, containerWidth / 25));
    drawingCtx.lineWidth = baseLineWidth;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    drawingCtx.strokeStyle = '#FFFFFF';
    drawingCtx.fillStyle = '#000';
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return { x, y };
}

function getTouchPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const touch = evt.touches[0] || evt.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x, y };
}

function startDrawing(x, y) {
    // Не начинаем рисование если выделен текст
    if (isTextSelected) return;
    
    isDrawing = true;
    [lastX, lastY] = [x, y];
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingCtx.beginPath();
    drawingCtx.arc(x, y, drawingCtx.lineWidth / 2, 0, Math.PI * 2);
    drawingCtx.fillStyle = drawingCtx.strokeStyle;
    drawingCtx.fill();
}

function draw(x, y) {
    if (!isDrawing || isTextSelected) return;
    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
}

if (drawingCanvas) {
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
}

function initTouchEvents() {
    if (!drawingCanvas) return;

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

function observeContainerResize() {
    const container = drawingCanvas ? drawingCanvas.parentElement : null;
    if (!container) return;

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    setupCanvas();
                }, 50);
            }
        });
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', handleWindowResize);
    }
}

let resizeTimeout;
function handleWindowResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        setupCanvas();
    }, 100);
}

// ОБНОВЛЕННАЯ функция для обновления процентов схожести
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
if (expectedNumberInput) {
    expectedNumberInput.addEventListener('input', function (e) {
        const value = e.target.value;
        if (value && !/^[0-9]$/.test(value)) {
            e.target.value = value.slice(0, -1);
        }
    });

    expectedNumberInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (recognizeBtn) recognizeBtn.click();
        }
    });
}

function create3DAnimation(digit) {
    if (!animationModal) return;

    animationModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Даем время для отображения модального окна перед инициализацией Three.js
    setTimeout(() => {
        initThreeJS();
        create3DCubesFromImage();
        start3DAnimation(digit);
    }, 100);
}

if (recognizeBtn) {
    recognizeBtn.addEventListener('click', async () => {
        try {
            const targetInput = document.getElementById('expected-number');
            let target = targetInput ? targetInput.value.trim() : null;
            target = target === '' ? null : target;

            if (target && !/^[0-9]$/.test(target)) {
                alert('Пожалуйста, введите цифру от 0 до 9');
                if (targetInput) targetInput.focus();
                return;
            }

            if (!drawingCtx) {
                alert('Холст не инициализирован');
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

            // Демо-режим (закомментируйте этот блок если есть бэкенд)
            const randomDigit = Math.floor(Math.random() * 10).toString();
            resultText.textContent = randomDigit;

            // Генерируем демо-предсказания
            const demoPredictions = Array.from({ length: 10 }, (_, i) => ({
                digit: i,
                confidence: i === parseInt(randomDigit) ? 85 + Math.random() * 15 : Math.random() * 30
            }));

            // Нормализуем проценты
            const total = demoPredictions.reduce((sum, p) => sum + p.confidence, 0);
            demoPredictions.forEach(p => p.confidence = (p.confidence / total) * 100);

            // Обновляем проценты схожести с анимацией
            updateSimilarityPercentages(demoPredictions, randomDigit);

            currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            create3DAnimation(randomDigit);

            resultText.style.transition = 'all 0.5s ease';
            resultText.style.transform = 'scale(1.2)';
            resultText.style.color = '#38b2ac';

            setTimeout(() => {
                resultText.style.transform = 'scale(1)';
                resultText.style.color = '';
            }, 500);

            const requestData = {
                image: drawingCanvas.toDataURL(),
                models: [currentModel],
                target: target
            };

            const response = await fetch("http://localhost:8000/api/recognize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error("Ошибка при запросе к серверу");

            const result = await response.json();
            const digit = result.digit ?? "—";
            resultText.textContent = digit;

            if (result.predictions) {
                updateSimilarityPercentages(result.predictions, digit);
            } else {
                updateSimilarityPercentages(null, digit);
            }

            currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            create3DAnimation(digit);

        } catch (error) {
            console.error("Ошибка:", error);
            const randomDigit = Math.floor(Math.random() * 10).toString();
            resultText.textContent = randomDigit;

            // Генерируем демо-предсказания при ошибке
            const demoPredictions = Array.from({ length: 10 }, (_, i) => ({
                digit: i,
                confidence: i === parseInt(randomDigit) ? 85 + Math.random() * 15 : Math.random() * 30
            }));

            // Нормализуем проценты
            const total = demoPredictions.reduce((sum, p) => sum + p.confidence, 0);
            demoPredictions.forEach(p => p.confidence = (p.confidence / total) * 100);

            updateSimilarityPercentages(demoPredictions, randomDigit);
            currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            create3DAnimation(randomDigit);

            resultText.style.transition = 'all 0.5s ease';
            resultText.style.transform = 'scale(1.2)';
            resultText.style.color = '#38b2ac';

            setTimeout(() => {
                resultText.style.transform = 'scale(1)';
                resultText.style.color = '';
            }, 500);
        } finally {
            recognizeBtn.innerHTML = '<i class="fas fa-search"></i> Распознать';
            recognizeBtn.disabled = false;
        }
    });
}

if (eraseBtn) {
    eraseBtn.addEventListener('click', () => {
        if (!drawingCanvas || !drawingCtx) return;

        drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';
        setTimeout(() => {
            const containerWidth = drawingCanvas.parentElement.offsetWidth;
            const containerHeight = drawingCanvas.parentElement.offsetHeight;
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            drawingCtx.fillStyle = '#000';
            drawingCtx.fillRect(0, 0, containerWidth, containerHeight);
            drawingCanvas.style.animation = '';
            if (resultText) resultText.textContent = '—';
            currentDrawing = null;
            if (expectedNumberInput) expectedNumberInput.value = '';
            const resetPredictions = Array.from({ length: 10 }, (_, i) => ({
                digit: i,
                confidence: 0
            }));
            updateSimilarityPercentages(resetPredictions, null);
        }, 500);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        setupCanvas();
        initTouchEvents();
        observeContainerResize();
        const initialPredictions = Array.from({ length: 10 }, (_, i) => ({
            digit: i,
            confidence: 0
        }));
        updateSimilarityPercentages(initialPredictions, null);
        if (expectedNumberInput) expectedNumberInput.focus();
    }, 100);
});