document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('light-theme', savedTheme === 'light');
        updateThemeIcon();
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        updateThemeIcon();
        // Save theme preference
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('light-theme')) {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }

    // Smooth scrolling for navigation links
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

    // Load and display projects
    async function loadProjects() {
        try {
            const response = await fetch('projects_display.json');
            const data = await response.json();
            const projectsContainer = document.getElementById('projectsContainer');
            
            projectsContainer.innerHTML = data.projects.map(project => `
                <div class="project-card">
                    <div class="project-header">
                        <a href="${project.githubUrl}" class="project-name">${project.name}</a>
                        <span class="project-date">${project.date}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-links">
                        <a href="${project.githubUrl}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i>
                            View on GitHub
                        </a>
                        ${project.liveUrl ? `
                        <a href="${project.liveUrl}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            Live
                        </a>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
            document.getElementById('projectsContainer').innerHTML = `
                <p class="error-message">Failed to load projects. Please try again later.</p>
            `;
        }
    }

    // Load projects when the page loads
    loadProjects();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});
