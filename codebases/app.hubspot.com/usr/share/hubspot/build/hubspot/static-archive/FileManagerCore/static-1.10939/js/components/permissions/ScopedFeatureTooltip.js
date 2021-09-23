'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { readOnlyReasonProp } from '../../constants/propTypes';
import { getReadOnlyReason } from '../../selectors/Permissions';
import { getReadOnlyPermissionMessaging } from '../../utils/notifications';

var ScopedFeatureTooltip = function ScopedFeatureTooltip(props) {
  var readOnlyReason = props.readOnlyReason,
      children = props.children,
      titleOverride = props.titleOverride,
      rest = _objectWithoutProperties(props, ["readOnlyReason", "children", "titleOverride"]);

  var title;
  var disabled = !readOnlyReason;

  if (readOnlyReason) {
    title = getReadOnlyPermissionMessaging(readOnlyReason).explanation;
  } else if (titleOverride) {
    title = titleOverride;
    disabled = false;
  }

  return /*#__PURE__*/_jsx(UITooltip, Object.assign({
    title: title,
    disabled: disabled,
    "data-test-read-only-reason": readOnlyReason
  }, rest, {
    children: children
  }));
};

ScopedFeatureTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  titleOverride: PropTypes.node,
  readOnlyReason: readOnlyReasonProp
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    readOnlyReason: getReadOnlyReason(state)
  };
};

export default connect(mapStateToProps, {})(ScopedFeatureTooltip);