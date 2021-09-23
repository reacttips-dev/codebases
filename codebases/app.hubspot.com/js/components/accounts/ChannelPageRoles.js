'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { setProp } from '../../lib/propTypes';
import { FACEBOOK_PAGE_TASKS } from '../../lib/constants';

var filterMostImportantRole = function filterMostImportantRole(roles) {
  if (roles.includes(FACEBOOK_PAGE_TASKS.MODERATE)) {
    return 'Moderator';
  } else if (roles.includes(FACEBOOK_PAGE_TASKS.ADVERTISE)) {
    return 'Advertiser';
  } else if (roles.includes(FACEBOOK_PAGE_TASKS.ANALYZE)) {
    return 'Analyst';
  } else {
    return 'Jobs Manager';
  }
};

var ChannelPageRoles = function ChannelPageRoles(_ref) {
  var pageRoles = _ref.pageRoles,
      showTasks = _ref.showTasks;

  if (pageRoles.isEmpty() || !showTasks) {
    return null;
  }

  return /*#__PURE__*/_jsx("span", {
    style: {
      color: '#ccc',
      fontSize: '11px',
      marginLeft: '10px'
    },
    children: filterMostImportantRole(pageRoles)
  });
};

ChannelPageRoles.propTypes = {
  pageRoles: setProp.isRequired,
  showTasks: PropTypes.bool.isRequired
};
export default ChannelPageRoles;