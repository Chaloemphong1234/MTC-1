document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile nav when clicking a link
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Active Link Detection based on URL ---
    const currentLocation = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links li a');

    // Default to home if on root or ends with /
    let currentPage = currentLocation.substring(currentLocation.lastIndexOf('/') + 1);
    if (currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }

    navItems.forEach(item => {
        const itemPage = item.getAttribute('href');
        if (itemPage === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // --- Sticky Navbar shadow effect on scroll ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.pageYOffset > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        }
    });

    // --- Fade-in Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.section-fade');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');

                // Animate skill bars specifically when the section containing them is visible
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 200);
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // --- Add basic portfolio filter functionality ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // The actual logic would go here to show/hide cards.
                // Left intentionally visually only for mock data demonstration.
            });
        });
    }
});

// --- Modal Logic (Gallery) ---
function openModal(element) {
    const modal = document.getElementById("imageModal");
    if (!modal) return;

    const fullImg = document.getElementById("fullImg");
    const caption = document.getElementById("caption");
    const imgElement = element.querySelector('img');

    if (imgElement) {
        const imgSource = imgElement.src;
        const imgAlt = imgElement.alt;

        modal.style.display = "flex";
        // Short delay to allow display flex to apply before opacity for smooth fade in
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);

        // Use higher res if loading from unsplash
        if (imgSource.includes('&w=')) {
            fullImg.src = imgSource.replace(/&w=\d+/, '&w=1200');
        } else {
            fullImg.src = imgSource;
        }

        caption.innerHTML = imgAlt;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (!modal) return;

    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // Wait for transition
}

// Close modal when clicking outside the image or project modal
window.onclick = function (event) {
    const imageModal = document.getElementById("imageModal");
    const projectModal = document.getElementById("projectModal");
    if (event.target == imageModal) {
        closeModal();
    }
    if (event.target == projectModal) {
        closeProjectModal();
    }
}

// --- Project Modal Logic ---
function openProjectModal(element) {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    // Find the parent card
    const card = element.closest('.portfolio-card');
    const title = card.querySelector('h3').innerText;
    const desc = card.querySelector('.card-desc').innerText;
    const imgSrc = card.querySelector('img').src;

    // Extract tech tags layout
    const tagsWrapper = card.querySelector('.tech-stack');
    const tagsHtml = tagsWrapper ? tagsWrapper.innerHTML : '';

    // Extract hidden data from card
    const modalData = card.querySelector('.modal-data');
    let extraText = '<p style="color: #555; line-height: 1.8;">รายละเอียดเพิ่มเติม: (ไม่มีข้อมูล)</p>';
    let extraGallery = '';
    const seedUrl = encodeURIComponent(title.replace(/\s+/g, ''));

    if (modalData) {
        const textElement = modalData.querySelector('.modal-extra-desc');
        const imagesElement = modalData.querySelector('.modal-extra-images');

        if (textElement) {
            extraText = `<div style="color: #555; line-height: 1.8;">${textElement.innerHTML}</div>`;
        }

        if (imagesElement) {
            const images = imagesElement.querySelectorAll('img');
            if (images.length > 0) {
                let imgTags = '';
                images.forEach(img => {
                    imgTags += `<img src="${img.src}" style="width: 100%; border-radius: 8px; height: 250px; object-fit: cover;">`;
                });
                extraGallery = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; grid-column: 1 / -1;">${imgTags}</div>`;
            } else {
                // Default placeholders if no custom images
                extraGallery = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; grid-column: 1 / -1;">
                        <img src="https://picsum.photos/seed/${seedUrl}1/800/600" style="width: 100%; border-radius: 8px; height: 250px; object-fit: cover;">
                        <img src="https://picsum.photos/seed/${seedUrl}2/800/600" style="width: 100%; border-radius: 8px; height: 250px; object-fit: cover;">
                    </div>
                `;
            }
        }
    }

    const modalBody = document.getElementById("projectModalBody");
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <img src="${imgSrc.replace(/&w=\d+/, '&w=800')}" style="width: 100%; border-radius: 8px; grid-column: 1 / -1; max-height: 400px; object-fit: cover;">
            ${extraGallery}
        </div>
        <h2 style="color: #333; margin-bottom: 15px;">${title}</h2>
        <div class="tech-stack" style="margin-bottom: 20px;">${tagsHtml}</div>
        <p style="color: #555; line-height: 1.8; margin-bottom: 15px;">${desc}</p>
        ${extraText}
    `;

    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

function closeProjectModal() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}
