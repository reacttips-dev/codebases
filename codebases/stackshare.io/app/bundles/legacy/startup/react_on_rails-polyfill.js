import ReactOnRails from 'react-on-rails';

if (typeof window.ReactOnRails === 'undefined') {
  // This is globalised so that app/assets/javascripts/landing_page.js
  // can mount components that get added to the DOM after the initial page load.
  // FUTURE: this should be removed from the bundle when those legacy scripts are removed
  window.ReactOnRails = ReactOnRails;
}
