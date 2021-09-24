'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIImage from 'UIComponents/image/UIImage';
import UISection from 'UIComponents/section/UISection';

var ImageEditorImage = function ImageEditorImage(_ref) {
  var setImageContainer = _ref.setImageContainer,
      containerStyles = _ref.containerStyles,
      imageProps = _objectWithoutProperties(_ref, ["setImageContainer", "containerStyles"]);

  return /*#__PURE__*/_jsx(UISection, {
    style: containerStyles,
    children: /*#__PURE__*/_jsx(UIImage, Object.assign({
      style: {
        opacity: 0.5,
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      ref: setImageContainer
    }, imageProps))
  });
};

ImageEditorImage.propTypes = {
  setImageContainer: PropTypes.func.isRequired,
  containerStyles: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired
};
export default ImageEditorImage;