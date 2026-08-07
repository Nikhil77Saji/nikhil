/* ==========================================================================
   Nikhil Saji - Portfolio Script (Studio HUD & Constellation Canvas)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Interactive Animated Canvas Background (Cyan & Amber Constellation Mesh)
     -------------------------------------------------------------------------- */
  const initCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: null,
      y: null,
      radius: 160
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.isCyan = Math.random() > 0.45;
        this.color = this.isCyan ? 'rgba(56, 189, 248, ' : 'rgba(249, 115, 22, ';
        this.alpha = Math.random() * 0.7 + 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 1.8;
            this.y -= forceDirectionY * force * 1.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.isCyan ? 'rgba(56, 189, 248, 0.6)' : 'rgba(249, 115, 22, 0.6)';
        ctx.fill();
      }
    }

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 11000), 90);

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 135) {
            const opacity = 1 - distance / 135;
            const strokeColor = particles[a].isCyan
              ? `rgba(56, 189, 248, ${opacity * 0.3})`
              : `rgba(249, 115, 22, ${opacity * 0.25})`;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[a].x - mouse.x;
          const dy = particles[a].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const opacity = 1 - distance / mouse.radius;
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animate);
    };

    createParticles();
    animate();
  };

  initCanvas();

  /* --------------------------------------------------------------------------
     2. Dynamic Typing Headline Animation
     -------------------------------------------------------------------------- */
  const typedTextElement = document.getElementById('typed-text');
  if (typedTextElement) {
    const words = [
      'Scalable Web Portals',
      'Full-Stack Applications',
      'AI & Machine Learning Solutions',
      'Modern UI/UX Interfaces'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    };

    type();
  }

  /* --------------------------------------------------------------------------
     3. Header & Navigation Behavior
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Projects Filter & Detail Modal
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Data
  const projectDetails = {
    pulse: {
      title: 'Pulse! Health Overview Interface',
      category: 'UI / UX Design',
      img: 'assets/pulse.png',
      description: 'Pulse is an innovative, sleek mobile app interface designed for health and wellness tracking. Built with visual hierarchy in mind, it features custom real-time heart rate graphs, sleep diagnostics, user activity statistics, and intuitive dark mode aesthetics.',
      tech: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
      link: 'https://lnkd.in/ezHDZh7a'
    },
    parking: {
      title: 'Smart AI Parking Assistant',
      category: 'AI / ML + Full-Stack',
      img: 'assets/ai_parking.png',
      description: 'An intelligent smart parking management portal that integrates computer vision & machine learning logic with an interactive web control panel. Displays real-time lot occupancy grid, space reservation stats, and vehicle analytics.',
      tech: ['React.js', 'Node.js', 'Python AI Model', 'CSS Grid', 'REST APIs'],
      link: 'https://www.linkedin.com/in/nikhil-saji-4189632b1/'
    },
    fullstack_app: {
      title: 'Node & React Web Ecosystem',
      category: 'Full-Stack Development',
      img: 'assets/pulse.png',
      description: 'Comprehensive full-stack web application designed during my internship at SKOLAR. Features secure user authentication, optimized backend API endpoints, modular component architecture, and responsive glassmorphism interfaces.',
      tech: ['Node.js', 'Express.js', 'React.js', 'MongoDB / SQL', 'JavaScript'],
      link: 'https://www.linkedin.com/in/nikhil-saji-4189632b1/'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalTech = document.getElementById('modal-tech');
  const modalLink = document.getElementById('modal-link');

  document.querySelectorAll('.open-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = projectDetails[projectKey];

      if (data) {
        modalImg.src = data.img;
        modalCategory.textContent = data.category;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.description;
        modalLink.href = data.link;

        modalTech.innerHTML = data.tech
          .map((tech) => `<span class="tech-tag">${tech}</span>`)
          .join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Contact Form Simulation & Handling
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        formStatus.classList.add('success');
        formStatus.style.display = 'block';
        contactForm.reset();

        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 6000);
      }, 1200);
    });
  }

  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
