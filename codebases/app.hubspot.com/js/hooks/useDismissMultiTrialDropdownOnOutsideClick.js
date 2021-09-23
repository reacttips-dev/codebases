'use es6';

import { useContext, useEffect } from 'react';
import { MultiTrialDropdownContext } from '../contexts/MultiTrialDropdownContext';
export var useDismissMultiTrialDropdownOnOutsideClick = function useDismissMultiTrialDropdownOnOutsideClick() {
  var _useContext = useContext(MultiTrialDropdownContext),
      switchTrialViewRef = _useContext.switchTrialViewRef,
      showMultiTrialDropdown = _useContext.showMultiTrialDropdown,
      setShowMultiTrialDropdown = _useContext.setShowMultiTrialDropdown;

  useEffect(function () {
    var handleClickOutside = function handleClickOutside(event) {
      if (switchTrialViewRef && !switchTrialViewRef.contains(event.target) && showMultiTrialDropdown) {
        setShowMultiTrialDropdown(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return function () {
      return window.removeEventListener('click', handleClickOutside);
    };
  }, [showMultiTrialDropdown, setShowMultiTrialDropdown, switchTrialViewRef]);
};