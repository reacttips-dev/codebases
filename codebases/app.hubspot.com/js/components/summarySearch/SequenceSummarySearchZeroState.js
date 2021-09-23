'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connectInbox } from 'SequencesUI/lib/links';
import isConnectedAccountValid from 'SequencesUI/util/isConnectedAccountValid';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIllustration from 'UIComponents/image/UIIllustration';
import { SequenceSearchQuery } from '../../records/SequenceSearchQuery';
import UIResultsMessage from 'UIComponents/results/UIResultsMessage';
export default createReactClass({
  displayName: "SequenceSummarySearchZeroState",
  propTypes: {
    query: PropTypes.instanceOf(SequenceSearchQuery).isRequired,
    connectedAccounts: PropTypes.object
  },
  isFiltered: function isFiltered() {
    var query = this.props.query;
    var filters = query.getIn(['filterGroups', 0, 'filters']);
    return filters.filterNot(function (filter) {
      return filter.property === 'sequenceId' || filter.property === 'hs_sequence_id';
    }).size !== 0;
  },
  renderCellPrimaryContent: function renderCellPrimaryContent() {
    var connectedAccounts = this.props.connectedAccounts;
    var inboxConnected = isConnectedAccountValid({
      connectedAccounts: connectedAccounts
    });

    if (inboxConnected) {
      return /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummaryZeroState.copy"
        })
      });
    }

    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummaryZeroState.inboxNotConnectedCopy"
        })
      }), /*#__PURE__*/_jsxs(UIButton, {
        use: "tertiary",
        className: "p-x-15",
        href: connectInbox(),
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "email",
          className: "p-right-1"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummaryZeroState.connectInbox"
        })]
      })]
    });
  },
  render: function render() {
    if (!this.isFiltered()) {
      return /*#__PURE__*/_jsx(UIEmptyState, {
        className: "m-bottom-10",
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummaryZeroState.title"
        }),
        primaryContent: this.renderCellPrimaryContent(),
        secondaryContent: /*#__PURE__*/_jsx(UIIllustration, {
          name: "empty-state-charts",
          width: "100%",
          responsive: false
        }),
        secondaryContentWidth: 210
      });
    }

    return /*#__PURE__*/_jsx(UIResultsMessage, {
      illustration: "empty-state-charts",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.sequenceSummarySearchZeroState.nothingFiltered"
      })
    });
  }
});