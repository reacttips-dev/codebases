import navQuerySelector from 'unified-navigation-ui/js/utils/navQuerySelector';
import navQuerySelectorAll from 'unified-navigation-ui/js/utils/navQuerySelectorAll';
import each from 'unified-navigation-ui/js/utils/each';
import { addMobileEventListener } from 'unified-navigation-ui/js/utils/eventListeners';

function showSecondaryCrumb(link) {
  each(navQuerySelectorAll('.mobile-nav-left-container .secondary-crumb-text'), function (secondaryTitle) {
    secondaryTitle.classList.add('visible');
    secondaryTitle.innerText = link.innerText.trim();
  });
  navQuerySelector('.mobile-nav-left-container .breadcrumbs').classList.add('visible');
}

function hideSecondaryCrumb() {
  each(navQuerySelectorAll('.mobile-nav-left-container .secondary-crumb-text'), function (secondaryTitle) {
    secondaryTitle.classList.remove('visible');
    secondaryTitle.innerText = '';
  });
  navQuerySelector('.mobile-nav-left-container .breadcrumbs').classList.remove('visible');
}

function showTertiaryCrumb(link) {
  each(navQuerySelectorAll('.mobile-nav-left-container .tertiary-crumb'), function (crumb) {
    crumb.classList.add('visible');
  });
  each(navQuerySelectorAll('.mobile-nav-left-container .secondary-crumb-text'), function (secondaryTitle) {
    secondaryTitle.classList.add('underline');
  });
  each(navQuerySelectorAll('.mobile-nav-left-container .tertiary-crumb-text'), function (tertiaryTitle) {
    tertiaryTitle.innerText = link.innerText;
  });
}

function hideTertiaryCrumb() {
  each(navQuerySelectorAll('.mobile-nav-left-container .tertiary-crumb'), function (crumb) {
    crumb.classList.remove('visible');
  });
  each(navQuerySelectorAll('.mobile-nav-left-container .secondary-crumb-text'), function (secondaryTitle) {
    secondaryTitle.classList.remove('underline');
  });
  each(navQuerySelectorAll('.mobile-nav-left-container .tertiary-crumb-text'), function (tertiaryTitle) {
    tertiaryTitle.innerText = '';
  });
}

function setupCrumbs() {
  each(navQuerySelectorAll('.secondary-crumb-text'), function (menuCrumb) {
    addMobileEventListener(menuCrumb, 'click', function (evt) {
      each(navQuerySelectorAll('.secondary-nav .expandable'), function (expandable) {
        if (expandable.classList.contains('active')) {
          expandable.classList.remove('active');
        }
      });
      hideTertiaryCrumb();
      evt.preventDefault();
      evt.stopPropagation();
    });
  });
  each(navQuerySelectorAll('.menu-crumb'), function (menuCrumb) {
    addMobileEventListener(menuCrumb, 'click', function (evt) {
      each(navQuerySelectorAll('.expandable'), function (expandable) {
        if (expandable.classList.contains('active')) {
          expandable.classList.remove('active');
        }
      });
      hideTertiaryCrumb();
      hideSecondaryCrumb();
      evt.preventDefault();
      evt.stopPropagation();
    });
  });
} // TO Look at more to fix


function closeMenu(evt) {
  if (evt.target.classList.contains('menu')) {
    return;
  }

  each(navQuerySelectorAll('#navbar .mobile-nav-left-container .active'), function (activeNavItem) {
    if (!activeNavItem.contains(evt.target)) {
      activeNavItem.classList.remove('active');
    }
  });
  each(navQuerySelectorAll('.mobile-nav-left-container .expandable'), function (expandable) {
    if (expandable.classList.contains('active')) {
      expandable.classList.remove('active');
    }
  });
  navQuerySelector('.mobile-nav-left-container .nav-links').classList.remove('visible');
  hideTertiaryCrumb();
  hideSecondaryCrumb();
}

function setupPrimaryNav() {
  var primaryExpansionLinks = navQuerySelectorAll('.mobile-nav-left-container .expandable .primary-link');
  each(primaryExpansionLinks, function (link) {
    addMobileEventListener(link, 'click', function (evt) {
      var parentElement = link.parentElement;
      var activeSibling = navQuerySelector('.mobile-nav-left-container .primary-links > li.active');
      each(navQuerySelectorAll('.mobile-nav-left-container .primary-links li.active'), function (activeElement) {
        return activeElement.classList.remove('active');
      });

      if (link.parentElement.classList.contains('user-account') && link.parentElement.classList.contains('active')) {
        link.parentElement.classList.remove('active');
      } else if (activeSibling !== parentElement) {
        link.parentElement.classList.add('active');
        setTimeout(function () {
          var secondaryExpansion = parentElement.querySelector('.secondary-nav.expansion');

          if (!secondaryExpansion) {
            return; // Account menu
          }

          var secondaryExpansionHeight = secondaryExpansion.offsetHeight;
          each(parentElement.querySelectorAll('.mobile-nav-left-container .tertiary-nav.expansion'), function (expansion) {
            expansion.style.minHeight = secondaryExpansionHeight + "px";
          });
        }, 300); // Time it takes for mobile primary dropdown to fully expand
      }

      if (!link.parentElement.classList.contains('user-account')) {
        showSecondaryCrumb(link);
      }

      evt.preventDefault();
      evt.stopPropagation();
    });
  });

  var toggleMobileNav = function toggleMobileNav(evt) {
    var navLinks = navQuerySelector('.mobile-nav-left-container .nav-links');

    if (navLinks.classList.contains('visible')) {
      navLinks.classList.remove('visible');
      navQuerySelector('#navbar').classList.remove('fixed');
      each(navQuerySelectorAll('.mobile-nav-left-container .expandable'), function (expandable) {
        if (expandable.classList.contains('active')) {
          expandable.classList.remove('active');
        }
      });
      hideTertiaryCrumb();
      hideSecondaryCrumb();
    } else {
      navLinks.classList.add('visible');
      navQuerySelector('#navbar').classList.add('fixed');
      setTimeout(function () {
        var linksHeight = navQuerySelector('.mobile-nav-left-container .primary-links').offsetHeight;
        each(navQuerySelectorAll('.mobile-nav-left-container .secondary-nav.expansion, .mobile-nav-left-container .tertiary-nav.expansion'), function (expansion) {
          expansion.style.minHeight = linksHeight + "px";
        });
      }, 300); // Time it takes for mobile primary dropdown to fully expand
    }

    evt.stopPropagation();
    evt.preventDefault();
  };

  addMobileEventListener(navQuerySelector('.mobile-nav-left-container .menu'), 'click', toggleMobileNav);
  addMobileEventListener(navQuerySelector('.mobile-nav-left-container span'), 'click', toggleMobileNav);
  addMobileEventListener(navQuerySelector('.mobile-nav-left-container svg'), 'click', toggleMobileNav);
  addMobileEventListener(document, 'click', closeMenu);
  addMobileEventListener(navQuerySelector('.mobile-nav-left-container .close-icon'), 'click', closeMenu);
}

function setupSecondaryNav() {
  var secondaryNavExpansionLinks = navQuerySelectorAll('.mobile-nav-left-container .secondary-nav .expandable > a');
  each(secondaryNavExpansionLinks, function (link) {
    addMobileEventListener(link, 'click', function (evt) {
      showTertiaryCrumb(link);
      evt.stopPropagation();
      evt.preventDefault();
    });
  });
}

export default function setupMobileInteractions() {
  setupPrimaryNav();
  setupSecondaryNav();
  setupCrumbs();
}