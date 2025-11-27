document.addEventListener('DOMContentLoaded', function () {
    // конфигурация перцептрона
    const config = {
        inputNeurons: 784,
        outputNeurons: 11,
        // количество видимых нейронов (для производительности)
        visualInputNeurons: 25,
        visualOutputNeurons: 11
    };

    // элементы
    const inputLayer = document.getElementById('input-layer');
    const outputLayer = document.getElementById('output-layer');
    const biasContainer = document.getElementById('bias-container');
    const connectionsContainer = document.getElementById('connections');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const stepBtn = document.getElementById('stepBtn');
    const backBtn = document.getElementById('backBtn');
    const status = document.getElementById('status');
    const progressBar = document.getElementById('progress-bar');
    const stepsList = document.getElementById('steps-list');
    const completionMessage = document.getElementById('completionMessage');

    // состояние анимации
    let isAnimating = false;
    let currentStep = 0;
    let animationTimeouts = [];
    let neuronConnections = new Map();
    let recognizedDigit = null;
    let predictions = [];

    // применяем тему из localStorage
    function applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    // получаем распознанную цифру и предсказания из localStorage
    function getRecognitionData() {
        recognizedDigit = localStorage.getItem('recognizedDigit') || '5';
        try {
            predictions = JSON.parse(localStorage.getItem('predictions') || '[]');
        } catch (e) {
            predictions = [];
        }
    }

    // создаем нейроны
    function createNeurons() {
        // входной слой
        createLayerNeurons(inputLayer, 'input', config.visualInputNeurons, config.inputNeurons);

        // выходной слой
        createLayerNeurons(outputLayer, 'output', config.visualOutputNeurons, config.outputNeurons);

        // bias нейрон
        createBiasNeuron();
    }

    function createLayerNeurons(container, layerType, visualCount, totalCount) {
        const neuronsToShow = Math.min(visualCount, totalCount);

        for (let i = 0; i < neuronsToShow; i++) {
            // если это предпоследний нейрон и есть скрытые нейроны, добавляем троеточие
            if (i === neuronsToShow - 1 && totalCount > visualCount) {
                const dots = document.createElement('div');
                dots.className = 'dots';
                dots.textContent = '...';
                container.appendChild(dots);

                const remaining = document.createElement('div');
                remaining.className = 'remaining-neurons';
                remaining.textContent = `+${totalCount - visualCount} нейронов`;
                container.appendChild(remaining);
            }

            const neuron = document.createElement('div');
            neuron.className = `neuron ${layerType}`;
            neuron.dataset.layer = layerType;
            neuron.dataset.index = i;
            neuron.id = `${layerType}-${i}`;
            container.appendChild(neuron);

            // добавляем подписи для нейронов
            addNeuronLabel(neuron, layerType, i, neuronsToShow, totalCount);
        }
    }

    function addNeuronLabel(neuron, layerType, index, neuronsToShow, totalCount) {
        const label = document.createElement('div');
        label.className = 'neuron-label';

        if (layerType === 'input') {
            label.className += ' input-neuron-label';
            if (index === neuronsToShow - 1 && totalCount > neuronsToShow) {
                label.textContent = 'x783';
            } else if (index === neuronsToShow - 1) {
                label.textContent = 'x783';
            } else {
                label.textContent = `x${index}`;
            }
        } else if (layerType === 'output') {
            label.className += ' output-neuron-label';
            if (index === neuronsToShow - 1) {
                label.textContent = 'y';
            } else {
                label.textContent = `${index}`;
            }
        }

        neuron.appendChild(label);
    }

    function createBiasNeuron() {
        const bias = document.createElement('div');
        bias.className = 'neuron bias';
        bias.id = 'bias-neuron';
        bias.dataset.layer = 'bias';
        biasContainer.appendChild(bias);
    }

    // создаем связи - прямые связи от input к output
    function createConnections() {
        const layers = [
            {
                element: inputLayer,
                type: 'input',
                neurons: inputLayer.querySelectorAll('.neuron')
            },
            {
                element: outputLayer,
                type: 'output',
                neurons: outputLayer.querySelectorAll('.neuron')
            }
        ];

        const biasNeuron = document.getElementById('bias-neuron');

        // инициализируем карту связей
        layers.forEach(layer => {
            layer.neurons.forEach(neuron => {
                neuronConnections.set(neuron.id, []);
            });
        });
        neuronConnections.set(biasNeuron.id, []);

        // связи от input к output
        createLayerConnections(layers[0], layers[1]);

        // связи от bias ко всем нейронам output
        createBiasConnections(biasNeuron, layers[1]);
    }

    function createLayerConnections(fromLayer, toLayer) {
        fromLayer.neurons.forEach((fromNeuron, fromIndex) => {
            toLayer.neurons.forEach((toNeuron, toIndex) => {
                createConnection(fromNeuron, toNeuron);
                neuronConnections.get(fromNeuron.id).push(toNeuron.id);
            });
        });
    }

    function createBiasConnections(biasNeuron, toLayer) {
        toLayer.neurons.forEach((toNeuron, toIndex) => {
            createConnection(biasNeuron, toNeuron);
            neuronConnections.get(biasNeuron.id).push(toNeuron.id);
        });
    }

    function createConnection(fromNeuron, toNeuron) {
        const connection = document.createElement('div');
        connection.className = 'connection';
        connection.dataset.from = fromNeuron.id;
        connection.dataset.to = toNeuron.id;
        connection.dataset.fromLayer = fromNeuron.dataset.layer;
        connection.dataset.toLayer = toNeuron.dataset.layer;

        connectionsContainer.appendChild(connection);
    }

    // функция для обновления позиций связей
    function updateConnectionPositions() {
        const connections = document.querySelectorAll('.connection');

        connections.forEach(connection => {
            const fromId = connection.dataset.from;
            const toId = connection.dataset.to;

            const fromNeuron = document.getElementById(fromId);
            const toNeuron = document.getElementById(toId);

            if (!fromNeuron || !toNeuron) return;

            const fromRect = fromNeuron.getBoundingClientRect();
            const toRect = toNeuron.getBoundingClientRect();
            const containerRect = connectionsContainer.getBoundingClientRect();

            const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
            const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
            const x2 = toRect.left + toRect.width / 2 - containerRect.left;
            const y2 = toRect.top + toRect.height / 2 - containerRect.top;

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            connection.style.width = `${length}px`;
            connection.style.left = `${x1}px`;
            connection.style.top = `${y1}px`;
            connection.style.transform = `rotate(${angle}deg)`;
        });
    }

    function updateStepHighlight(stepIndex) {
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.remove('active');
        });

        if (stepIndex >= 0 && stepIndex < 3) {
            document.getElementById(`step-${stepIndex + 1}`).classList.add('active');
        }
    }

    // функции анимации
    function startAnimation() {
        if (isAnimating) return;

        isAnimating = true;
        updateButtonStates();
        resetAnimation();
        completionMessage.classList.remove('active');

        animateSequentially();
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
    }

    function animateSequentially() {
        status.textContent = "запуск анимации...";
        updateProgress(0);
        updateStepHighlight(0);

        // сначала активируем входной слой
        activateInputLayer()
            .then(() => {
                updateProgress(33);
                updateStepHighlight(1);
                // активируем bias нейрон
                return activateBiasNeuron('bias-neuron', "активация bias нейрона...");
            })
            .then(() => {
                updateProgress(66);
                updateStepHighlight(2);
                // затем активируем связи к output и появляются нейроны output
                return activateConnectionsAndNeurons(['input', 'bias'], 'output', "активация связей к выходному слою...");
            })
            .then(() => {
                updateProgress(100);
                updateStepHighlight(3);
                // подсвечиваем распознанную цифру в выходном слое
                highlightRecognizedDigit();

                // завершение
                isAnimating = false;
                updateButtonStates();
                status.textContent = "анимация завершена! все слои активированы.";

                // показываем сообщение о завершении
                setTimeout(() => {
                    completionMessage.classList.add('active');
                }, 1000);
            })
            .catch((error) => {
                console.error('ошибка анимации:', error);
                isAnimating = false;
                updateButtonStates();
                status.textContent = "ошибка анимации";
            });
    }

    function activateInputLayer() {
        return new Promise((resolve) => {
            status.textContent = "активация входного слоя...";

            const inputNeurons = inputLayer.querySelectorAll('.neuron.input');
            let activatedCount = 0;

            inputNeurons.forEach((neuron, index) => {
                animationTimeouts.push(setTimeout(() => {
                    // случайным образом делаем некоторые нейроны полупрозрачными
                    if (Math.random() < 0.3) {
                        neuron.classList.add('semi-active');
                    } else {
                        neuron.classList.add('active');
                    }
                    activatedCount++;

                    if (activatedCount === inputNeurons.length) {
                        animationTimeouts.push(setTimeout(resolve, 500));
                    }
                }, index * 50));
            });
        });
    }

    function activateBiasNeuron(biasId, message) {
        return new Promise((resolve) => {
            status.textContent = message;

            const biasNeuron = document.getElementById(biasId);
            if (biasNeuron) {
                animationTimeouts.push(setTimeout(() => {
                    biasNeuron.classList.add('active');
                    animationTimeouts.push(setTimeout(resolve, 300));
                }, 100));
            } else {
                animationTimeouts.push(setTimeout(resolve, 100));
            }
        });
    }

    function activateConnectionsAndNeurons(fromLayerTypes, toLayerType, message) {
        return new Promise((resolve) => {
            status.textContent = message;

            let connections = [];
            fromLayerTypes.forEach(fromLayerType => {
                if (fromLayerType === 'bias') {
                    const biasConnections = document.querySelectorAll('.connection[data-from="bias-neuron"][data-to-layer="output"]');
                    connections = connections.concat(Array.from(biasConnections));
                } else {
                    const layerConnections = document.querySelectorAll(`.connection[data-from-layer="${fromLayerType}"][data-to-layer="${toLayerType}"]`);
                    connections = connections.concat(Array.from(layerConnections));
                }
            });

            const activatedNeurons = new Set();
            let activatedConnections = 0;

            if (connections.length === 0) {
                animationTimeouts.push(setTimeout(resolve, 100));
                return;
            }

            connections.forEach((connection, index) => {
                animationTimeouts.push(setTimeout(() => {
                    // случайным образом делаем некоторые связи полупрозрачными
                    if (Math.random() < 0.4) {
                        connection.classList.add('semi-active');
                    } else {
                        connection.classList.add('active');
                    }
                    activatedConnections++;

                    const toNeuronId = connection.dataset.to;
                    const toNeuron = document.getElementById(toNeuronId);

                    if (toNeuron && !activatedNeurons.has(toNeuronId) && toNeuron.dataset.layer === toLayerType) {
                        activatedNeurons.add(toNeuronId);
                        // для выходного слоя не делаем полупрозрачными
                        if (toLayerType === 'output') {
                            toNeuron.classList.add('active');
                        } else {
                            // случайным образом делаем некоторые нейроны полупрозрачными
                            if (Math.random() < 0.3) {
                                toNeuron.classList.add('semi-active');
                            } else {
                                toNeuron.classList.add('active');
                            }
                        }
                    }

                    if (activatedConnections === connections.length) {
                        animationTimeouts.push(setTimeout(resolve, 500));
                    }
                }, index * 10));
            });
        });
    }

    function highlightRecognizedDigit() {
        const outputNeurons = outputLayer.querySelectorAll('.neuron.output');

        if (recognizedDigit && outputNeurons.length > recognizedDigit) {
            const recognizedNeuron = outputNeurons[recognizedDigit];
            if (recognizedNeuron) {
                recognizedNeuron.classList.add('recognized');
                status.textContent = `распознанная цифра: ${recognizedDigit}`;
            }
        }
    }

    function stepAnimation() {
        if (isAnimating) return;

        const steps = [
            { action: 'activateInput', message: 'активация входного слоя' },
            { action: 'activateBias', message: 'активация bias нейрона' },
            { action: 'activateToOutput', message: 'активация связей к выходному слою' }
        ];

        if (currentStep >= steps.length) {
            resetAnimation();
            currentStep = 0;
            status.textContent = "анимация сброшена";
            updateProgress(0);
            updateStepHighlight(-1);
            completionMessage.classList.remove('active');
            return;
        }

        const step = steps[currentStep];
        status.textContent = `шаг ${currentStep + 1}: ${step.message}`;
        updateProgress((currentStep + 1) * (100 / steps.length));
        updateStepHighlight(currentStep);

        switch (step.action) {
            case 'activateInput':
                activateInputLayerImmediate();
                break;
            case 'activateBias':
                activateBiasNeuronImmediate('bias-neuron');
                break;
            case 'activateToOutput':
                activateConnectionsAndNeuronsImmediate(['input', 'bias'], 'output');
                break;
        }

        currentStep++;

        if (currentStep >= steps.length) {
            // подсвечиваем распознанную цифру в выходном слое
            highlightRecognizedDigit();

            status.textContent = "все шаги завершены!";
            updateProgress(100);
            updateStepHighlight(3);
            completionMessage.classList.add('active');
        }
    }

    function activateInputLayerImmediate() {
        const inputNeurons = inputLayer.querySelectorAll('.neuron.input');
        inputNeurons.forEach(neuron => {
            // случайным образом делаем некоторые нейроны полупрозрачными
            if (Math.random() < 0.3) {
                neuron.classList.add('semi-active');
            } else {
                neuron.classList.add('active');
            }
        });
    }

    function activateBiasNeuronImmediate(biasId) {
        const biasNeuron = document.getElementById(biasId);
        if (biasNeuron) {
            biasNeuron.classList.add('active');
        }
    }

    function activateConnectionsAndNeuronsImmediate(fromLayerTypes, toLayerType) {
        let connections = [];
        fromLayerTypes.forEach(fromLayerType => {
            if (fromLayerType === 'bias') {
                const biasConnections = document.querySelectorAll('.connection[data-from="bias-neuron"][data-to-layer="output"]');
                connections = connections.concat(Array.from(biasConnections));
            } else {
                const layerConnections = document.querySelectorAll(`.connection[data-from-layer="${fromLayerType}"][data-to-layer="${toLayerType}"]`);
                connections = connections.concat(Array.from(layerConnections));
            }
        });

        const activatedNeurons = new Set();

        connections.forEach(connection => {
            // случайным образом делаем некоторые связи полупрозрачными
            if (Math.random() < 0.4) {
                connection.classList.add('semi-active');
            } else {
                connection.classList.add('active');
            }

            const toNeuronId = connection.dataset.to;
            const toNeuron = document.getElementById(toNeuronId);

            if (toNeuron && !activatedNeurons.has(toNeuronId) && toNeuron.dataset.layer === toLayerType) {
                activatedNeurons.add(toNeuronId);
                // для выходного слоя не делаем полупрозрачными
                if (toLayerType === 'output') {
                    toNeuron.classList.add('active');
                } else {
                    // случайным образом делаем некоторые нейроны полупрозрачными
                    if (Math.random() < 0.3) {
                        toNeuron.classList.add('semi-active');
                    } else {
                        toNeuron.classList.add('active');
                    }
                }
            }
        });
    }

    function resetAnimation() {
        animationTimeouts.forEach(timeout => clearTimeout(timeout));
        animationTimeouts = [];

        const neurons = document.querySelectorAll('.neuron');
        const connections = document.querySelectorAll('.connection');

        neurons.forEach(neuron => {
            neuron.classList.remove('active');
            neuron.classList.remove('semi-active');
            neuron.classList.remove('recognized');
        });

        connections.forEach(conn => {
            conn.classList.remove('active');
            conn.classList.remove('semi-active');
        });

        currentStep = 0;
        isAnimating = false;
        updateButtonStates();
        status.textContent = "готов к работе";
        updateProgress(0);
        updateStepHighlight(-1);
        completionMessage.classList.remove('active');
    }

    function updateButtonStates() {
        startBtn.disabled = isAnimating;
        stepBtn.disabled = isAnimating;
        resetBtn.disabled = isAnimating;
        // кнопка "вернуться" всегда активна
        backBtn.disabled = false;
    }

    // функция для возврата на главную страницу
    function returnToMainPage() {
        try {
            // пытаемся закрыть текущую вкладку/окно
            window.close();

            // если не получилось закрыть, пробуем вернуться назад в истории
            setTimeout(() => {
                if (!window.closed) {
                    // пытаемся вернуться на предыдущую страницу
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        // если истории нет, предлагаем закрыть вручную
                        alert('пожалуйста, закройте эту вкладку вручную или вернитесь к 2D рисованию цифр.');
                    }
                }
            }, 100);
        } catch (error) {
            console.error('ошибка при возврате:', error);
            alert('пожалуйста, закройте эту вкладку вручную и вернитесь к 2D рисованию цифр.');
        }
    }

    // обработчики событий
    startBtn.addEventListener('click', startAnimation);
    resetBtn.addEventListener('click', resetAnimation);
    stepBtn.addEventListener('click', stepAnimation);
    backBtn.addEventListener('click', returnToMainPage);

    // инициализация
    applyTheme();
    getRecognitionData();
    createNeurons();
    setTimeout(() => {
        createConnections();
        // обновляем позиции связей после создания
        updateConnectionPositions();
    }, 100);

    // обновляем позиции связей при изменении размера окна
    window.addEventListener('resize', updateConnectionPositions);

    updateButtonStates();
    updateStepHighlight(-1);

    // автоматически запускаем анимацию при загрузке страницы
    setTimeout(() => {
        startAnimation();
    }, 1000);
});