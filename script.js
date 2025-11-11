// Advanced animations and interactions for Bridgy landing page

document.addEventListener('DOMContentLoaded', function() {
    
    // Parallax scrolling effect
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        // Cache element data to prevent repeated DOM reads
        const parallaxData = Array.from(parallaxElements).map(element => ({
            element,
            speed: parseFloat(element.dataset.parallax) || 0.5
        }));
        
        let ticking = false;
        
        function updateParallax() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            parallaxData.forEach(({ element, speed }) => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollTop;
                const elementHeight = rect.height;
                
                // Check if element is in viewport
                if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
                    const yPos = -(scrollTop - elementTop) * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateParallax);
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
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
    
    // Enhanced scroll reveal with intersection observer
    function initAdvancedScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.section-title, .solution-subtitle, .hero-subtitle'
        );
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger effect for child elements
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Dedicated roadmap timeline animation
    function initRoadmapAnimations() {
        const roadmapSection = document.querySelector('.roadmap');
        const timeline = document.querySelector('.timeline');
        const timelineItems = document.querySelectorAll('.timeline-item');
        const roadmapTitle = document.querySelector('.roadmap .section-title');
        const roadmapSubtitle = document.querySelector('.roadmap .solution-subtitle');
        
        if (!roadmapSection || !timeline || !timelineItems.length) return;
        
        // Observer for roadmap section entry
        const roadmapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate title and subtitle first
                    setTimeout(() => {
                        if (roadmapTitle) roadmapTitle.classList.add('visible');
                    }, 100);
                    
                    setTimeout(() => {
                        if (roadmapSubtitle) roadmapSubtitle.classList.add('visible');
                    }, 300);
                    
                    // Then animate the timeline line
                    setTimeout(() => {
                        timeline.classList.add('visible');
                    }, 600);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observer for individual timeline items
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe the roadmap section
        roadmapObserver.observe(roadmapSection);
        
        // Observe each timeline item
        timelineItems.forEach(item => {
            itemObserver.observe(item);
        });
        
        // Add mouse interaction for timeline items
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(0) translateY(-5px) scale(1.02)';
                item.style.zIndex = '10';
                
                const badge = item.querySelector('.timeline-badge');
                if (badge) {
                    badge.style.transform = 'scale(1.1) rotate(0deg)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0) translateY(0) scale(1)';
                item.style.zIndex = '';
                
                const badge = item.querySelector('.timeline-badge');
                if (badge) {
                    badge.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Magnetic button effect
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    // Create background particle effect
    function createParticleBackground() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
            pointer-events: none;
        `;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: rgba(139, 92, 246, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 20}s linear infinite;
            `;
            particleContainer.appendChild(particle);
        }
        
        document.body.appendChild(particleContainer);
        
        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                from {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                to {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Smooth section transitions
    function initSmoothSectionTransitions() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                section.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Icon glow effect on hover
    function addIconGlowEffect() {
        const icons = document.querySelectorAll('.problem-icon, .solution-icon, .limitation-icon, .audience-icon');
        
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.filter = 'drop-shadow(0 0 40px rgba(139, 92, 246, 1))';
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.filter = '';
                icon.style.transform = '';
            });
        });
    }
    
    // Dynamic gradient background
    function initDynamicGradient() {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
        });
        
        function updateGradient() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            const gradientX = currentX * 50 + 25;
            const gradientY = currentY * 50 + 25;
            
            document.body.style.background = `
                linear-gradient(135deg, 
                    #0f0f23 0%, 
                    #1a1a3e ${gradientX}%, 
                    #2d1b69 50%, 
                    #4c1d95 ${gradientY}%, 
                    #7c3aed 100%)
            `;
            
            requestAnimationFrame(updateGradient);
        }
        
        updateGradient();
    }
    
    // Initialize all effects
    initParallax();
    init3DTilt();
    initScrollAnimations();
    enhanceFloatingElements();
    enhanceLiquidFlow();
    animateCounters();
    enhanceButtons();
    addTitleAnimation();
    initAdvancedScrollAnimations();
    initRoadmapAnimations();
    initMagneticButtons();
    createParticleBackground();
    initSmoothSectionTransitions();
    addIconGlowEffect();
    
    // Only init certain effects on desktop
    if (window.innerWidth > 768) {
        initDynamicGradient();
    }
    
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

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Reduce animations on prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
    document.querySelectorAll('[data-parallax]').forEach(el => {
        el.removeAttribute('data-parallax');
    });
}