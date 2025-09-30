// 🚀 IBOROVI EPIC GAMING ENGINE 🚀
// The most advanced website experience ever created

class EpicGamingEngine {
    constructor() {
        this.init().catch(console.error);
    }

    async init() {
        console.log('🎮 Initializing Epic Gaming Engine...');
        this.particles = [];
        this.isLoaded = false;
        
        // Setup loading screen first
        this.setupLoadingScreen();
        
        // Start loading sequence with timeout fallback
        try {
            await Promise.race([
                this.startLoadingSequence(),
                new Promise(resolve => setTimeout(resolve, 3000)) // 3 second max
            ]);
        } catch (error) {
            console.warn('Loading sequence error:', error);
        }
        
        this.hideLoadingScreen();
        
        // Initialize other components
        try {
            this.setupThreeJS();
            this.setupCursorEffects();
            this.setupTwitchIntegration();
            this.setupInteractiveElements();
            this.setupEasterEggs();
            
            // Setup event listeners
            window.addEventListener('scroll', this.handleScroll.bind(this));
            window.addEventListener('resize', this.handleResize.bind(this));
            window.addEventListener('wheel', this.handleWheel.bind(this));
            
            // Add click ripple effect globally
            document.addEventListener('click', this.createClickRipple.bind(this));
        } catch (error) {
            console.warn('Initialization error:', error);
        }
    }

    setupThreeJS() {
        if (!window.THREE) {
            console.warn('Three.js not loaded, skipping 3D effects');
            return;
        }

        const canvas = document.getElementById('three-bg');
        if (!canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Create floating particles
        this.createFloatingParticles();
        
        // Create animated geometries
        this.createAnimatedShapes();

        // Start render loop
        this.animate3D();
    }

    createFloatingParticles() {
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;

            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.6, 1, 0.7);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createAnimatedShapes() {
        // Floating geometric shapes
        const shapes = [];
        
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.OctahedronGeometry(1);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.7),
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            
            shapes.push(mesh);
            this.scene.add(mesh);
        }
        
