/**
 * Service card flip interaction (Home page)
 * - Desktop: CSS :hover flips the card automatically
 * - Touch: tap toggles the flip (fallback where hover is sticky)
 * - "Read More" link navigates normally
 */
(function () {
  'use strict';

  /* Only needed on touch devices where :hover behavior is poor */
  if (!('ontouchstart' in window)) return;

  var flipCards;

  function init() {
    flipCards = document.querySelectorAll('.flip-card');
    if (!flipCards.length) return;

    for (var i = 0; i < flipCards.length; i++) {
      flipCards[i].addEventListener('click', onCardClick);
    }

    document.addEventListener('click', onOutsideClick);
  }

  function onCardClick(e) {
    var card = e.currentTarget;

    /* Let the link inside navigate normally */
    if (e.target.closest('.flip-card-link')) return;

    card.classList.toggle('flipped');
  }

  function onOutsideClick(e) {
    if (e.target.closest('.flip-card')) return;

    for (var i = 0; i < flipCards.length; i++) {
      flipCards[i].classList.remove('flipped');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
