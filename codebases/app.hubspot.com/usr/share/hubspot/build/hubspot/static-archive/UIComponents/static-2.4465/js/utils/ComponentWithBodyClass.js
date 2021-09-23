'use es6';

import PropTypes from 'prop-types';
import { useEffect } from 'react';

var forEachClassName = function forEachClassName(classNames, cb) {
  classNames.trim().split(/\s+/).forEach(function (className) {
    cb(className);
  });
};
/**
 * Passes the child component through directly, while toggling
 * the body class according to the bodyClassName prop
 */


export default function ComponentWithBodyClass(props) {
  var bodyElement = props.bodyElement,
      bodyClassName = props.bodyClassName,
      children = props.children;
  useEffect(function () {
    forEachClassName(bodyClassName, function (className) {
      bodyElement.classList.add(className);
    });
    return function () {
      forEachClassName(bodyClassName, function (className) {
        bodyElement.classList.remove(className);
      });
    };
  }, [bodyClassName, bodyElement]);
  return children;
}
ComponentWithBodyClass.propTypes = {
  bodyClassName: PropTypes.string.isRequired,
  bodyElement: PropTypes.object.isRequired,
  children: PropTypes.node
};
ComponentWithBodyClass.defaultProps = {
  bodyElement: document.body
};
ComponentWithBodyClass.displayName = 'ComponentWithBodyClass';