        this.animatedShapes = shapes;
    }

    animate3D() {
        if (!this.renderer) return;

        requestAnimationFrame(() => this.animate3D());

        const time = Date.now() * 0.001;

        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y = time * 0.1;
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i) * 0.01;
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Animate shapes
        if (this.animatedShapes) {
            this.animatedShapes.forEach((shape, index) => {
                shape.rotation.x = time * (0.5 + index * 0.1);
                shape.rotation.y = time * (0.3 + index * 0.05);
                shape.position.y += Math.sin(time * 2 + index) * 0.02;
            });
        }

        this.renderer.render(this.scene, this.camera);
    }

    setupCursorEffects() {
        const cursorGlow = document.querySelector('.cursor-glow');
        if (!cursorGlow) return;

        this.cursorGlow = cursorGlow;
    }

    updateCursorGlow(x, y) {
        if (this.cursorGlow) {
            this.cursorGlow.style.left = x + 'px';
            this.cursorGlow.style.top = y + 'px';
        }
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        this.loadingScreen = loadingScreen;
    }

    startLoadingSequence() {
        return new Promise((resolve) => {
            const progressBar = document.getElementById('progress-bar');
            let progress = 0;
            let resolved = false;
            
            const finishLoading = () => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            };
            
            // Force finish after 2 seconds maximum
            setTimeout(finishLoading, 2000);
            
            const interval = setInterval(() => {
                progress += Math.random() * 25 + 15; // Even faster
                if (progress > 100) progress = 100;
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(finishLoading, 200);
                }
            }, 30); // Very fast interval
        });
    }

    hideLoadingScreen() {
        console.log('🎯 Hiding loading screen...');
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                this.isLoaded = true;
                try {
                    this.startMainAnimations();
                } catch (error) {
                    console.warn('Animation start error:', error);
                }
            }, 500);
        } else {
            // Fallback if loading screen not found
            const fallbackScreen = document.getElementById('loading-screen');
            if (fallbackScreen) {
                fallbackScreen.style.display = 'none';
            }
            this.isLoaded = true;
        }
    }

    startMainAnimations() {
        // Animate in main content
        const app = document.getElementById('app');
        if (app) {
            app.style.opacity = '0';
            app.style.transform = 'translateY(50px)';
            app.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                app.style.opacity = '1';
                app.style.transform = 'translateY(0)';
            }, 100);
        }

        // Start floating animations
        this.startFloatingElements();
    }

    startFloatingElements() {
        const floatingIcons = document.querySelectorAll('.floating-icon');
        floatingIcons.forEach((icon, index) => {
            icon.style.animationDelay = (index * 0.5) + 's';
            icon.classList.add('float-animation');
        });
    }

    createClickRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    setupTwitchIntegration() {
        this.twitchChannel = 'iborovi';
        this.checkTwitchStatus();
        
        // Check every 30 seconds
        setInterval(() => this.checkTwitchStatus(), 30000);
    }

    async checkTwitchStatus() {
        try {
            // Check live status
            const uptimeResponse = await fetch(`https://decapi.me/twitch/uptime/${this.twitchChannel}`);
            const uptime = await uptimeResponse.text();
            const isLive = !uptime.includes('offline') && !uptime.includes('not live');
            
            this.updateLiveStatus(isLive);
            // Use static follower count since API is deprecated
            this.updateFollowerCount('24');
            
            if (isLive) {
                this.fetchViewerCount();
            }
        } catch (error) {
            console.warn('Could not fetch Twitch data:', error);
            // Fallback values
            this.updateFollowerCount('24');
            this.updateLiveStatus(false);
        }
    }

    async fetchViewerCount() {
        try {
            const response = await fetch(`https://decapi.me/twitch/viewers/${this.twitchChannel}`);
            const viewers = await response.text();
            this.updateViewerCount(viewers);
        } catch (error) {
            console.warn('Could not fetch viewer count:', error);
        }
    }

    updateFollowerCount(count) {
        // Update hero section
        const heroFollowers = document.getElementById('realtime-followers');
        if (heroFollowers) {
            heroFollowers.textContent = count;
        }
        
        // Update footer
        const footerFollowers = document.getElementById('footer-realtime-followers');
        if (footerFollowers) {
            footerFollowers.textContent = count;
        }
    }

    updateLiveStatus(isLive) {
        const liveIndicator = document.getElementById('live-status');
        const avatarStatus = document.getElementById('avatar-status');
        const streamLink = document.getElementById('stream-link');
        
        // Update live indicator

        // Update avatar status
        if (avatarStatus) {
            const statusDot = avatarStatus.querySelector('.status-dot');
            const statusSpan = avatarStatus.querySelector('span');
            
            if (statusDot) {
                statusDot.style.background = isLive ? '#00ff88' : '#ff4444';
            }
            
            if (statusSpan) {
                statusSpan.textContent = isLive ? 'В ЭФИРЕ' : 'ОФФЛАЙН';
            }
        }

        // Show/hide stream links
        if (streamLink) {
            streamLink.style.display = isLive ? 'block' : 'none';
        }
        
        const navStreamLink = document.getElementById('nav-stream-link');
        if (navStreamLink) {
            navStreamLink.style.display = isLive ? 'block' : 'none';
        }
    }

    updateViewerCount(count) {
        // Update navbar viewers
        const navViewers = document.getElementById('nav-viewers');
        if (navViewers) {
            navViewers.textContent = count || '0';
        }
        
        // Update sidebar viewers
        const sidebarViewers = document.getElementById('viewer-count');
        if (sidebarViewers) {
            sidebarViewers.textContent = count || '0';
        }
    }

    setupInteractiveElements() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const toggleIcon = themeToggle.querySelector('.toggle-icon');

            const applyThemeState = (isAlt) => {
                document.body.classList.toggle('alt-theme', isAlt);
                themeToggle.classList.toggle('active', isAlt);
                if (toggleIcon) {
                    toggleIcon.textContent = isAlt ? '☀️' : '🌙';
                }
            };

            const savedTheme = localStorage.getItem('iborovi-theme');
            applyThemeState(savedTheme === 'alt');

            themeToggle.addEventListener('click', () => {
                const isAlt = !document.body.classList.contains('alt-theme');
                applyThemeState(isAlt);
                localStorage.setItem('iborovi-theme', isAlt ? 'alt' : 'default');
            });
        }

        // Add hover effects to action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });

        // Add tilt effect to hero avatar
        const heroAvatar = document.querySelector('.hero-avatar');
        if (heroAvatar) {
            heroAvatar.addEventListener('mousemove', (e) => {
                const rect = heroAvatar.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const rotateX = (y / rect.height) * 20;
                const rotateY = (x / rect.width) * 20;
                
                heroAvatar.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            heroAvatar.addEventListener('mouseleave', () => {
                heroAvatar.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        }
    }

    setupEasterEggs() {
        // Konami Code
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        // Secret click combination
        let clickCount = 0;
        const logo = document.querySelector('.brand-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                clickCount++;
                if (clickCount >= 7) {
                    this.activateSecretMode();
                    clickCount = 0;
                }
                setTimeout(() => clickCount = 0, 2000);
            });
        }
    }

    activateEasterEgg() {
        console.log('🎉 Easter Egg Activated!');
        
        // Create rainbow effect
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        // Spawn confetti
        this.createConfetti();
        
        // Play sound effect (if available)
        this.playSound('achievement');
    }

    activateSecretMode() {
        console.log('🚀 Secret Gaming Mode Activated!');
        
        // Add special effects
        document.body.classList.add('secret-mode');
        
        // Enhanced particle effects
        if (this.particleSystem) {
            this.particleSystem.material.size = 4;
            this.particleSystem.material.opacity = 1;
        }
    }

    createConfetti() {
        const colors = ['#ff0080', '#00d4ff', '#8b5cf6', '#00ff88', '#ffd700'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    playSound(type) {
        // Audio feedback (requires audio files)
        const audio = new Audio(`sounds/${type}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(() => {
            console.log('Audio not available');
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Parallax effects
        const orbs = document.querySelectorAll('.bg-orb');
        orbs.forEach((orb, index) => {
            const speed = 0.5 + (index * 0.1);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    handleResize() {
        if (this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    handleWheel(e) {
        // Smooth section scrolling
        if (Math.abs(e.deltaY) > 50) {
            e.preventDefault();
            
            const sections = [
                document.querySelector('.hero-section'),
                document.querySelector('.games-section'),
                document.querySelector('.stream-section'),
                document.querySelector('.epic-footer')
            ].filter(section => section);
            
            const currentSection = this.getCurrentSection(sections);
            let targetSection;
            
            if (e.deltaY > 0) {
                // Scroll down
                const currentIndex = sections.indexOf(currentSection);
                targetSection = sections[currentIndex + 1] || sections[sections.length - 1];
            } else {
                // Scroll up
                const currentIndex = sections.indexOf(currentSection);
                targetSection = sections[currentIndex - 1] || sections[0];
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    getCurrentSection(sections) {
        const scrollY = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop && scrollY <= sectionBottom) {
                return section;
            }
        }
        
        return sections[0];
    }
}

// 🚀 Initialize the Epic Gaming Engine
window.addEventListener('load', () => {
    new EpicGamingEngine();
});

// Additional CSS animations via JavaScript
const additionalStyles = `
.float-animation {
    animation: floatUp 3s ease-in-out infinite;
}

@keyframes floatUp {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}

.click-ripple {
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.6), transparent);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    animation: rippleExpand 1s ease-out forwards;
}

@keyframes rippleExpand {
    to {
        width: 300px;
        height: 300px;
        opacity: 0;
    }
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

.confetti {
    position: fixed;
    width: 10px;
    height: 10px;
    z-index: 9999;
    pointer-events: none;
    animation: confettiFall 3s linear forwards;
}

@keyframes confettiFall {
    to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
}

.secret-mode {
    animation: secretGlow 2s ease-in-out infinite;
}

@keyframes secretGlow {
    0%, 100% { filter: brightness(1) saturate(1); }
    50% { filter: brightness(1.2) saturate(1.5); }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
