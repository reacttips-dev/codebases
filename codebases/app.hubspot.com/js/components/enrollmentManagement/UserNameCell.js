'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

var UserNameCell = function UserNameCell(_ref) {
  var user = _ref.user;

  if (isLoading(user)) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small"
    });
  }

  if (isError(user)) {
    return '--';
  }

  if (isResolved(user)) {
    return /*#__PURE__*/_jsx("span", {
      children: user.label
    });
  }

  return '--';
};

UserNameCell.propTypes = {
  user: PropTypes.object
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    user: resolvers[ReferenceObjectTypes.USER].byId(props.userId)
  };
};

var UserName = ResolveReferences(mapResolversToProps)(UserNameCell);
export default UserName;