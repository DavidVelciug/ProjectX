// Навигация между страницами внутри секций
function changePage(section, pageNumber) {
    const totalPages = getTotalPages(section);
    
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    // Скрываем все страницы
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Показываем нужную страницу
    const currentPage = document.getElementById(`${section}-page-${pageNumber}`);
    if (currentPage) {
        currentPage.style.display = 'block';
    }
    
    // Обновляем индикатор
    const indicator = document.getElementById(`${section}-page-indicator`);
    if (indicator) {
        indicator.textContent = `Страница ${pageNumber} из ${totalPages}`;
    }
    
    // Обновляем кнопки навигации
    updateNavigationButtons(section, pageNumber, totalPages);
    
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

function updateNavigationButtons(section, currentPage, totalPages) {
    const prevBtn = document.getElementById(`${section}-prev-btn`);
    const nextBtn = document.getElementById(`${section}-next-btn`);
    
    if (prevBtn) {
        prevBtn.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
        prevBtn.onclick = () => changePage(section, currentPage - 1);
    }
    
    if (nextBtn) {
        nextBtn.style.visibility = currentPage === totalPages ? 'hidden' : 'visible';
        nextBtn.onclick = () => changePage(section, currentPage + 1);
    }
}

// Инициализация навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую секцию из URL
    const currentPage = window.location.pathname;
    const section = getSectionFromUrl(currentPage);
    
    if (section) {
        // Показываем первую страницу
        changePage(section, 1);
    }
});

function getSectionFromUrl(url) {
    const pageMap = {
        'section-ml.html': 'ml',
        'section-history.html': 'history',
        'section-paradigms.html': 'paradigm',
        'section-blackbox.html': 'blackbox',
        'section-research.html': 'research',
        'section-perceptron.html': 'perceptron',
        'section-mlp.html': 'mlp',
        'section-cnn.html': 'cnn',
        'section-components.html': 'components',
        'section-activation.html': 'activation',
        'section-gradient.html': 'gradient',
        'section-supervised.html': 'supervised',
        'section-backpropagation.html': 'backprop'
    };
    
    const pageName = url.split('/').pop();
    return pageMap[pageName];
}

// Глобальные функции для доступа из HTML
window.changePage = changePage;