'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getIllustrationNamePropType } from '../utils/propTypes/illustrationName';
import UIAbstractIllustration from './UIAbstractIllustration';

var UIIllustration = function UIIllustration(props) {
  return /*#__PURE__*/_jsx(UIAbstractIllustration, Object.assign({}, props));
};

UIIllustration.defaultProps = UIAbstractIllustration.defaultProps;
UIIllustration.propTypes = Object.assign({}, UIAbstractIllustration.propTypes, {
  name: getIllustrationNamePropType().isRequired
});
UIIllustration.displayName = 'UIIllustration';
export default UIIllustration;