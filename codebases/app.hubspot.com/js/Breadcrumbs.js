'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UIButton from 'UIComponents/button/UIButton';
import UIBreadcrumbs from 'UIComponents/nav/UIBreadcrumbs';
import { tracker } from './tracker';
import styled from 'styled-components';
var StyledBreadcrumbs = styled(UIBreadcrumbs).attrs({
  className: 'm-bottom-4'
}).withConfig({
  displayName: "Breadcrumbs__StyledBreadcrumbs",
  componentId: "sc-1mb6437-0"
})(["&&&{margin:0;padding:0;}"]);
/*
example breadcrumbs prop shape:

[ 
    { message: <FormattedMessage message="foo" />, onClick: () => {} },
    { message: <FormattedMessage message="bar" /> }, 
]

onClick should not be provided for the final element in the array, as it is the current page/breadcrumb.
*/

var Breadcrumbs = function Breadcrumbs(_ref) {
  var breadcrumbs = _ref.breadcrumbs;
  return /*#__PURE__*/_jsx("div", {
    children: /*#__PURE__*/_jsxs(StyledBreadcrumbs, {
      children: [breadcrumbs.slice(0, -1).map(function (_ref2, i) {
        var message = _ref2.message,
            _onClick = _ref2.onClick;
        return /*#__PURE__*/_jsx(UIButton, {
          use: "link",
          onClick: function onClick() {
            tracker.track('interaction', {
              action: 'breadcrumbClick'
            });

            _onClick();
          },
          children: message
        }, i);
      }), /*#__PURE__*/_jsx("span", {
        children: breadcrumbs[breadcrumbs.length - 1].message
      })]
    })
  });
};

export default Breadcrumbs;