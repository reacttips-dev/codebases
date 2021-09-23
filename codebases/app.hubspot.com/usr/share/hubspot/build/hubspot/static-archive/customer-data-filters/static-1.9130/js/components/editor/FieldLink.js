'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { FILTER_LINK_CLICKED } from 'customer-data-filters/filterQueryFormat/UsageSubActionTypes';
import FilterOperatorType from '../propTypes/FilterOperatorType';
import FilterUserAction from 'customer-data-filters/filterQueryFormat/FilterUserAction';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ListIsMember from 'customer-data-filters/filterQueryFormat/operator/ListIsMember';
import ListIsNotMember from 'customer-data-filters/filterQueryFormat/operator/ListIsNotMember';
import PropTypes from 'prop-types';
import UILink from 'UIComponents/link/UILink';
import get from 'transmute/get';
import getIn from 'transmute/getIn';

var _getLinkMessage = function _getLinkMessage(value) {
  return value instanceof ListIsMember || value instanceof ListIsNotMember ? 'customerDataFilters.FilterEditorPanel.seeList' : 'customerDataFilters.FilterEditorPanel.seeDetails';
};

var FieldLink = function FieldLink(props) {
  var filterFamily = props.filterFamily,
      onUserAction = props.onUserAction,
      panelKey = props.panelKey,
      url = props.url,
      value = props.value;
  var onClick = typeof onUserAction === 'function' ? function () {
    return onUserAction(FilterUserAction({
      condition: get('name', value),
      filterFamily: filterFamily,
      panelKey: panelKey,
      refinement: getIn(['refinement', 'name'], value),
      subAction: FILTER_LINK_CLICKED
    }));
  } : undefined;
  return /*#__PURE__*/_jsx(UILink, {
    external: true,
    href: url,
    onClick: onClick,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: _getLinkMessage(value)
    })
  });
};

FieldLink.displayName = 'FieldLink';
FieldLink.propTypes = {
  filterFamily: PropTypes.string.isRequired,
  onUserAction: PropTypes.func,
  panelKey: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  value: FilterOperatorType.isRequired
};
export default FieldLink;