'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import devLogger from 'react-utils/devLogger';
import invariant from 'react-utils/invariant';
import SyntheticEvent from '../core/SyntheticEvent';
import { preventDefaultHandler } from '../utils/DomEvents';
var hasPingedNewRelic = false;
export default function UIForm(props) {
  var action = props.action,
      className = props.className,
      _onKeyDown = props.onKeyDown,
      onSubmit = props.onSubmit,
      rest = _objectWithoutProperties(props, ["action", "className", "onKeyDown", "onSubmit"]);

  var formRef = useRef(null);
  useEffect(function () {
    var childForms = formRef.current.querySelectorAll('form');
    var nestedFormsExist = childForms.length > 0;

    if (nestedFormsExist) {
      if (window.newrelic && !hasPingedNewRelic) {
        window.newrelic.addPageAction('componentWithNestedForm', {
          componentName: 'UIForm'
        });
        hasPingedNewRelic = true;
      }

      if (process.env.NODE_ENV !== 'production') {
        devLogger.warn({
          message: "A `<form />` was rendered within a `UIForm`. Please refactor.",
          url: 'https://git.hubteam.com/HubSpot/UIComponents/issues/9507'
        });
        invariant(nestedFormsExist, 'A form cannot be nested in a form.');
      }
    }
  }, [formRef]);
  return (
    /*#__PURE__*/

    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    _jsx("form", Object.assign({}, rest, {
      ref: formRef,
      className: classNames('private-form', className),
      action: action,
      onKeyDown: function onKeyDown(evt) {
        // Submit on Cmd+Enter or Ctrl+Enter (avoiding double-submit from an <input>: #4578)
        var inputFocused = document.activeElement instanceof HTMLInputElement;

        if (evt.key === 'Enter') {
          if (evt.metaKey || evt.ctrlKey && !inputFocused) {
            if (onSubmit) onSubmit(SyntheticEvent());
          }
        }

        if (_onKeyDown) _onKeyDown(evt);
      },
      onSubmit: !action && !onSubmit ? preventDefaultHandler : onSubmit
    }))
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */

  );
}
UIForm.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func
};
UIForm.displayName = 'UIForm';