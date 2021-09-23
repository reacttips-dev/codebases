'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { createElement, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { createLocation } from 'history';
import { callIfPossible } from 'UIComponents/core/Functions';

var AbstractRouterLink = function AbstractRouterLink(props) {
  var component = props.component,
      to = props.to,
      replace = props.replace,
      onClick = props.onClick,
      rest = _objectWithoutProperties(props, ["component", "to", "replace", "onClick"]);

  var history = useHistory();
  var handleClick = useCallback(function (e) {
    callIfPossible(onClick, e);

    if (e.defaultPrevented) {
      return;
    }

    if (e && !e.metaKey) {
      e.preventDefault();

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  }, [history, onClick, replace, to]);
  var href = useMemo(function () {
    var location = typeof to === 'string' ? createLocation(to, null, null, history.location) : to;
    return history.createHref(location);
  }, [history, to]);
  return /*#__PURE__*/createElement(component, Object.assign({}, rest, {
    href: href,
    onClick: handleClick
  }));
};

AbstractRouterLink.propTypes = {
  component: PropTypes.elementType.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  replace: PropTypes.bool
};
AbstractRouterLink.defaultProps = {
  replace: false
};
export default AbstractRouterLink;