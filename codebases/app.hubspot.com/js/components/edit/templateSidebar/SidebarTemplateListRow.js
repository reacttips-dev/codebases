'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { Map as ImmutableMap } from 'immutable';
import UILink from 'UIComponents/link/UILink';
import Small from 'UIComponents/elements/Small';

var SidebarTemplateListRow = function SidebarTemplateListRow(_ref) {
  var template = _ref.template,
      selectRow = _ref.selectRow;
  var updatedAt = template.get('updatedAt');
  var firstName = template.getIn(['userView', 'firstName']);
  var lastName = template.getIn(['userView', 'lastName']);
  return /*#__PURE__*/_jsx("tr", {
    children: /*#__PURE__*/_jsxs("td", {
      className: "is--multiline__cell",
      children: [/*#__PURE__*/_jsx(UILink, {
        onClick: selectRow,
        "data-selenium-test": "template-list-row",
        children: template.get('name')
      }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(Small, {
        use: "help",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "edit.sidebarTemplateList.row.lastModified",
          options: {
            date: I18n.moment.userTz(updatedAt).fromNow(),
            owner: formatName({
              firstName: firstName,
              lastName: lastName
            })
          }
        })
      })]
    })
  });
};

SidebarTemplateListRow.propTypes = {
  template: PropTypes.instanceOf(ImmutableMap).isRequired,
  selectRow: PropTypes.func.isRequired
};
export default SidebarTemplateListRow;