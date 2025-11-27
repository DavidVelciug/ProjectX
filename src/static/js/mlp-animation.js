document.addEventListener('DOMContentLoaded', function () {
    // полная конфигурация - все нейроны и связи
    const config = {
        inputNeurons: 784,
        hidden1Neurons: 128,
        hidden2Neurons: 128,
        outputNeurons: 11,
        // количество видимых нейронов (для производительности)
        visualInputNeurons: 25,
        visualHidden1Neurons: 20,
        visualHidden2Neurons: 20,
        visualOutputNeurons: 11
    };

    // элементы
    const inputLayer = document.getElementById('input-layer');
    const hiddenLayer1 = document.getElementById('hidden-layer-1');
    const hiddenLayer2 = document.getElementById('hidden-layer-2');
    const outputLayer = document.getElementById('output-layer');
    const w1nContainer = document.getElementById('w1n-container');
    const w2nContainer = document.getElementById('w2n-container');
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

    // создаем нейроны с правильным расположением троеточия перед последним нейроном
    function createNeurons() {
        // входной слой
        createLayerNeurons(inputLayer, 'input', config.visualInputNeurons, config.inputNeurons);

        // скрытый слой 1
        createLayerNeurons(hiddenLayer1, 'hidden1', config.visualHidden1Neurons, config.hidden1Neurons);

        // скрытый слой 2
        createLayerNeurons(hiddenLayer2, 'hidden2', config.visualHidden2Neurons, config.hidden2Neurons);

        // выходной слой
        createLayerNeurons(outputLayer, 'output', config.visualOutputNeurons, config.outputNeurons);

        // bias нейроны (оранжевые нейроны) - только два
        createBiasNeurons();
    }

    function createLayerNeurons(container, layerType, visualCount, totalCount) {
        // создаем видимые нейроны, но оставляем место для троеточия перед последним
        const neuronsToShow = Math.min(visualCount, totalCount);

        for (let i = 0; i < neuronsToShow; i++) {
            const neuron = document.createElement('div');
            neuron.className = `neuron ${layerType}`;
            neuron.dataset.layer = layerType;
            neuron.dataset.index = i;
            neuron.id = `${layerType}-${i}`;

            // если это последний нейрон в hidden layer 1 или 2, добавляем класс для понижения
            if ((layerType === 'hidden1' || layerType === 'hidden2') && i === neuronsToShow - 1) {
                neuron.classList.add('last-neuron');
            }

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
                label.textContent = 'x783'; // последний видимый нейрон
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

    function createBiasNeurons() {
        // только два bias-нейрона как указано в требованиях

        // bias нейрон между input и hidden1
        const w1n = document.createElement('div');
        w1n.className = 'neuron bias';
        w1n.id = 'w1n-neuron';
        w1n.dataset.layer = 'bias';
        w1n.dataset.connection = 'input-hidden1';
        w1nContainer.appendChild(w1n);

        // bias нейрон между hidden1 и hidden2
        const w2n = document.createElement('div');
        w2n.className = 'neuron bias';
        w2n.id = 'w2n-neuron';
        w2n.dataset.layer = 'bias';
        w2n.dataset.connection = 'hidden1-hidden2';
        w2nContainer.appendChild(w2n);
    }

    // создаем связи между слоями - новый подход без координат
    function createConnections() {
        const layers = [
            {
                element: inputLayer,
                type: 'input',
                neurons: inputLayer.querySelectorAll('.neuron')
            },
            {
                element: hiddenLayer1,
                type: 'hidden1',
                neurons: hiddenLayer1.querySelectorAll('.neuron')
            },
            {
                element: hiddenLayer2,
                type: 'hidden2',
                neurons: hiddenLayer2.querySelectorAll('.neuron')
            },
            {
                element: outputLayer,
                type: 'output',
                neurons: outputLayer.querySelectorAll('.neuron')
            }
        ];

        const biasNeurons = {
            w1n: document.getElementById('w1n-neuron'),
            w2n: document.getElementById('w2n-neuron')
        };

        // инициализируем карту связей
        layers.forEach(layer => {
            layer.neurons.forEach(neuron => {
                neuronConnections.set(neuron.id, []);
            });
        });
        neuronConnections.set(biasNeurons.w1n.id, []);
        neuronConnections.set(biasNeurons.w2n.id, []);

        // связи от input к hidden1
        createLayerConnections(layers[0], layers[1]);

        // связи от w1n ко всем нейронам hidden1
        createBiasConnectionsToLayer(biasNeurons.w1n, layers[1]);

        // связи от hidden1 к hidden2
        createLayerConnections(layers[1], layers[2]);

        // связи от w2n ко всем нейронам hidden2
        createBiasConnectionsToLayer(biasNeurons.w2n, layers[2]);

        // связи от hidden2 к output
        createLayerConnections(layers[2], layers[3]);
    }

    function createLayerConnections(fromLayer, toLayer) {
        // создаем связи от каждого нейрона к каждому в следующем слое
        fromLayer.neurons.forEach((fromNeuron, fromIndex) => {
            toLayer.neurons.forEach((toNeuron, toIndex) => {
                createConnection(fromNeuron, toNeuron);
                neuronConnections.get(fromNeuron.id).push(toNeuron.id);
            });
        });
    }

    function createBiasConnectionsToLayer(biasNeuron, toLayer) {
        // создаем связи от bias нейрона ко всем нейронам указанного слоя
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
        // сбрасываем все шаги
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.remove('active');
        });

        // подсвечиваем текущий шаг
        if (stepIndex >= 0 && stepIndex < 6) {
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
                updateProgress(15);
                updateStepHighlight(1);
                // активируем w1n между input и hidden1
                return activateBiasNeuron('w1n-neuron', "активация bias нейрона w1n...");
            })
            .then(() => {
                updateProgress(30);
                updateStepHighlight(2);
                // затем активируем связи к hidden1 и появляются нейроны hidden1
                return activateConnectionsAndNeurons(['input', 'bias'], 'hidden1', "активация связей к скрытому слою 1...");
            })
            .then(() => {
                updateProgress(50);
                updateStepHighlight(3);
                // активируем w2n между hidden1 и hidden2
                return activateBiasNeuron('w2n-neuron', "активация bias нейрона w2n...");
            })
            .then(() => {
                updateProgress(70);
                updateStepHighlight(4);
                // активируем связи к hidden2 и появляются нейроны hidden2
                return activateConnectionsAndNeurons(['hidden1', 'bias'], 'hidden2', "активация связей к скрытому слою 2...");
            })
            .then(() => {
                updateProgress(90);
                updateStepHighlight(5);
                // активируем связи к output и появляются нейроны output
                return activateConnectionsAndNeurons(['hidden2'], 'output', "активация связей к выходному слою...");
            })
            .then(() => {
                updateProgress(100);
                updateStepHighlight(6);
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
                    if (Math.random() < 0.3) { // 30% нейронов будут полуактивными
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
                    // для bias нейронов используем конкретные id в зависимости от целевого слоя
                    if (toLayerType === 'hidden1') {
                        // только w1n к hidden1
                        const biasConnections = document.querySelectorAll('.connection[data-from="w1n-neuron"][data-to-layer="hidden1"]');
                        connections = connections.concat(Array.from(biasConnections));
                    } else if (toLayerType === 'hidden2') {
                        // только w2n к hidden2
                        const biasConnections = document.querySelectorAll('.connection[data-from="w2n-neuron"][data-to-layer="hidden2"]');
                        connections = connections.concat(Array.from(biasConnections));
                    }
                } else {
                    // для обычных слоев
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
                    if (Math.random() < 0.4) { // 40% связей будут полуактивными
                        connection.classList.add('semi-active');
                    } else {
                        connection.classList.add('active');
                    }
                    activatedConnections++;

                    // находим целевой нейрон и активируем его
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

                    // когда все связи активированы, разрешаем промис
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
            { action: 'activateW1n', message: 'активация bias нейрона w1n' },
            { action: 'activateToHidden1', message: 'активация связей к скрытому слою 1' },
            { action: 'activateW2n', message: 'активация bias нейрона w2n' },
            { action: 'activateToHidden2', message: 'активация связей к скрытому слою 2' },
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
            case 'activateW1n':
                activateBiasNeuronImmediate('w1n-neuron');
                break;
            case 'activateToHidden1':
                activateConnectionsAndNeuronsImmediate(['input', 'bias'], 'hidden1');
                break;
            case 'activateW2n':
                activateBiasNeuronImmediate('w2n-neuron');
                break;
            case 'activateToHidden2':
                activateConnectionsAndNeuronsImmediate(['hidden1', 'bias'], 'hidden2');
                break;
            case 'activateToOutput':
                activateConnectionsAndNeuronsImmediate(['hidden2'], 'output');
                break;
        }

        currentStep++;

        if (currentStep >= steps.length) {
            // подсвечиваем распознанную цифру в выходном слое
            highlightRecognizedDigit();

            status.textContent = "все шаги завершены!";
            updateProgress(100);
            updateStepHighlight(6);
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
                // для bias нейронов используем конкретные id в зависимости от целевого слоя
                if (toLayerType === 'hidden1') {
                    // только w1n к hidden1
                    const biasConnections = document.querySelectorAll('.connection[data-from="w1n-neuron"][data-to-layer="hidden1"]');
                    connections = connections.concat(Array.from(biasConnections));
                } else if (toLayerType === 'hidden2') {
                    // только w2n к hidden2
                    const biasConnections = document.querySelectorAll('.connection[data-from="w2n-neuron"][data-to-layer="hidden2"]');
                    connections = connections.concat(Array.from(biasConnections));
                }
            } else {
                // для обычных слоев
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