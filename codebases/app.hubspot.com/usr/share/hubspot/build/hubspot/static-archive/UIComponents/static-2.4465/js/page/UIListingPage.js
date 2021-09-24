'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import omit from '../utils/underscore/omit';
import UIAbstractPageTemplate from './UIAbstractPageTemplate';

function UIListingPage(props) {
  return /*#__PURE__*/_jsx(UIAbstractPageTemplate, Object.assign({}, props, {
    horizontalDivider: true
  }));
}

UIListingPage.propTypes = omit(UIAbstractPageTemplate.propTypes, 'horizontalDivider', 'sidebarStyle');
UIListingPage.defaultProps = omit(UIAbstractPageTemplate.defaultProps, 'horizontalDivider');
UIListingPage.displayName = 'UIListingPage';
export default UIListingPage;