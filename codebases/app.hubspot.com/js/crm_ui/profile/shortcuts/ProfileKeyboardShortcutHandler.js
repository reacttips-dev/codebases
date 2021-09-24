'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Set as ImmutableSet } from 'immutable';
import debounce from 'transmute/debounce';
var classBlocklist = ['public-DraftEditor-content', 'form-control'];
var nodeBlockList = ['INPUT', 'TEXTAREA'];

function getIsBlocklisted(target) {
  if (!nodeBlockList.includes(target.nodeName)) {
    var isBlocklistedClass = _toConsumableArray(target.classList).some(function (el) {
      return classBlocklist.includes(el);
    });

    if (!isBlocklistedClass) {
      return false;
    }
  }

  return true;
}

export function createShortcutHandler() {
  var pressedKeys = ImmutableSet();

  for (var _len = arguments.length, passedInShortcuts = new Array(_len), _key = 0; _key < _len; _key++) {
    passedInShortcuts[_key] = arguments[_key];
  }

  var shortcuts = ImmutableSet(passedInShortcuts);

  function checkAndRunShortcuts() {
    shortcuts.forEach(function (shortcut) {
      return shortcut(pressedKeys);
    });
  }

  function handleProfileKeydown(_ref) {
    var keyCode = _ref.keyCode,
        target = _ref.target;

    if (getIsBlocklisted(target)) {
      pressedKeys = pressedKeys.clear();
      return false;
    }

    pressedKeys = pressedKeys.add(keyCode);
    checkAndRunShortcuts();
    return true;
  }

  function handleProfileKeyup(_ref2) {
    var keyCode = _ref2.keyCode,
        target = _ref2.target;

    if (getIsBlocklisted(target)) {
      pressedKeys = pressedKeys.clear();
      return false;
    }

    pressedKeys = pressedKeys.delete(keyCode);
    return true;
  }

  function clearPressedKeys() {
    pressedKeys = pressedKeys.clear();
  }

  function registerShortcut(shortcut) {
    shortcuts = shortcuts.add(shortcut);
  }

  function getShortcuts() {
    return shortcuts;
  }

  var handleKeyUp = debounce(100, handleProfileKeyup);
  var handleKeyDown = debounce(100, handleProfileKeydown);

  function addShortcutListener(useDebounce) {
    document.addEventListener('keyup', useDebounce ? handleKeyUp : handleProfileKeyup);
    document.addEventListener('keydown', useDebounce ? handleKeyDown : handleProfileKeydown);
    window.addEventListener('blur', clearPressedKeys);
  }

  function removeShortcutListener(useDebounce) {
    document.removeEventListener('keyup', useDebounce ? handleKeyUp : handleProfileKeyup);
    document.removeEventListener('keydown', useDebounce ? handleKeyDown : handleProfileKeydown);
    window.removeEventListener('blur', clearPressedKeys);
  }

  function initializeShortcutListener() {
    var useDebounce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    addShortcutListener(useDebounce);
    return function () {
      return removeShortcutListener(useDebounce);
    };
  }

  return {
    initializeShortcutListener: initializeShortcutListener,
    registerShortcut: registerShortcut,
    // used for unit tests
    getShortcuts: getShortcuts
  };
}