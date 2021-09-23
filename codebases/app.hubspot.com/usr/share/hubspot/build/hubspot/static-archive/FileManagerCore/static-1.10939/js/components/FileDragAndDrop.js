'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import enviro from 'enviro';
import { matches } from 'UIComponents/utils/Dom';

var cancelDragEvent = function cancelDragEvent(e) {
  e.preventDefault();
  e.stopPropagation();
};

var isDebug = function isDebug() {
  return enviro.debug('filedrop');
};

var logDebug = function logDebug() {
  if (isDebug()) {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    console.log.apply(console, ['[FileDragAndDrop]'].concat(args));
  }
};

var matchesSelector = function matchesSelector(el, className) {
  if (el instanceof SVGElement) {
    return false;
  }

  return matches(el, className);
};

var matchesOrWithinSelector = function matchesOrWithinSelector(el, className) {
  if (matchesSelector(el, className)) {
    return true;
  }

  while (el && el.parentElement) {
    if (matchesSelector(el.parentElement, className)) {
      return true;
    }

    el = el.parentElement;
  }

  return false;
};

var FileDragAndDrop = function FileDragAndDrop(_ref) {
  var children = _ref.children,
      disabled = _ref.disabled,
      ignoreTargetSelector = _ref.ignoreTargetSelector,
      onDropFiles = _ref.onDropFiles;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOver = _useState2[0],
      setIsOver = _useState2[1];

  var isOverRef = useRef(null);
  var onDragEnter = useCallback(function (e) {
    if (ignoreTargetSelector && matchesOrWithinSelector(e.target, ignoreTargetSelector)) {
      logDebug('ignoring onDragEnter on target to parent classname', e.target, ignoreTargetSelector);
      return;
    } else {
      logDebug('onDragEnter', e.target);
    }

    e.preventDefault();
    isOverRef.current = e.target;
    setIsOver(true);
  }, [ignoreTargetSelector]);
  var onDragOver = useCallback(function (e) {
    cancelDragEvent(e);
  }, []);
  var onDragLeave = useCallback(function (e) {
    if (isOverRef.current === e.target) {
      isOverRef.current = null;
      setIsOver(false);
    }
  }, []);
  var onDrop = useCallback(function (e) {
    if (ignoreTargetSelector && matchesOrWithinSelector(e.target, ignoreTargetSelector)) {
      logDebug('ignoring onDrop on target to parent classname', e.target, ignoreTargetSelector);
      return;
    } else {
      if (isDebug()) {
        e.persist();
        logDebug('onDrop', e);
      }
    }

    var files = e.dataTransfer ? e.dataTransfer.files : [];

    if (files && files.length) {
      e.preventDefault();
      onDropFiles(_toConsumableArray(files));
      setIsOver(false);
    }
  }, [ignoreTargetSelector, onDropFiles]);

  if (disabled) {
    return children({
      isOver: false,
      onDragOver: cancelDragEvent,
      onDrop: cancelDragEvent
    });
  }

  return children({
    isOver: isOver,
    onDrop: onDrop,
    onDragEnter: onDragEnter,
    onDragOver: onDragOver,
    onDragLeave: onDragLeave
  });
};

FileDragAndDrop.propTypes = {
  children: PropTypes.func.isRequired,
  onDropFiles: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  ignoreTargetSelector: PropTypes.string
};
FileDragAndDrop.defaultProps = {
  disabled: false
};
export default FileDragAndDrop;