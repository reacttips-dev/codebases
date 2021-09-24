'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import omit from '../utils/underscore/omit';
import { CARD_BACKGROUND } from './PageConstants';
import UIAbstractPageTemplate from './UIAbstractPageTemplate';

function UIDashboardPage(props) {
  return /*#__PURE__*/_jsx(UIAbstractPageTemplate, Object.assign({}, props, {
    horizontalDivider: true,
    mainSectionBackgroundColor: CARD_BACKGROUND
  }));
}

UIDashboardPage.propTypes = omit(UIAbstractPageTemplate.propTypes, 'horizontalDivider', 'mainSectionBackgroundColor', 'sidebarStyle');
UIDashboardPage.defaultProps = omit(UIAbstractPageTemplate.defaultProps, 'horizontalDivider', 'mainSectionBackgroundColor');
UIDashboardPage.displayName = 'UIDashboardPage';
export default UIDashboardPage;