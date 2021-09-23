'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { getScopes } from 'SequencesUI/lib/permissions';
import { updateTableContentState } from 'SequencesUI/actions/UIActions';
import { tracker, getPermissionSaveAction } from 'SequencesUI/util/UsageTracker';
import { connect } from 'react-redux';
import SequencesPageContainer from './SequencesPageContainer';
import { MANAGE_TAB } from 'SequencesUI/constants/TabNames';
import SequencesIndexAlerts from 'SequencesUI/components/index/SequencesIndexAlerts';
import SequencesIndexTable from 'SequencesUI/components/index/SequencesIndexTable';
import AssignmentPanel from 'sales-content-partitioning/panels/AssignmentPanel';

function trackPermissionSave(_ref) {
  var sharingOption = _ref.sharingOption;
  tracker.track('sequencesInteraction', {
    action: getPermissionSaveAction(sharingOption),
    subscreen: 'sequences-index'
  });
}

function SequencesIndexContainer(props) {
  return /*#__PURE__*/_jsxs(SequencesPageContainer, Object.assign({}, props, {
    activeTab: MANAGE_TAB,
    children: [/*#__PURE__*/_jsx(SequencesIndexAlerts, {}), /*#__PURE__*/_jsx(SequencesIndexTable, {
      updateTableContentState: props.updateTableContentState,
      location: props.location
    }), /*#__PURE__*/_jsx(AssignmentPanel, {
      afterSave: trackPermissionSave,
      scopes: fromJS(getScopes())
    })]
  }));
}

SequencesIndexContainer.propTypes = {
  updateTableContentState: PropTypes.func.isRequired,
  location: PropTypes.object
};
export default connect(function () {
  return {};
}, {
  updateTableContentState: updateTableContentState
})(SequencesIndexContainer);