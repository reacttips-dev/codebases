import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import each from 'unified-navigation-ui/utils/each';
import { addDesktopEventListener } from 'unified-navigation-ui/utils/eventListeners';

function parentUntilClass(el, parentClass) {
  var parentElement = el.parentElement;

  if (parentElement === null) {
    return parentElement;
  } else if (parentElement.classList.contains(parentClass)) {
    return el;
  }

  return parentUntilClass(parentElement, parentClass);
}

function setupPrimaryNav() {
  var primaryExpansionLinks = navQuerySelectorAll('.desktop-nav-left-container .expandable .primary-link');
  var parentElements = [];
  each(primaryExpansionLinks, function (link) {
    parentElements.push(link.parentElement);
    addDesktopEventListener(link, 'mouseover', function () {
      var parentElement = link.parentElement;
      var activeSibling = document.querySelector('.desktop-nav-left-container .primary-links > li.active');

      if (activeSibling !== null && parentElement !== activeSibling) {
        activeSibling.classList.remove('active');
        activeSibling.querySelector('a').setAttribute('aria-expanded', 'false');
        parentElement.classList.add('active');
        parentElement.querySelector('a').setAttribute('aria-expanded', 'true');
        parentElement.focus();
      }
    });
    addDesktopEventListener(link, 'click', function (evt) {
      var parentElement = link.parentElement;
      var activeElements = parentElements.filter(function (element) {
        return element.classList.contains('active');
      });

      var _activeElements = _slicedToArray(activeElements, 1),
          activeSibling = _activeElements[0];

      each(activeElements, function (activeElement) {
        activeElement.classList.remove('active');
        activeElement.querySelector('a').setAttribute('aria-expanded', 'false');
      });

      if (activeSibling !== parentElement) {
        link.parentElement.classList.add('active');
        link.parentElement.querySelector('a').setAttribute('aria-expanded', 'true');
      }

      evt.preventDefault();
    });
  });
}

function setupNavItemListeners() {
  var navItemLinks = navQuerySelectorAll(['.desktop-nav-left-container .primary-links li:not(.expandable) a.primary-link', '.desktop-nav-left-container .secondary-nav li:not(.expandable) > a', '.desktop-nav-left-container tertiary-nav a'].join(', '));
  each(navItemLinks, function (link) {
    addDesktopEventListener(link, 'click', function (evt) {
      if (window.hubspot.navigation.navItemListener && typeof window.hubspot.navigation.navItemListener === 'function') {
        var navItemInfo = {
          id: link.id,
          url: link.href.split('.com')[1].trim()
        };
        window.hubspot.navigation.navItemListener(evt, navItemInfo);
      }

      each(navQuerySelectorAll('.desktop-nav-left-container .active'), function (activeNavItem) {
        activeNavItem.classList.remove('active');
      });
      each(navQuerySelectorAll('.desktop-nav-left-container .currentPage'), function (currentNavItem) {
        currentNavItem.classList.remove('currentPage');
      });
      var parentElement = parentUntilClass(link, 'primary-links');

      if (parentElement) {
        parentElement.classList.add('currentPage');
      }
    });
  });
}

function setupLockedItemHoverListener() {
  var lockedItems = navQuerySelectorAll('.locked-item');
  each(lockedItems, function (lockedItem) {
    addDesktopEventListener(lockedItem, 'mouseover', function () {
      var tooltip = lockedItem.querySelector('.locked-tooltip');
      tooltip.style.display = 'block';
    });
    addDesktopEventListener(lockedItem, 'mouseleave', function () {
      var tooltip = lockedItem.querySelector('.locked-tooltip');
      tooltip.style.display = 'none';
    });
  });
}

export default function setupDesktopInteractions() {
  setupNavItemListeners();
  setupPrimaryNav();
  setupLockedItemHoverListener();
}