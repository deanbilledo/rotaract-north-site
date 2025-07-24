// Gallery JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery data - Images numbered 1.jpg to 300.jpg
    const galleryImages = [];
    
    // Generate image data for all 300 images with distributed categories
    for (let i = 1; i <= 300; i++) {
        let category, alt;
        
        // Distribute images across categories
        if (i <= 75) {
            category = 'projects';
            alt = `Community Project ${i}`;
        } else if (i <= 150) {
            category = 'events';
            alt = `Club Event ${i - 75}`;
        } else if (i <= 225) {
            category = 'meetings';
            alt = `Club Meeting ${i - 150}`;
        } else {
            category = 'community';
            alt = `Community Outreach ${i - 225}`;
        }
        
        galleryImages.push({
            src: `rotaract-north-gallery/${i}.jpg`,
            alt: alt,
            category: category
        });
    }

    let currentImages = galleryImages;
    let currentImageIndex = 0;
    let visibleImages = 12; // Number of images to show initially
    
    const galleryContainer = document.getElementById('gallery-container');
    const loadMoreBtn = document.getElementById('load-more');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.getElementById('closeModal');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');

    // Initialize gallery
    function initGallery() {
        renderGallery();
        setupEventListeners();
    }

    // Render gallery images
    function renderGallery() {
        galleryContainer.innerHTML = '';
        const imagesToShow = currentImages.slice(0, visibleImages);
        
        imagesToShow.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });

        // Show/hide load more button
        loadMoreBtn.style.display = visibleImages >= currentImages.length ? 'none' : 'inline-flex';
        
        // Add animation to newly loaded images
        animateGalleryItems();
    }

    // Create gallery item element
    function createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer opacity-0';
        item.dataset.category = image.category;
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="relative aspect-square overflow-hidden">
                <img src="${image.src}" alt="${image.alt}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy-load"
                     onerror="this.src='img/placeholder.jpg'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <i class="fas fa-expand-alt text-white text-sm"></i>
                </div>
            </div>
        `;
        
        return item;
    }

    // Animate gallery items on load
    function animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('opacity-0');
                item.classList.add('animate-fadeInUp');
            }, index * 100);
        });
    }

    // Filter gallery by category
    function filterGallery(category) {
        if (category === 'all') {
            currentImages = galleryImages;
        } else {
            currentImages = galleryImages.filter(image => image.category === category);
        }
        
        visibleImages = 12; // Reset visible images count
        renderGallery();
        
        // Update filter button states
        filterBtns.forEach(btn => {
            btn.classList.remove('active', 'bg-rotaract-primary', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        activeBtn.classList.add('active', 'bg-rotaract-primary', 'text-white');
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    }

    // Load more images
    function loadMoreImages() {
        visibleImages += 12;
        renderGallery();
        
        // Smooth scroll to new images
        const newItems = document.querySelectorAll('.gallery-item');
        if (newItems.length > 12) {
            newItems[newItems.length - 12].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    // Open image modal
    function openModal(index) {
        currentImageIndex = index;
        const image = currentImages[index];
        
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = '';
        
        imageModal.classList.remove('hidden');
        imageModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images
        preloadAdjacentImages();
    }

    // Close image modal
    function closeImageModal() {
        imageModal.classList.add('hidden');
        imageModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    // Navigate to previous image
    function showPreviousImage() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImages.length - 1;
        updateModalImage();
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = currentImageIndex < currentImages.length - 1 ? currentImageIndex + 1 : 0;
        updateModalImage();
    }

    // Update modal image
    function updateModalImage() {
        const image = currentImages[currentImageIndex];
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = '';
        preloadAdjacentImages();
    }

    // Preload adjacent images for smooth navigation
    function preloadAdjacentImages() {
        const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImages.length - 1;
        const nextIndex = currentImageIndex < currentImages.length - 1 ? currentImageIndex + 1 : 0;
        
        // Preload previous image
        const prevImg = new Image();
        prevImg.src = currentImages[prevIndex].src;
        
        // Preload next image
        const nextImg = new Image();
        nextImg.src = currentImages[nextIndex].src;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.filter;
                filterGallery(category);
            });
        });

        // Load more button
        loadMoreBtn.addEventListener('click', loadMoreImages);

        // Gallery item clicks
        galleryContainer.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = parseInt(galleryItem.dataset.index);
                openModal(index);
            }
        });

        // Modal controls
        closeModal.addEventListener('click', closeImageModal);
        prevImage.addEventListener('click', showPreviousImage);
        nextImage.addEventListener('click', showNextImage);

        // Close modal on outside click
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!imageModal.classList.contains('hidden')) {
                switch (e.key) {
                    case 'Escape':
                        closeImageModal();
                        break;
                    case 'ArrowLeft':
                        showPreviousImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });

        // Mobile menu functionality
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                const isActive = mobileMenu.classList.toggle('active');
                navLinks.classList.toggle('hidden');
                
                const spans = mobileMenu.querySelectorAll('span');
                if (isActive) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[1].style.transform = 'translateX(10px)';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[1].style.transform = 'none';
                    spans[2].style.transform = 'none';
                }
            });

            // Close mobile menu when clicking on nav links
            const mobileNavLinks = navLinks.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    navLinks.classList.add('hidden');
                    
                    const spans = mobileMenu.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[1].style.transform = 'none';
                    spans[2].style.transform = 'none';
                });
            });
        }
    }

    // Lazy loading for images
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy-load');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Navbar scroll effect
    function setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbar() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    navbar.style.transform = 'translate(-50%, -100%)';
                    navbar.style.opacity = '0.9';
                } else {
                    navbar.style.transform = 'translate(-50%, 0)';
                    navbar.style.opacity = '1';
                }
                navbar.classList.add('scrolled');
            } else {
                navbar.style.transform = 'translate(-50%, 0)';
                navbar.style.opacity = '1';
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }

        function requestNavbarUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestNavbarUpdate, { passive: true });
    }

    // Initialize everything
    initGallery();
    setupLazyLoading();
    setupNavbarScroll();
});

// Smooth scrolling for anchor links
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

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
            } mr-3"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
