'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import UIList from 'UIComponents/list/UIList';
import UIRouterButtonLink from 'ui-addon-react-router/UIRouterButtonLink';
import { EMPTY } from 'SalesContentIndexUI/data/constants/TableContentState';
import TableContentStatePropType from 'SalesContentIndexUI/data/constants/TableContentStatePropType';
import * as SequencesRemediationActions from 'SequencesUI/actions/SequencesRemediationActions';
import ProTipBanner from 'SequencesUI/components/index/ProTipBanner';
import { reenroll } from 'SequencesUI/lib/links';

var useImpactedEnrollments = function useImpactedEnrollments(fetchImpactedEnrollments, impactedEnrollments) {
  useEffect(function () {
    fetchImpactedEnrollments();
  }, [fetchImpactedEnrollments]);
  return impactedEnrollments && impactedEnrollments.get('total') > 0;
};

function SequencesIndexAlerts(_ref) {
  var fetchImpactedEnrollments = _ref.fetchImpactedEnrollments,
      impactedEnrollments = _ref.impactedEnrollments,
      tableContentState = _ref.tableContentState;
  var hasImpactedEnrollments = useImpactedEnrollments(fetchImpactedEnrollments, impactedEnrollments);

  if (tableContentState === EMPTY) {
    return null;
  }

  return /*#__PURE__*/_jsxs(UIList, {
    children: [hasImpactedEnrollments && /*#__PURE__*/_jsx(UIAlert, {
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "impactedBanner.titleText"
      }),
      type: "danger",
      className: "m-bottom-4",
      children: /*#__PURE__*/_jsxs(UIButtonWrapper, {
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "impactedBanner.body.index.message"
        }), /*#__PURE__*/_jsx(UIRouterButtonLink, {
          to: reenroll(),
          size: "extra-small",
          use: "tertiary",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "impactedBanner.body.index.button"
          })
        })]
      })
    }), /*#__PURE__*/_jsx(ProTipBanner, {})]
  });
}

SequencesIndexAlerts.propTypes = {
  fetchImpactedEnrollments: PropTypes.func.isRequired,
  impactedEnrollments: PropTypes.instanceOf(ImmutableMap),
  tableContentState: TableContentStatePropType.isRequired
};
export default connect(function (state) {
  return {
    impactedEnrollments: state.sequencesRemediation.get('results'),
    tableContentState: state.ui.get('tableContentState')
  };
}, {
  fetchImpactedEnrollments: SequencesRemediationActions.fetchEnrollments
})(SequencesIndexAlerts);