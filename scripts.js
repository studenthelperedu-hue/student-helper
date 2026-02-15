document.addEventListener('DOMContentLoaded', () => {
    console.log('Student Helper Website Loaded');

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Sticky Header Shadow on Scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Active State for Mobile Bottom Nav
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /**
     * Re-introducing Premium 3D Tilt Effect
     * Subtle, high-performance physics-based tilt.
     */
    class TiltCard {
        constructor(el) {
            this.el = el;
            this.state = {
                mouseX: 0, mouseY: 0,
                targetX: 0, targetY: 0,
                currentX: 0, currentY: 0,
                scale: 1,
                active: false
            };
            this.config = {
                maxRot: 8,   // Reduced from 10 for a "cleaner" feel
                speed: 0.12, // Slightly snappier
                scale: 1.02  // Subtle lift
            };
            this.bindEvents();
            this.animate();
        }

        bindEvents() {
            this.el.addEventListener('mouseenter', () => {
                this.state.active = true;
                this.state.scale = this.config.scale;
                this.el.style.zIndex = "10";
            });

            this.el.addEventListener('mousemove', (e) => {
                const rect = this.el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate rotation range (-1 to 1)
                const xPct = (x / rect.width) * 2 - 1;
                const yPct = (y / rect.height) * 2 - 1;

                this.state.targetY = xPct * this.config.maxRot;
                this.state.targetX = -yPct * this.config.maxRot;
            });

            this.el.addEventListener('mouseleave', () => {
                this.state.active = false;
                this.state.targetX = 0;
                this.state.targetY = 0;
                this.state.scale = 1;
                this.el.style.zIndex = "1";
            });
        }

        lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        animate() {
            // Only calculate if active or moving
            if (this.state.active || Math.abs(this.state.currentX) > 0.01 || Math.abs(this.state.currentY) > 0.01) {
                this.state.currentX = this.lerp(this.state.currentX, this.state.targetX, this.config.speed);
                this.state.currentY = this.lerp(this.state.currentY, this.state.targetY, this.config.speed);

                // Optimized CSS Variable updates
                this.el.style.transform = `
                    perspective(1000px)
                    rotateX(${this.state.currentX.toFixed(2)}deg)
                    rotateY(${this.state.currentY.toFixed(2)}deg)
                    scale(${this.state.scale})
                `;
            }
            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize Tilt on all Clean Cards and Course Cards
    document.querySelectorAll('.card-clean, .course-card').forEach(card => {
        // Add required CSS styles for 3D context if not present
        card.style.transformStyle = 'preserve-3d';
        card.style.backfaceVisibility = 'hidden';
        card.style.willChange = 'transform';

        new TiltCard(card);
    });

    // Optional: Intersection Observer for simple fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* --- Modal Logic --- */
    const modal = document.getElementById('talent-modal');
    const modalOpenBtns = document.querySelectorAll('.open-modal-btn');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalForm = document.getElementById('talent-form');

    if (modal) {
        // Open Modal
        modalOpenBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close Modal
        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Form Submit
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // DATA CAPTURE SIMULATION
                // In a real app, you would send this 'data' object to your backend
                const formData = new FormData(modalForm);
                const data = {};
                // Note: FormData won't capture non-form-element values unless they are inputs
                // For this static site, we are just simulating the delay and success.
                console.log('Talent Search Registration Initiated');

                // Simulate AJAX
                const btn = modalForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;

                // Visual Feedback
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                btn.disabled = true;
                btn.style.opacity = '0.8';

                setTimeout(() => {
                    // Success State
                    btn.innerHTML = '<i class="fas fa-check"></i> Registration Successful';
                    btn.style.backgroundColor = '#16A34A'; // Green
                    btn.style.borderColor = '#16A34A';
                    btn.style.opacity = '1';

                    setTimeout(() => {
                        closeModal();
                        modalForm.reset();
                        // Reset Button
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                        btn.style.borderColor = '';

                        // Native Alert as feedback
                        alert('Thank you! Your registration for Talent Search Exam is successful.\nWe will contact you shortly regarding the exam schedule.');
                    }, 1500);
                }, 1500);
            });
        }
    }

    // --- Enrollment Modal Logic ---
    const enrollModal = document.getElementById('enroll-modal');
    const enrollBtns = document.querySelectorAll('.open-enroll-modal');
    const enrollCloseBtn = document.querySelector('.modal-close-enroll');
    const enrollForm = document.getElementById('enroll-form');
    const courseNameField = document.getElementById('course-name-field');
    const coursePriceField = document.getElementById('course-price-field');

    if (enrollModal) {
        // Open Modal & Fill Data
        enrollBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const courseName = btn.getAttribute('data-course');
                const coursePrice = btn.getAttribute('data-price');

                courseNameField.value = courseName;
                coursePriceField.textContent = coursePrice;

                enrollModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close Modal
        const closeEnrollModal = () => {
            enrollModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        if (enrollCloseBtn) enrollCloseBtn.addEventListener('click', closeEnrollModal);

        enrollModal.addEventListener('click', (e) => {
            if (e.target === enrollModal) closeEnrollModal();
        });

        // Handle Submit
        if (enrollForm) {
            enrollForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = enrollForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;

                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                btn.disabled = true;

                // Simulate processing
                setTimeout(() => {
                    // Send Email/WhatsApp notification simulation
                    console.log('Enrollment Submitted for:', courseNameField.value);
                    console.log('WhatsApp Redirect Triggered');

                    btn.innerHTML = '<i class="fas fa-check"></i> Enrollment Sent!';
                    btn.style.backgroundColor = '#16A34A';

                    setTimeout(() => {
                        alert('Thank you! Your payment screenshot has been received. We will verify and enroll you within 24 hours. A confirmation email and WhatsApp message have been sent.');
                        closeEnrollModal();
                        enrollForm.reset();
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                    }, 2000);
                }, 1500);
            });
        }
    }
});
