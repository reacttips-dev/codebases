import isLocal from 'unified-navigation-ui/utils/isLocal';
import { setupMobileSwitchListener } from 'unified-navigation-ui/utils/eventListeners';
import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import each from 'unified-navigation-ui/utils/each';
var completedOneTimeSetup = false;

function setupLocalSentryDisable() {
  if (isLocal() && window.enviro) {
    window.enviro.setDebug('sentry', true);
  }
}

export default function setupNavInteractions() {
  if (!completedOneTimeSetup) {
    completedOneTimeSetup = true; // Interactions that should be set up only once

    setupMobileSwitchListener();
    setupLocalSentryDisable();

    var handleClickOutsideOfNav = function handleClickOutsideOfNav(evt) {
      each(navQuerySelectorAll('#navbar .active'), function (activeNavItem) {
        if (!activeNavItem.contains(evt.target)) {
          activeNavItem.classList.remove('active');
          var anchor = activeNavItem.querySelector('a');

          if (anchor) {
            anchor.setAttribute('aria-expanded', 'false');
          }
        }
      });
    };

    document.addEventListener('click', handleClickOutsideOfNav);
  }
}