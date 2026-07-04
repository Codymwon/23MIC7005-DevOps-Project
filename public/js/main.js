document.addEventListener('DOMContentLoaded', () => {
  // --- 1. FAQ Accordion ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all FAQs first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // --- 2. Filter System (Attractions & Hotels) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.grid-3 .card');
  
  if (filterButtons.length > 0 && cards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-filter');
        
        cards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 3. Interactive Map Pin Simulation ---
  const pins = document.querySelectorAll('.map-pin');
  const overlay = document.getElementById('mapOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const overlayImage = document.getElementById('overlayImage');
  
  if (pins.length > 0 && overlay) {
    pins.forEach(pin => {
      pin.addEventListener('click', () => {
        const title = pin.getAttribute('data-title');
        const desc = pin.getAttribute('data-desc');
        const imgText = pin.getAttribute('data-img');
        
        overlayTitle.textContent = title;
        overlayDesc.textContent = desc;
        if (overlayImage) {
          overlayImage.textContent = imgText;
        }
        
        overlay.classList.add('active');
      });
    });
    
    // Close overlay if clicking outside pins
    document.querySelector('.map-container').addEventListener('click', (e) => {
      if (!e.target.closest('.map-pin')) {
        overlay.classList.remove('active');
      }
    });
  }

  // --- 4. Interactive Booking Calculator ---
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const destinationSelect = document.getElementById('destination');
    const guestsInput = document.getElementById('guests');
    const durationInput = document.getElementById('duration');
    const hotelSelect = document.getElementById('hotelClass');
    
    const summaryDest = document.getElementById('sumDest');
    const summaryBasePrice = document.getElementById('sumBase');
    const summaryHotelPrice = document.getElementById('sumHotel');
    const summaryTotal = document.getElementById('sumTotal');
    
    function calculateCost() {
      const destPriceMap = {
        'coastal': 150,
        'mountain': 200,
        'heritage': 180,
        'forest': 220
      };
      
      const hotelMultiplierMap = {
        'budget': 1.0,
        'standard': 1.5,
        'luxury': 2.5
      };
      
      const destination = destinationSelect.value;
      const guests = parseInt(guestsInput.value) || 1;
      const duration = parseInt(durationInput.value) || 1;
      const hotelClass = hotelSelect.value;
      
      const baseCost = destPriceMap[destination] || 100;
      const multiplier = hotelMultiplierMap[hotelClass] || 1.0;
      
      const ticketTotal = baseCost * guests * duration;
      const hotelTotal = baseCost * 0.4 * multiplier * guests * duration;
      const grandTotal = ticketTotal + hotelTotal;
      
      // Update UI
      if (summaryDest) summaryDest.textContent = destinationSelect.options[destinationSelect.selectedIndex].text;
      if (summaryBasePrice) summaryBasePrice.textContent = `$${ticketTotal.toFixed(2)}`;
      if (summaryHotelPrice) summaryHotelPrice.textContent = `$${hotelTotal.toFixed(2)}`;
      if (summaryTotal) summaryTotal.textContent = `$${grandTotal.toFixed(2)}`;
    }
    
    // Attach listeners for interactive updates
    destinationSelect.addEventListener('change', calculateCost);
    guestsInput.addEventListener('input', calculateCost);
    durationInput.addEventListener('input', calculateCost);
    hotelSelect.addEventListener('change', calculateCost);
    
    // Initial cost run
    calculateCost();
    
    // Handle Form Submit
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMessage = document.getElementById('bookingSuccess');
      if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
        bookingForm.reset();
        calculateCost();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      }
    });
  }
});
