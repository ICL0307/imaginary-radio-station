document.addEventListener('DOMContentLoaded', () => {

    // 1. Boot Screen Sequence (Revamped)
    const bootScreen = document.getElementById('boot-screen');
    const textContainer = document.getElementById('boot-text-container');

    if (bootScreen && textContainer) {
        const lines = [
            { en: "INITIALIZING SYSTEM...", jp: "システムを起動中..." },
            { en: "SEARCHING FOR LOST SIGNALS...", jp: "ロストシグナルを探索中..." },
            { en: "CONNECTION ESTABLISHED", jp: "接続確立" }
        ];

        const typeLineAndConvert = async (data) => {
            const line = document.createElement('div');
            line.className = 'boot-line';
            line.innerText = "> ";
            textContainer.appendChild(line);

            // 1. Type EN
            for (let i = 0; i < data.en.length; i++) {
                line.innerText += data.en[i];
                await new Promise(r => setTimeout(r, 15));
            }
            line.classList.add('finished');
            await new Promise(r => setTimeout(r, 200));

            // 2. Convert to JP (Glitch effect on specific line)
            line.classList.add('boot-glitch');
            await new Promise(r => setTimeout(r, 150));
            line.innerText = "> " + data.jp;
            line.classList.remove('boot-glitch');

            await new Promise(r => setTimeout(r, 300));
        };

        const runSequence = async () => {
            for (const data of lines) {
                await typeLineAndConvert(data);
            }

            await new Promise(r => setTimeout(r, 500));

            // 5. Fade out
            bootScreen.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
            bootScreen.style.opacity = '0';
            bootScreen.style.filter = 'blur(20px)';

            setTimeout(() => {
                bootScreen.remove();
            }, 500);
        };

        runSequence();
    }

    // 2. Mouse Glow Follow
    const mouseGlow = document.getElementById('mouse-glow');
    if (mouseGlow) {
        window.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    }


    // 4. Randomized BG with Glitch Transition
    const heroBg = document.getElementById('hero-random-bg');
    const globalGlitch = document.getElementById('global-glitch');
    if (heroBg && globalGlitch) {
        const bgImages = [
            'img/hero_bg_option_1.jpg',
            'img/hero_bg_option_2.jpg'
        ];

        const changeBg = () => {
            // Trigger Glitch
            globalGlitch.classList.add('active');

            setTimeout(() => {
                const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];
                heroBg.style.backgroundImage = `url('${randomBg}')`;

                setTimeout(() => {
                    globalGlitch.classList.remove('active');
                }, 100);
            }, 100);
        };

        // Initial set
        changeBg();
        // Regular interval (30s)
        setInterval(changeBg, 30000);
    }

    // Generic Slider Implementation
    const initSlider = (containerSelector, prevBtnSelector, nextBtnSelector, cardSelector) => {
        const slider = document.querySelector(containerSelector);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);

        if (!slider || !prevBtn || !nextBtn) return;

        const getScrollAmount = () => {
            const card = slider.querySelector(cardSelector);
            if (!card) return 300;
            const style = window.getComputedStyle(slider);
            const gap = parseFloat(style.gap) || 32;
            return card.offsetWidth + gap;
        };

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        const updateButtons = () => {
            if (slider.scrollLeft <= 10) {
                prevBtn.classList.add('hidden');
            } else {
                prevBtn.classList.remove('hidden');
            }

            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                nextBtn.classList.add('hidden');
            } else {
                nextBtn.classList.remove('hidden');
            }
        };

        slider.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons();
    };

    // Initialize sliders
    initSlider('.dj-grid', '.nav-btn.prev', '.nav-btn.next', '.dj-card');
    initSlider('.worldview-grid', '.worldview-prev', '.worldview-next', '.worldview-card');

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


    // Text Scramble Effect for Nav
    const scrambleElements = document.querySelectorAll('.main-nav span');
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    scrambleElements.forEach(el => {
        const originalText = el.innerText;
        let iteration = 0;
        let interval = null;

        el.parentElement.addEventListener('mouseenter', () => {
            clearInterval(interval);
            iteration = 0;

            interval = setInterval(() => {
                el.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    el.innerText = originalText;
                }

                iteration += 1 / 2; // Increased from 1/3
            }, 30);
        });

        el.parentElement.addEventListener('mouseleave', () => {
            clearInterval(interval);
            el.innerText = originalText;
        });
    });

    // Audio Visualizer Implementation
    const visualizer = document.getElementById('visualizer');
    if (visualizer) {
        const barCount = 60;
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'vis-bar';
            visualizer.appendChild(bar);
        }

        const bars = visualizer.querySelectorAll('.vis-bar');
        const animateVisualizer = () => {
            bars.forEach(bar => {
                const height = Math.random() * 80 + 10;
                bar.style.height = `${height}%`;
            });
            requestAnimationFrame(() => {
                setTimeout(animateVisualizer, 100);
            });
        };
        animateVisualizer();
    }


    // 5. Listener Log Dynamic Update (JST 4-hour slots)
    const bbsContent = document.getElementById('bbs-content');
    if (bbsContent) {
        const logData = {
            "0-4": [
                { no: "4401", name: "眠れない", time: "02:19", body: "羊って何匹くらいで眠れるの" },
                { no: "4402", name: "試した人", time: "02:21", body: "> ↑427匹で眠れた　でも覚えてた", isReply: true },
                { no: "4403", name: "夜型人間", time: "02:38", body: "朝型になろうとして3年経った" },
                { no: "4404", name: "同志", time: "02:39", body: "> ↑俺は5年　そろそろ夜型を極めようと思う", isReply: true },
                { no: "4405", name: "哲学", time: "02:44", body: "「今日」って何時までだと思う？" },
                { no: "4406", name: "現実主義", time: "02:44", body: "> ↑寝るまで", isReply: true },
                { no: "4407", name: "楽観主義", time: "02:45", body: "> ↑じゃあ俺まだ昨日だ", isReply: true },
                { no: "4408", name: "社会人", time: "02:58", body: "明日の会議の資料、夢の中で完成させた<br>採用されないのが不満" },
                { no: "4409", name: "名無し", time: "03:11", body: "おやすみ" },
                { no: "4410", name: "別の名無し", time: "03:24", body: "> ↑おはよう", isReply: true }
            ],
            "4-8": [
                { no: "4411", name: "徹夜組", time: "04:08", body: "もう寝るか起きてるかわからない" },
                { no: "4412", name: "哲学的な朝", time: "04:09", body: "> ↑その状態を「夜明け」という", isReply: true },
                { no: "4413", name: "早起き自慢", time: "05:22", body: "5時に起きた　することない" },
                { no: "4414", name: "同志", time: "05:23", body: "> ↑わかった、また寝て", isReply: true },
                { no: "4415", name: "犬の散歩中", time: "06:11", body: "犬は元気　俺は眠い　犬が正しい" },
                { no: "4416", name: "猫派", time: "06:12", body: "> ↑猫はまだ寝てる　猫が正しい", isReply: true },
                { no: "4417", name: "通勤電車", time: "07:18", body: "隣の人が爆睡してる 肩貸したい気持ちと貸したくない気持ち" },
                { no: "4418", name: "その隣の人", time: "07:19", body: "> ↑起きてた　ありがとう", isReply: true },
                { no: "4419", name: "朝が嫌いな人", time: "07:51", body: "朝だけ巻き戻せないかな" },
                { no: "4420", name: "夜が好きな人", time: "07:52", body: "> ↑だからここにいる", isReply: true }
            ],
            "8-12": [
                { no: "4421", name: "在宅勤務", time: "08:14", body: "仕事始めた　椅子がベッドと同じ部屋にある" },
                { no: "4422", name: "わかる", time: "08:15", body: "> ↑それは負ける", isReply: true },
                { no: "4423", name: "会議中", time: "09:32", body: "喋ってる人の話が1ミリも入ってこない" },
                { no: "4424", name: "主催者", time: "09:33", body: "> ↑俺も", isReply: true },
                { no: "4425", name: "サボり中", time: "10:11", body: "トイレ長すぎてそろそろ心配される" },
                { no: "4426", name: "人事", time: "10:12", body: "> ↑把握してる", isReply: true },
                { no: "4427", name: "お昼何食べよう", time: "11:44", body: "昨日も同じこと考えてた" },
                { no: "4428", name: "毎日考えてる", time: "11:45", body: "> ↑人生の3割はこれ", isReply: true },
                { no: "4429", name: "午前中終わる", time: "11:59", body: "今日まだ何もしてない" },
                { no: "4430", name: "午後に期待", time: "12:00", body: "> ↑午後の俺に任せた", isReply: true }
            ],
            "12-16": [
                { no: "4431", name: "昼休み", time: "12:11", body: "13分で食べ終わった　残り47分の使い方がわからない" },
                { no: "4432", name: "同じ状況", time: "12:12", body: "> ↑このチャンネル垂れ流しながらぼーっとするのおすすめ", isReply: true },
                { no: "4433", name: "昼休み", time: "12:13", body: "> ↑それで昼休み終わったことある", isReply: true },
                { no: "4434", name: "負けた人", time: "13:05", body: "昼食後の眠気と戦ってる" },
                { no: "4435", name: "報告", time: "13:06", body: "> ↑俺は負けた　報告だけ", isReply: true },
                { no: "4436", name: "在宅勤務", time: "14:22", body: "冷蔵庫開けたら何もなかった もう一回開けたら何もなかった" },
                { no: "4437", name: "わかる", time: "14:23", body: "> ↑3回目も開けるよね", isReply: true },
                { no: "4438", name: "おやつ難民", time: "15:01", body: "3時のおやつって誰が決めたの" },
                { no: "4439", name: "従う人", time: "15:02", body: "> ↑わからないけど従ってる", isReply: true },
                { no: "4440", name: "もうすぐ定時", time: "15:58", body: "残り2時間、気持ちはもう退勤してる" },
                { no: "4441", name: "気持ちだけ先に帰った", time: "15:59", body: "> ↑体だけ残しといて", isReply: true }
            ],
            "16-20": [
                { no: "4442", name: "定時ダッシュ", time: "16:01", body: "逃げた" },
                { no: "4443", name: "残業組", time: "16:02", body: "> ↑報告ありがとう　眩しい", isReply: true },
                { no: "4444", name: "帰り道", time: "17:19", body: "今日話した人間が自動改札だけだった" },
                { no: "4445", name: "充実してる", time: "17:20", body: "> ↑俺はコンビニの店員も入れると2人", isReply: true },
                { no: "4446", name: "夕飯", time: "18:03", body: "昨日の残り物があることを 朝から楽しみにしてた" },
                { no: "4447", name: "続き", time: "18:04", body: "> ↑食べてた　妹が", isReply: true },
                { no: "4448", name: "買い物中", time: "18:51", body: "特売のシール見ると買う気なかったもの買う" },
                { no: "4449", name: "同じ", time: "18:52", body: "> ↑それ節約じゃなくて浪費って気づいてる？", isReply: true },
                { no: "4450", name: "夜派", time: "19:58", body: "夜になると急にやる気出る人間 社会に向いてない" },
                { no: "4451", name: "同志", time: "19:59", body: "> ↑向いてないんじゃなくて時代が合ってない", isReply: true }
            ],
            "20-24": [
                { no: "4452", name: "夜ごはん後", time: "20:08", body: "食べた後に食べたいものを思い出す" },
                { no: "4453", name: "毎日", time: "20:09", body: "> ↑それが食欲", isReply: true },
                { no: "4454", name: "だらだら中", time: "21:17", body: "やることあるのに やる気がどこかに外出してる" },
                { no: "4455", name: "まだ帰ってない", time: "21:18", body: "> ↑うちのも帰ってない　一緒にいるかも", isReply: true },
                { no: "4456", name: "夜中の買い物", time: "22:03", body: "深夜のネットショッピングで買ったもの 翌朝後悔したことない" },
                { no: "4457", name: "財布", time: "22:04", body: "> ↑俺は後悔してる", isReply: true },
                { no: "4458", name: "眠くない", time: "23:11", body: "眠れない夜と 眠りたくない夜は違う" },
                { no: "4459", name: "今夜は後者", time: "23:12", body: "> ↑わかった、付き合う", isReply: true },
                { no: "4460", name: "もうすぐ日付変わる", time: "23:54", body: "今日の自分、よくやった" },
                { no: "4461", name: "明日も頼む", time: "23:55", body: "> ↑任せた", isReply: true }
            ]
        };

        let currentSlot = "";

        const updateLogs = () => {
            // Get JST time
            const now = new Date();
            const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
            const hours = jstNow.getHours();
            
            let slotKey = "";
            if (hours >= 0 && hours < 4) slotKey = "0-4";
            else if (hours >= 4 && hours < 8) slotKey = "4-8";
            else if (hours >= 8 && hours < 12) slotKey = "8-12";
            else if (hours >= 12 && hours < 16) slotKey = "12-16";
            else if (hours >= 16 && hours < 20) slotKey = "16-20";
            else slotKey = "20-24";

            if (slotKey === currentSlot) return; // No change needed
            currentSlot = slotKey;

            const posts = logData[slotKey];
            bbsContent.innerHTML = ""; // Clear existing

            posts.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = `bbs-post ${post.isReply ? 'is-reply' : ''}`;
                postDiv.innerHTML = `
                    <div class="post-meta">
                        <span class="post-no">No.${post.no}</span>
                        <span class="post-name">${post.name}</span>
                        <span class="post-time">${post.time}</span>
                    </div>
                    <div class="post-body">${post.body}</div>
                `;
                bbsContent.appendChild(postDiv);
            });
            console.log(`Updated logs for JST slot: ${slotKey}`);
        };

        // Initial update and check every minute
        updateLogs();
        setInterval(updateLogs, 60000);
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

