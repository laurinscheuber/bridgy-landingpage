// Advanced animations and interactions for Bridgy landing page

document.addEventListener('DOMContentLoaded', function() {
    
    // Parallax scrolling effect
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        function updateParallax() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            parallaxElements.forEach((element) => {
                const elementTop = element.offsetTop;
                const elementHeight = element.offsetHeight;
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                
                // Check if element is in viewport
                if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
                    const yPos = -(scrollTop - elementTop) * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        }
        
        // Throttled scroll event
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
                setTimeout(() => { ticking = false; }, 16);
            }
        }
        
        window.addEventListener('scroll', requestTick);
        updateParallax(); // Initial call
    }
    
    // 3D tilt effect for cards
    function init3DTilt() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }
    
    // Smooth reveal animations on scroll
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.glass-card, .solution-item, .feature-card, .use-case');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    }
    
    // Floating elements animation enhancement
    function enhanceFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-item');
        
        floatingElements.forEach((element, index) => {
            // Add mouse interaction
            element.addEventListener('mouseenter', () => {
                element.style.animationPlayState = 'paused';
                element.style.transform = 'scale(1.2) translateY(-10px)';
                element.style.filter = 'drop-shadow(0 0 30px rgba(139, 92, 246, 1))';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.animationPlayState = 'running';
                element.style.transform = '';
                element.style.filter = 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))';
            });
        });
    }
    
    // Liquid flow animation with mouse interaction
    function enhanceLiquidFlow() {
        const liquidFlow = document.querySelector('.liquid-flow');
        if (!liquidFlow) return;
        
        const heroVisual = document.querySelector('.hero-visual');
        
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const translateX = (x - 0.5) * 50;
            const translateY = (y - 0.5) * 30;
            
            liquidFlow.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${1 + (x * 0.2)})`;
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            liquidFlow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    // Animated counter for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = counter.textContent;
                    let count = 0;
                    const increment = target.includes('%') ? 1 : 1;
                    const finalValue = parseInt(target);
                    
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= finalValue) {
                            count = finalValue;
                            clearInterval(timer);
                        }
                        counter.textContent = count + (target.includes('%') ? '%' : '');
                    }, 30);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Button hover effects with ripple
    function enhanceButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    background-color: rgba(255, 255, 255, 0.3);
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Gradient background animation
    function animateBackground() {
        let angle = 135;
        const body = document.body;
        
        setInterval(() => {
            angle += 0.5;
            if (angle >= 360) angle = 0;
            
            body.style.background = `linear-gradient(${angle}deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #4c1d95 75%, #7c3aed 100%)`;
        }, 100);
    }
    
    // Simple fade-in effect for title
    function addTitleAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        // Start invisible
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        
        // Animate in after short delay
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Initialize all effects
    initParallax();
    init3DTilt();
    initScrollAnimations();
    enhanceFloatingElements();
    enhanceLiquidFlow();
    animateCounters();
    enhanceButtons();
    animateBackground();
    addTitleAnimation();
    
    // Cursor trail effect
    function initCursorTrail() {
        const trail = [];
        const trailLength = 20;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(139, 92, 246, ${1 - i / trailLength});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function updateTrail() {
            for (let i = trail.length - 1; i > 0; i--) {
                trail[i].style.left = trail[i - 1].style.left;
                trail[i].style.top = trail[i - 1].style.top;
            }
            
            trail[0].style.left = mouseX + 'px';
            trail[0].style.top = mouseY + 'px';
            
            requestAnimationFrame(updateTrail);
        }
        
        updateTrail();
    }
    
    // Only initialize cursor trail on desktop
    if (window.innerWidth > 768) {
        initCursorTrail();
    }
});

// Performance optimization: Disable animations on slower devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
}