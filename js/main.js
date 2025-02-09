// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');

        if (navbarCollapse.classList.contains('show') &&
            !navbarCollapse.contains(e.target) &&
            !navbarToggler.contains(e.target)) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });

    // Typing Animation
    const titles = [
        "Computer Engineer",
        "AI Engineer",
    ];

    const typingText = document.querySelector('.typing-text');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 70;
    let erasingDelay = 35;
    let newTextDelay = 1500;

    function typeText() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = erasingDelay;
        } else {
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 70;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingDelay = newTextDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingDelay = 300;
        }

        setTimeout(typeText, typingDelay);
    }

    typeText();

    // Initialize AOS
    AOS.init();

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');

    function updateNavbar() {
        if (window.scrollY > heroSection.offsetHeight * 0.2) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    updateNavbar();

    // Add scroll event listener
    window.addEventListener('scroll', updateNavbar);

    // Highlight active nav item
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavItem() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavItem);
    highlightNavItem(); // Initial check

    // Close navbar collapse when window is resized
    window.addEventListener('resize', function () {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarCollapse.classList.remove('show');
    });

    // Carousel functionality
    function initCarousel(containerClass) {
        const container = document.querySelector(`.${containerClass}`);
        if (!container) return;

        const wrapper = container.querySelector('.carousel-wrapper');
        const prevBtn = container.querySelector('.carousel-button.prev');
        const nextBtn = container.querySelector('.carousel-button.next');
        let position = 0;
        let autoSlideInterval = null;

        const slide = (direction) => {
            const itemWidth = wrapper.children[0].offsetWidth + 32; // width + gap
            const visibleItems = Math.floor(container.offsetWidth / itemWidth);
            const maxPosition = -(wrapper.children.length - visibleItems) * itemWidth;

            position += direction * itemWidth;
            position = Math.min(0, Math.max(position, maxPosition));

            wrapper.style.transform = `translateX(${position}px)`;
        };

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                const itemWidth = wrapper.children[0].offsetWidth + 32;
                const visibleItems = Math.floor(container.offsetWidth / itemWidth);
                const maxPosition = -(wrapper.children.length - visibleItems) * itemWidth;

                if (position <= maxPosition) {
                    position = 0;
                } else {
                    position -= itemWidth;
                }

                wrapper.style.transform = `translateX(${position}px)`;
            }, 3000);
        }

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            slide(1);
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            slide(-1);
            startAutoSlide();
        });

        // Add hover handlers for all carousel items
        const carouselItems = wrapper.querySelectorAll('.project-card, .skill-category, .blog-card');
        carouselItems.forEach(item => {
            item.addEventListener('mouseenter', stopAutoSlide);
            item.addEventListener('mouseleave', startAutoSlide);
        });

        // Touch events
        wrapper.addEventListener('touchstart', (e) => {
            stopAutoSlide();
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const diff = e.touches[0].clientX - wrapper.offsetLeft;
            wrapper.style.transform = `translateX(${position + diff}px)`;
        }, { passive: false });

        wrapper.addEventListener('touchend', () => {
            startAutoSlide();
        });

        // Start auto-sliding
        startAutoSlide();
    }

    // Initialize carousels
    initCarousel('carousel-skills');
    initCarousel('carousel-projects');
    initCarousel('carousel-blogs');

    // Mobil menü kapatma iyileştirmesi
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });
});

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
} 

// Skill Progress Bar
document.addEventListener("DOMContentLoaded", function () {
    const skillProgressBars = document.querySelectorAll(".skill-progress");

    // Intersection Observer callback function
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute("data-skill");
          progressBar.style.width = `${targetWidth}%`;
          observer.unobserve(progressBar); 
        }
      });
    };

    // Intersection Observer options
    const observerOptions = {
      threshold: 0.5, 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    skillProgressBars.forEach((progressBar) => {
      observer.observe(progressBar);
    });
  });
