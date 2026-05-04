document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // MULTI-LANGUAGE SYSTEM
    // ==========================================
    let currentLang = localStorage.getItem('preferredLang') || 'zh';
    
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update active button state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Refresh dynamic content if needed
        updateDynamicContent();
    }

    function updateDynamicContent() {
        // Update terminal commands if they exist
        if (window.currentTerminalCommands) {
            window.currentTerminalCommands = getCommandsForLang(currentLang);
        }
    }

    function getCommandsForLang(lang) {
        const t = translations[lang];
        return {
            'help': t.terminal_help,
            'ls': 'about.txt  skills.md  awards.log  projects/  contact.info',
            'whoami': t.about_info_desc,
            'skills': t.skills_distribution,
            'awards': t.award_cat_1 + ', ' + t.award_cat_2,
            'contact': 'Email: roaxtracy@gmail.com\nQQ: 3213538450',
            'date': new Date().toLocaleString(lang),
            'clear': 'CLEAR'
        };
    }

    // Language buttons event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang !== currentLang) {
                updateLanguage(lang);
                // Force reload typing effects for the new language if desired, 
                // but usually better to just change static text.
                // For a truly "wow" effect, we'd re-trigger typewriters.
                location.reload(); 
            }
        });
    });

    // Initialize language
    updateLanguage(currentLang);

    // ==========================================
    // PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loader-progress');
    let loadProgress = 0;
    
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            progressBar.style.width = '100%';
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                initTypewriters();
            }, 500);
        } else {
            progressBar.style.width = loadProgress + '%';
        }
    }, 100);

    // ==========================================
    // SCROLL & INTERSECTION OBSERVERS
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;
        scrollProgress.style.width = scroll;
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ==========================================
    // INTERACTIVITY
    // ==========================================
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    if (!isMobile) {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        let outlineX = mouseX, outlineY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                cursorOutline.style.width = '60px'; cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0px, 0px, 0)';
                cursorOutline.style.width = '40px'; cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });

        document.querySelectorAll('.hover-glow').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const blob = card.querySelector('.glow-blob');
                if (blob) {
                    blob.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`;
                }
            });
        });

        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const xRotate = 10 * ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
                const yRotate = -10 * ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
                card.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        const bg = document.getElementById('parallax-bg');
        window.addEventListener('mousemove', (e) => {
            bg.style.transform = `translate3d(${(e.clientX / window.innerWidth - 0.5) * 30}px, ${(e.clientY / window.innerHeight - 0.5) * 30}px, 0)`;
        });

        const backToTop = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ==========================================
    // SKILLS & CANVAS
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');
    const animateSkills = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => bar.style.width = bar.getAttribute('data-width'));
            }
        });
    }, { threshold: 0.5 });
    const skillSection = document.getElementById('skills');
    if (skillSection) animateSkills.observe(skillSection);

    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [], w, h;
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();

    class Particle {
        constructor() { this.x = Math.random() * w; this.y = Math.random() * h; this.size = Math.random() * 2 + 0.5; this.baseX = this.x; this.baseY = this.y; this.density = Math.random() * 30 + 1; }
        draw() { ctx.fillStyle = 'rgba(56, 189, 248, 0.5)'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        update() {
            let dx = mouseX - this.x, dy = mouseY - this.y, dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150 && !isMobile) {
                this.x -= (dx/dist) * ((150-dist)/150) * this.density;
                this.y -= (dy/dist) * ((150-dist)/150) * this.density;
            } else {
                this.x -= (this.x - this.baseX) / 10; this.y -= (this.y - this.baseY) / 10;
            }
        }
    }
    function initCanvas() { particlesArray = []; for (let i=0; i<(w*h)/10000; i++) particlesArray.push(new Particle()); }
    function animate() {
        ctx.clearRect(0, 0, w, h);
        particlesArray.forEach(p => { p.update(); p.draw(); });
        for (let a=0; a<particlesArray.length; a++) {
            for (let b=a; b<particlesArray.length; b++) {
                let d = Math.pow(particlesArray[a].x-particlesArray[b].x, 2) + Math.pow(particlesArray[a].y-particlesArray[b].y, 2);
                if (d < (w*h)/100) {
                    ctx.strokeStyle = `rgba(56, 189, 248, ${(1-d/10000)*0.2})`; ctx.lineWidth = 1; ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    initCanvas(); animate();

    // ==========================================
    // TYPEWRITERS & TERMINAL
    // ==========================================
    function initTypewriters() {
        const nameText = currentLang === 'zh' ? "张诗博" : (currentLang === 'jp' ? "張詩博" : "Zhang Shibo");
        const nameEl = document.getElementById('typewriter');
        let i = 0;
        function typeName() {
            if (i < nameText.length) { nameEl.innerHTML += nameText.charAt(i++); setTimeout(typeName, 200); }
        }
        typeName();

        const terminalText = `class SoftwareEngineer {
    constructor() {
        this.name = "${nameText}";
        this.role = "${translations[currentLang].title}";
        this.skills = ["C++", "Java", "Python", "HarmonyOS"];
    }
}`;
        
        const terminalEl = document.getElementById('terminal-typewriter');
        const terminalHistory = document.getElementById('terminal-history');
        const terminalInputLine = document.getElementById('terminal-input-line');
        const terminalInput = document.getElementById('terminal-input');
        const terminalBody = document.getElementById('terminal-body');

        let j = 0;
        function typeTerminal() {
            if (j < terminalText.length) {
                let content = terminalText.substring(0, ++j)
                    .replace(/class|constructor|this|async|while|await/g, m => `<span style="color: #ff7b72;">${m}</span>`)
                    .replace(/"[^"]*"/g, m => `<span style="color: #a5d6ff;">${m}</span>`);
                terminalEl.innerHTML = content + '<span class="blink">_</span>';
                setTimeout(typeTerminal, 20 + Math.random() * 20);
            } else {
                const introOutput = document.createElement('div');
                introOutput.className = 'terminal-output';
                introOutput.innerHTML = terminalEl.innerHTML + `<br><br><span style="color: #27c93f;">${translations[currentLang].terminal_optimized}</span>`;
                terminalHistory.appendChild(introOutput);
                terminalEl.innerHTML = '';
                setTimeout(() => { terminalInputLine.classList.remove('hidden'); terminalInput.focus(); }, 500);
            }
        }
        setTimeout(typeTerminal, 1500);

        window.currentTerminalCommands = getCommandsForLang(currentLang);
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const cmd = terminalInput.value.trim().toLowerCase();
                if (cmd) {
                    const output = document.createElement('div');
                    output.className = 'terminal-output';
                    output.innerHTML = `<div><span class="prompt">zsb@portfolio:~$</span> <span class="terminal-command">${cmd}</span></div>`;
                    const res = document.createElement('div');
                    if (window.currentTerminalCommands[cmd]) {
                        if (window.currentTerminalCommands[cmd] === 'CLEAR') { terminalHistory.innerHTML = ''; }
                        else { res.innerText = window.currentTerminalCommands[cmd]; output.appendChild(res); }
                    } else { res.innerText = `Command not found: ${cmd}`; output.appendChild(res); }
                    terminalHistory.appendChild(output);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
                terminalInput.value = '';
            }
        });
        terminalBody.addEventListener('click', () => terminalInput.focus());
    }
});
