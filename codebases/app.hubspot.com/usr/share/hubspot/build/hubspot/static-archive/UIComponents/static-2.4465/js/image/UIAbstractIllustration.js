'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getImageUrl } from 'ui-images';
import devLogger from 'react-utils/devLogger';
import omit from '../utils/underscore/omit';
import { isIE11 } from '../utils/BrowserTest';
import UIImage from './UIImage';
export default function UIAbstractIllustration(props) {
  var className = props.className,
      disabled = props.disabled,
      name = props.name,
      _getImageUrlFromName = props._getImageUrlFromName,
      rest = _objectWithoutProperties(props, ["className", "disabled", "name", "_getImageUrlFromName"]);

  if (process.env.NODE_ENV !== 'production') {
    if (props.height == null && props.width == null) {
      devLogger.warn({
        message: 'UIAbstractIllustration: Provide either width or height prop to ensure proper scaling.',
        key: 'UIAbstractIllustration-dimensions-none'
      });
    }

    if (props.height != null && props.width != null) {
      devLogger.warn({
        message: 'UIAbstractIllustration: Setting both width and height may not behave as expected.',
        key: 'UIAbstractIllustration-dimensions-both'
      });
    }
  }

  return /*#__PURE__*/_jsx(UIImage, Object.assign({}, rest, {
    responsive: false,
    className: classNames(className, 'private-illustration', disabled && 'private-illustration--disabled'),
    objectFit: "contain",
    src: _getImageUrlFromName(name)
  }));
}
UIAbstractIllustration.propTypes = Object.assign({}, omit(UIImage.propTypes, 'src', 'responsive'), {
  disabled: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  _getImageUrlFromName: PropTypes.func.isRequired
});
UIAbstractIllustration.defaultProps = Object.assign({}, omit(UIImage.defaultProps, 'responsive'), {
  _getImageUrlFromName: function _getImageUrlFromName(name) {
    return getImageUrl(name, undefined, isIE11());
  }
});
UIAbstractIllustration.displayName = 'UIAbstractIllustration';