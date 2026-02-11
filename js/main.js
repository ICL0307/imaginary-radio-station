document.addEventListener('DOMContentLoaded', () => {
    console.log('Imaginary Radio Station is on air.');

    // Slider Navigation implementation
    const slider = document.querySelector('.dj-grid');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (!slider || !prevBtn || !nextBtn) return;

    // カードの幅 + gap を取得する関数
    const getScrollAmount = () => {
        const card = slider.querySelector('.dj-card');
        if (!card) return 300; // default fallback
        const style = window.getComputedStyle(slider);
        const gap = parseFloat(style.gap) || 32;
        return card.offsetWidth + gap;
    };

    // Scroll Buttons Event
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    // Update Button Visibility
    const updateButtons = () => {
        // 左端判定 (遊びを持たせる)
        if (slider.scrollLeft <= 10) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        // 右端判定
        // scrollLeft + clientWidth >= scrollWidth - (遊び)
        // ブラウザのズーム率等で1px未満の誤差が出ることがあるので1px余裕を見る
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    };

    slider.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    // 初期状態チェック
    updateButtons();

    // Modal Implementation
    const modal = document.getElementById('full-image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');
    const interactiveCards = document.querySelectorAll('.interactive-dj');

    if (modal && modalImg) {
        interactiveCards.forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.getAttribute('data-full-img');
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modal.classList.add('show'); // Use CSS class for display:flex
                    // Force reflow for transition if needed, but display:flex handles it with opacity
                    // Simple display toggle logic:
                    modal.style.display = 'flex';
                    setTimeout(() => modal.style.opacity = '1', 10);
                }
            });
        });

        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.remove('show');
                modal.style.display = 'none';
                modalImg.src = '';
            }, 300);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleBackToTop);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Random Hero Background Logic
    const heroBg = document.getElementById('hero-random-bg');
    if (heroBg) {
        const bgImages = [
            'img/hero_bg_option_1.jpg',
            'img/hero_bg_option_2.jpg'
        ];
        // ランダム選択
        const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];
        heroBg.style.backgroundImage = `url('${randomBg}')`;
    }

    // Logo Click to Top Logic
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Update URL without hash if desired
            history.pushState(null, null, window.location.pathname);
        });
    }
});

