const BATMAN_CLASS = 'batman';

export default function batmanBounce() {
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const { body } = document;
    const reset = function() {
      body.classList.remove(BATMAN_CLASS);
      body.removeEventListener('animationend', reset);
    };
    body.addEventListener('animationend', reset);
    body.classList.add(BATMAN_CLASS);
  }
}
