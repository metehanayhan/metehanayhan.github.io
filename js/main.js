// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (
      navbarCollapse.classList.contains("show") &&
      !navbarCollapse.contains(e.target) &&
      !navbarToggler.contains(e.target)
    ) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });

  // Typing Animation
  const titles = ["Full-Stack Engineer", "AI Engineer", "Computer Engineer"];

  const typingText = document.querySelector(".typing-text");
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
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Check for saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Navbar scroll behavior
  const navbar = document.querySelector(".navbar");
  const heroSection = document.querySelector(".hero-section");

  function updateNavbar() {
    if (window.scrollY > heroSection.offsetHeight * 0.2) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Initial check
  updateNavbar();

  // Add scroll event listener
  window.addEventListener("scroll", updateNavbar);

  // Highlight active nav item
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNavItem() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightNavItem);
  highlightNavItem(); // Initial check

  // Close navbar collapse when window is resized
  window.addEventListener("resize", function () {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    navbarCollapse.classList.remove("show");
  });

  // Carousel functionality
  function initCarousel(containerClass) {
    const container = document.querySelector(`.${containerClass}`);
    if (!container) return;

    const wrapper = container.querySelector(".carousel-wrapper");
    const prevBtn = container.querySelector(".carousel-button.prev");
    const nextBtn = container.querySelector(".carousel-button.next");
    if (!wrapper || !prevBtn || !nextBtn) return;

    let position = 0;
    let autoSlideInterval = null;
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;
    let hasDragged = false;

    // Helpers — declared first so event listeners can reference them safely
    const stopAutoSlide = () => clearInterval(autoSlideInterval);

    const getItemWidth = () => {
      const first = wrapper.children[0];
      if (!first) return 0;
      // Use offsetLeft difference between children for accurate step size
      if (wrapper.children.length > 1) {
        return wrapper.children[1].offsetLeft - wrapper.children[0].offsetLeft;
      }
      return first.offsetWidth;
    };

    const getMaxPosition = () => {
      const iw = getItemWidth();
      if (!iw) return 0;
      const containerW = container.offsetWidth;
      const wrapperW = wrapper.scrollWidth;
      return -(wrapperW - containerW);
    };

    const clamp = (val) => Math.min(0, Math.max(val, getMaxPosition()));

    const setPosition = (pos, animate) => {
      position = clamp(pos);
      wrapper.style.transition = animate ? "transform 0.45s ease" : "none";
      wrapper.style.transform = `translateX(${position}px)`;
    };

    const snapToNearest = () => {
      const iw = getItemWidth();
      if (!iw) return;
      const nearest = Math.round(position / iw) * iw;
      setPosition(nearest, true);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        const maxPos = getMaxPosition();
        const iw = getItemWidth();
        if (!iw) return;
        if (position <= maxPos) {
          setPosition(0, true);
        } else {
          setPosition(position - iw, true);
        }
      }, 3500);
    };

    // --- Arrow buttons ---
    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      setPosition(position + getItemWidth(), true);
      startAutoSlide();
    });
    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      setPosition(position - getItemWidth(), true);
      startAutoSlide();
    });

    // Pause on card hover
    wrapper.querySelectorAll(".project-card, .skill-category, .blog-card").forEach((item) => {
      item.addEventListener("mouseenter", stopAutoSlide);
      item.addEventListener("mouseleave", startAutoSlide);
    });

    // --- Mouse drag ---
    wrapper.addEventListener("mousedown", (e) => {
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startPosition = position;
      wrapper.style.transition = "none";
      wrapper.style.cursor = "grabbing";
      stopAutoSlide();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 4) hasDragged = true;
      wrapper.style.transform = `translateX(${clamp(startPosition + delta)}px)`;
      position = clamp(startPosition + delta);
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = "grab";
      snapToNearest();
      startAutoSlide();
    });

    // Block card clicks if user just dragged
    wrapper.addEventListener("click", (e) => {
      if (hasDragged) e.stopImmediatePropagation();
    }, true);

    // --- Touch drag ---
    wrapper.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startPosition = position;
      wrapper.style.transition = "none";
      stopAutoSlide();
    }, { passive: true });

    wrapper.addEventListener("touchmove", (e) => {
      const delta = e.touches[0].clientX - startX;
      position = clamp(startPosition + delta);
      wrapper.style.transform = `translateX(${position}px)`;
    }, { passive: true });

    wrapper.addEventListener("touchend", () => {
      snapToNearest();
      startAutoSlide();
    });

    startAutoSlide();
  }

  // Initialize carousels
  initCarousel("carousel-skills");
  initCarousel("carousel-projects");
  initCarousel("carousel-blogs");

  // Mobil menü kapatma iyileştirmesi
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    });
  });
});

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("theme-icon");
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
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

// Back to top button
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

