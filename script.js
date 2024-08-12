// ==UserScript==
// @name         Telegra.ph Dark Mode with Keyboard Image Scroll
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  Add dark mode toggle and keyboard-controlled image scroll to telegra.ph
// @author       Sluicee
// @match        https://telegra.ph/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const darkTheme = {
        backgroundColor: '#000000',
        textColor: '#E0E0E0'
    };

    const lightTheme = {
        backgroundColor: '#FFFFFF',
        textColor: '#000000'
    };

    let isDark = true;

    function applyTheme(theme) {
        document.body.style.backgroundColor = theme.backgroundColor;
        document.body.style.color = theme.textColor;

        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, div, blockquote, img, video');
        elements.forEach(element => {
            element.style.color = theme.textColor;
            element.style.backgroundColor = theme.backgroundColor;
        });
    }

    applyTheme(darkTheme);

    const toggleButton = document.createElement('button');
    toggleButton.innerText = '🌙';
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.backgroundColor = '#333';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '20px';
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        isDark = !isDark;
        applyTheme(isDark ? darkTheme : lightTheme);
        toggleButton.innerText = isDark ? '🌙' : '☀️';
    });

    const tlPage = document.querySelector('.tl_page');
    if (tlPage) {
        tlPage.style.maxWidth = 'none';
    }

    const figureElements = document.querySelectorAll('.tl_article .tl_article_content .figure_wrapper img, .tl_article .tl_article_content .figure_wrapper video');
    figureElements.forEach(element => {
        element.style.maxHeight = 'none';
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.height = '100vh';
        img.style.width = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
    });

    function createHorizontalImageScroll(images) {
        let currentIndex = 0;

        function updateCurrentIndex(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentIndex = Array.from(images).indexOf(entry.target);
                }
            });
        }

        const observer = new IntersectionObserver(updateCurrentIndex, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });

        images.forEach(img => {
            observer.observe(img);
        });

        function scrollToImage(index) {
            if (index >= 0 && index < images.length) {
                images[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                scrollToImage(currentIndex);
            } else if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                scrollToImage(currentIndex);
            }
        });
    }

    if (images.length > 0) {
        createHorizontalImageScroll(images);
    }
})();
