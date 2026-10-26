const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

const paymentButton = document.getElementById('payment-button');

if (paymentButton) {
  paymentButton.addEventListener('click', () => {
    window.open('https://buy.stripe.com/test_00g4j53nJ6Tocv6bII', '_blank');
  });
}

const bookingForm = document.querySelector('#booking-form');
const whatsappNumber = '15551234567';

if (bookingForm) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const payload = {
      name: data.get('name') || 'Client',
      phone: data.get('phone') || 'Not provided',
      service: data.get('service') || 'General beauty appointment',
      date: data.get('date') || 'Flexible',
      notes: data.get('notes') || 'No notes provided',
      paymentMethod: data.get('paymentMethod') || 'cash',
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      const message = encodeURIComponent(
        `Hello Pretty's Parlor,\n\nI would like to book a service.\nName: ${payload.name}\nPhone: ${payload.phone}\nService: ${payload.service}\nPreferred date: ${payload.date}\nPayment option: ${payload.paymentMethod}\nNotes: ${payload.notes}`
      );

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      bookingForm.reset();
    } catch (error) {
      alert(error.message || 'There was a problem saving your booking.');
    }
  });
}

async function loadInstagramFeed() {
  const feed = document.getElementById('instagram-feed');
  if (!feed) return;

  try {
    const response = await fetch('/api/instagram');
    const data = await response.json();

    feed.innerHTML = data.posts
      .slice(0, 4)
      .map(
        (post) => `
          <figure class="post">
            <img src="${post.image}" alt="${post.caption}" />
            <figcaption>${post.caption}</figcaption>
          </figure>
        `
      )
      .join('');
  } catch (error) {
    feed.innerHTML = '<p>Instagram feed unavailable right now.</p>';
  }
}

const galleryCarousel = document.querySelector('.gallery-carousel');

if (galleryCarousel) {
  const slides = Array.from(galleryCarousel.querySelectorAll('.gallery-slide'));
  const prevButton = galleryCarousel.querySelector('.gallery-button.prev');
  const nextButton = galleryCarousel.querySelector('.gallery-button.next');
  let activeIndex = 0;

  const updateGallery = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });
  };

  prevButton?.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    updateGallery(activeIndex);
  });

  nextButton?.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % slides.length;
    updateGallery(activeIndex);
  });

  setInterval(() => {
    if (slides.length > 1) {
      activeIndex = (activeIndex + 1) % slides.length;
      updateGallery(activeIndex);
    }
  }, 4200);
}

const parallaxElements = document.querySelectorAll('.hero-visual, .editorial-feature, .editorial-stack img, .gallery-carousel');

const updateParallax = () => {
  const scrollY = window.scrollY;

  parallaxElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.045;
    const clamped = Math.min(Math.max(offset - 26, -26), 26);
    element.style.setProperty('--parallax-shift', `${clamped}px`);
  });

  if (window.scrollY > 0) {
    document.body.style.setProperty('--parallax-shift', `${scrollY * 0.025}px`);
  }
};

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('load', updateParallax);

loadInstagramFeed();
