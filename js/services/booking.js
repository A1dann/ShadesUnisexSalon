/**
 * Booking form logic
 * - Category → dependent service dropdown
 * - Time-slot generator based on selected date's opening hours
 *
 * Opening hours reference:
 *   Sunday:    10:00 – 17:00
 *   Monday:     9:00 – 18:00
 *   Tuesday:    9:00 – 18:00
 *   Wednesday:  9:00 – 18:00
 *   Thursday:   9:00 – 18:00
 *   Friday:     9:00 – 18:00
 *   Saturday:   Closed
 */

(function () {
  'use strict';

  /* ── Service data ── */
  var CATEGORIES = [
    {
      label: 'General Hair Care',
      services: [
        'Wash & Blow Dry',
        'Hair Trim',
        'Basic Styling'
      ]
    },
    {
      label: 'Natural Hair Care',
      services: [
        'Natural Hair Wash & Style',
        'Protective Styling',
        'Natural Hair Care Consultation'
      ]
    },
    {
      label: 'Hair and Scalp Treatments',
      services: [
        'Deep Conditioning Treatment',
        'Scalp Treatment'
      ]
    },
    {
      label: 'Relaxers',
      services: [
        'Relaxer Retouch',
        'Virgin Relaxer',
        'Relaxer with Treatment'
      ]
    },
    {
      label: 'Colouring',
      services: [
        'Full Hair Colour',
        'Root Touch-Up',
        'Highlights / Colour Accents'
      ]
    }
  ];

  /* ── Opening hours ── */
  var HOURS = {
    0: { open: 10, close: 17 }, // Sunday
    1: { open:  9, close: 18 }, // Monday
    2: { open:  9, close: 18 }, // Tuesday
    3: { open:  9, close: 18 }, // Wednesday
    4: { open:  9, close: 18 }, // Thursday
    5: { open:  9, close: 18 }, // Friday
    6: { open: null, close: null } // Saturday – closed
  };

  /* ── Helpers ── */
  function formatAmPm(hour) {
    if (hour === 0) return '12:00 am';
    if (hour < 12) return hour + ':00 am';
    if (hour === 12) return '12:00 pm';
    return (hour - 12) + ':00 pm';
  }

  function generateSlots(open, close) {
    var slots = [];
    var lastStart = close - 1;
    for (var h = open; h <= lastStart; h++) {
      slots.push({ value: h + ':00', label: formatAmPm(h) });
    }
    return slots;
  }

  /* ── Category → Service ── */
  function populateCategories() {
    var catSelect = document.getElementById('booking-category');
    var svcSelect = document.getElementById('booking-service');
    if (!catSelect || !svcSelect) return;

    catSelect.innerHTML = '<option value="">Choose a category</option>';
    for (var i = 0; i < CATEGORIES.length; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = CATEGORIES[i].label;
      catSelect.appendChild(opt);
    }
    svcSelect.innerHTML = '<option value="">Select a category first</option>';
    svcSelect.disabled = true;
  }

  function updateServices() {
    var catSelect = document.getElementById('booking-category');
    var svcSelect = document.getElementById('booking-service');
    if (!catSelect || !svcSelect) return;

    var idx = catSelect.value;
    if (idx === '') {
      svcSelect.innerHTML = '<option value="">Select a category first</option>';
      svcSelect.disabled = true;
      return;
    }

    var services = CATEGORIES[parseInt(idx, 10)].services;
    svcSelect.disabled = false;
    svcSelect.innerHTML = '<option value="">Choose a service</option>';
    for (var i = 0; i < services.length; i++) {
      var opt = document.createElement('option');
      opt.value = services[i];
      opt.textContent = services[i];
      svcSelect.appendChild(opt);
    }
  }

  /* ── Time slots ── */
  function updateTimeSlots() {
    var dateInput = document.getElementById('booking-date');
    var timeSelect = document.getElementById('booking-time');
    if (!dateInput || !timeSelect) return;

    var selectedDate = dateInput.value;
    if (!selectedDate) {
      timeSelect.innerHTML = '<option value="">Select a date first</option>';
      timeSelect.disabled = true;
      return;
    }

    var day = new Date(selectedDate + 'T12:00:00').getDay();
    var hours = HOURS[day];

    if (!hours.open) {
      timeSelect.innerHTML = '<option value="">Closed — Salon not open this day</option>';
      timeSelect.disabled = true;
      return;
    }

    var slots = generateSlots(hours.open, hours.close);
    timeSelect.disabled = false;
    timeSelect.innerHTML = '<option value="">Select a time</option>';
    for (var i = 0; i < slots.length; i++) {
      var opt = document.createElement('option');
      opt.value = slots[i].value;
      opt.textContent = slots[i].label;
      timeSelect.appendChild(opt);
    }
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    populateCategories();

    var catSelect = document.getElementById('booking-category');
    if (catSelect) {
      catSelect.addEventListener('change', updateServices);
    }

    var dateInput = document.getElementById('booking-date');
    if (dateInput) {
      dateInput.addEventListener('change', updateTimeSlots);
      updateTimeSlots();
    }
  }
})();
