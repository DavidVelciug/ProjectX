// Навигация между страницами внутри секций
let currentSection = null;
let currentPageNumber = 1;

function changePage(section, pageNumber) {
    const totalPages = getTotalPages(section);
    
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    currentSection = section;
    currentPageNumber = pageNumber;
    
    // Скрываем все страницы с плавной анимацией
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.opacity = '0';
        page.style.transform = 'translateY(20px)';
        setTimeout(() => {
            page.style.display = 'none';
        }, 200);
    });
    
    // Показываем нужную страницу с анимацией
    setTimeout(() => {
        const currentPage = document.getElementById(`${section}-page-${pageNumber}`);
        if (currentPage) {
            currentPage.style.display = 'block';
            setTimeout(() => {
                currentPage.style.opacity = '1';
                currentPage.style.transform = 'translateY(0)';
            }, 10);
        }
    }, 200);
    
    // Обновляем пагинацию
    updatePagination(section, pageNumber, totalPages);
    
    // Сохраняем текущую страницу в sessionStorage
    sessionStorage.setItem(`section-${section}-page`, pageNumber);
    
    // Прокручиваем к началу
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getTotalPages(section) {
    const pages = {
        'ml': 3,
        'history': 3,
        'paradigm': 3,
        'blackbox': 3,
        'research': 4,
        'perceptron': 3,
        'mlp': 3,
        'cnn': 3,
        'components': 4,
        'activation': 4,
        'gradient': 4,
        'supervised': 4,
        'backprop': 4
    };
    return pages[section] || 1;
}

function updatePagination(section, currentPage, totalPages) {
    // Обновляем индикатор
    const indicator = document.getElementById(`${section}-page-indicator`);
    if (indicator) {
        indicator.textContent = `Страница ${currentPage} из ${totalPages}`;
    }
    
    // Обновляем кнопки навигации
    updateNavigationButtons(section, currentPage, totalPages);
    
    // Обновляем номера страниц в пагинации
    updatePageNumbers(section, currentPage, totalPages);
}

function updateNavigationButtons(section, currentPage, totalPages) {
    const prevBtn = document.getElementById(`${section}-prev-btn`);
    const nextBtn = document.getElementById(`${section}-next-btn`);
    
    if (prevBtn) {
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
            prevBtn.disabled = true;
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.disabled = false;
            prevBtn.onclick = () => changePage(section, currentPage - 1);
        }
    }
    
    if (nextBtn) {
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
            nextBtn.disabled = true;
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
            nextBtn.onclick = () => changePage(section, currentPage + 1);
        }
    }
}

function updatePageNumbers(section, currentPage, totalPages) {
    const paginationContainer = document.getElementById(`${section}-pagination-numbers`);
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // Показываем максимум 5 номеров страниц
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Корректируем начало, если мы близко к концу
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Кнопка "Первая страница"
    if (startPage > 1) {
        const firstBtn = createPageButton(section, 1, '1', currentPage === 1);
        paginationContainer.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    // Номера страниц
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(section, i, i.toString(), i === currentPage);
        paginationContainer.appendChild(pageBtn);
    }
    
    // Кнопка "Последняя страница"
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
        
        const lastBtn = createPageButton(section, totalPages, totalPages.toString(), currentPage === totalPages);
        paginationContainer.appendChild(lastBtn);
    }
}

function createPageButton(section, pageNumber, text, isActive) {
    const button = document.createElement('button');
    button.className = `pagination-number ${isActive ? 'active' : ''}`;
    button.textContent = text;
    button.onclick = () => changePage(section, pageNumber);
    return button;
}

function getSectionFromUrl(url) {
    const pageMap = {
        'section-ml': 'ml',
        'section-history': 'history',
        'section-paradigms': 'paradigm',
        'section-blackbox': 'blackbox',
        'section-research': 'research',
        'section-perceptron': 'perceptron',
        'section-mlp': 'mlp',
        'section-cnn': 'cnn',
        'section-components': 'components',
        'section-activation': 'activation',
        'section-gradient': 'gradient',
        'section-supervised': 'supervised',
        'section-backpropagation': 'backprop'
    };
    
    const pageName = url.split('/').pop().replace('/', '');
    return pageMap[pageName] || null;
}

// Инициализация навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую секцию из URL
    const currentUrl = window.location.pathname;
    const section = getSectionFromUrl(currentUrl);
    
    if (section) {
        // Настраиваем анимацию для страниц
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            // Скрываем все страницы кроме первой
            if (!page.id.includes('-page-1')) {
                page.style.display = 'none';
                page.style.opacity = '0';
            } else {
                page.style.display = 'block';
                page.style.opacity = '1';
            }
        });
        
        // Восстанавливаем сохраненную страницу или показываем первую
        const savedPage = sessionStorage.getItem(`section-${section}-page`);
        const initialPage = savedPage ? parseInt(savedPage) : 1;
        
        // Показываем нужную страницу (без анимации при первой загрузке)
        setTimeout(() => {
            changePage(section, initialPage);
        }, 100);
    }
});

// Обработка клавиатуры для навигации
document.addEventListener('keydown', function(e) {
    if (!currentSection) return;
    
    const totalPages = getTotalPages(currentSection);
    
    if (e.key === 'ArrowLeft' && currentPageNumber > 1) {
        changePage(currentSection, currentPageNumber - 1);
    } else if (e.key === 'ArrowRight' && currentPageNumber < totalPages) {
        changePage(currentSection, currentPageNumber + 1);
    }
});

// Глобальные функции для доступа из HTML
window.changePage = changePage;