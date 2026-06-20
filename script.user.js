// ==UserScript==
// @name         Умная загрузка комментариев Рутуба (Rutube All Comments Clicker)
// @namespace    http://tampermonkey.net
// @version      1.6
// @description  Автоматически нажимает кнопку "Показать ещё" под комментариями на Rutube при первом открытии видео и по мере прокрутки страницы.
// @author       Darkness-83 (с помощью AI) 
// @match        *://*.rutube.ru/*
// @include      *://rutube.ru/*
// @run-at       document-end
// @grant        none
// @license      GPL-3.0
// ==/UserScript==

(function() {
    'use strict';

    let observer;

    // Функция поиска кнопки с учетом любых регистров букв
    function findLoadMoreBtn() {
        // Проверяем вообще все элементы, где может быть текст
        const elements = document.querySelectorAll('button, div, span, p, a');
        return Array.from(elements).find(el => {
            if (el.children.length > 0) return false; // Пропускаем крупные блоки, ищем только текст
            const text = el.textContent.trim().toLowerCase();
            return text === 'показать ещё' || text === 'показать еще';
        });
    }

    function setupObserver() {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.click();
                }
            });
        }, { rootMargin: '500px' }); // Нажмет за 500 пикселей до появления
    }

    // Запуск проверки каждые 1000 мс
    setInterval(() => {
        const btn = findLoadMoreBtn();
        if (btn && !btn.dataset.observed) {
            setupObserver();
            observer.observe(btn);
            btn.dataset.observed = 'true';
            btn.click(); // Самый первый клик при обнаружении
        }
    }, 1000);
})();
