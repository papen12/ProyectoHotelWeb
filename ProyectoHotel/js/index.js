document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = Array.from(document.querySelectorAll('.slider-slide'));
    const dots = Array.from(document.querySelectorAll('.slider-dots .dot'));
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    function goToSlide(index) {
        currentSlide = index;
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    let autoSlide = setInterval(nextSlide, 5000);
    
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });
    
    const carouselTrack = document.querySelector('.carousel-track');
    const serviceSlides = Array.from(document.querySelectorAll('.service-slide'));
    const carouselDots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
    const carouselPrevBtn = document.querySelector('.carousel-btn-prev');
    const carouselNextBtn = document.querySelector('.carousel-btn-next');
    
    let currentCarouselIndex = 0;
    const slidesPerView = getSlidesPerView();
    
    function getSlidesPerView() {
        if (window.innerWidth < 480) return 1;
        if (window.innerWidth < 768) return 2;
        return 3;
    }
    
    function updateCarousel() {
        const slideWidth = serviceSlides[0].getBoundingClientRect().width + 30;
        const translateX = -currentCarouselIndex * slideWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentCarouselIndex / slidesPerView));
        });
    }
    
    function nextCarouselSlide() {
        const maxIndex = serviceSlides.length - slidesPerView;
        currentCarouselIndex = currentCarouselIndex < maxIndex ? currentCarouselIndex + 1 : 0;
        updateCarousel();
    }
    
    function prevCarouselSlide() {
        const maxIndex = serviceSlides.length - slidesPerView;
        currentCarouselIndex = currentCarouselIndex > 0 ? currentCarouselIndex - 1 : maxIndex;
        updateCarousel();
    }
    
    carouselNextBtn.addEventListener('click', nextCarouselSlide);
    carouselPrevBtn.addEventListener('click', prevCarouselSlide);
    
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentCarouselIndex = index * slidesPerView;
            updateCarousel();
        });
    });
    
   })