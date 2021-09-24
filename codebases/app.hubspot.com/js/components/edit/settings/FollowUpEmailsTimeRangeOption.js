'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import partial from 'transmute/partial';
import styled from 'styled-components';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { sendTimeLearnMoreKBLink } from 'SequencesUI/lib/links';
import UILink from 'UIComponents/link/UILink';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITimeInput from 'UIComponents/input/UITimeInput';
import Small from 'UIComponents/elements/Small';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
export var StyledUITimeInput = styled(UITimeInput).attrs(function () {
  return {
    interval: 1
  };
}).withConfig({
  displayName: "FollowUpEmailsTimeRangeOption__StyledUITimeInput",
  componentId: "sc-1k3heim-0"
})(["width:140px !important;display:inline-block;"]);
var FollowUpEmailsTimeRangeOption = createReactClass({
  displayName: "FollowUpEmailsTimeRangeOption",
  propTypes: {
    sequenceSettings: PropTypes.instanceOf(ImmutableMap).isRequired,
    handleUpdateSettings: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
  },
  trackStrategyOptionEdits: function trackStrategyOptionEdits() {
    tracker.track('createOrEditSequence', {
      action: 'Set follow-up email time range'
    });
  },
  onChangeTimeRange: function onChangeTimeRange(type, _ref) {
    var value = _ref.target.value;
    var _this$props = this.props,
        sequenceSettings = _this$props.sequenceSettings,
        handleUpdateSettings = _this$props.handleUpdateSettings;
    this.trackStrategyOptionEdits();
    var updatedSettings = sequenceSettings.set(type, value);
    handleUpdateSettings(updatedSettings);
  },
  renderTimeRangeSelection: function renderTimeRangeSelection() {
    var _this$props2 = this.props,
        readOnly = _this$props2.readOnly,
        sequenceSettings = _this$props2.sequenceSettings;
    var sendWindowStartsAtMin = sequenceSettings.get('sendWindowStartsAtMin');
    var sendWindowEndsAtMin = sequenceSettings.get('sendWindowEndsAtMin');
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(UIFormLabel, {
        readOnly: readOnly,
        className: "p-top-0",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.settings.followUpEmails.sendWindow.timeRangeInputLabel"
        })
      }), /*#__PURE__*/_jsx(EditSequenceTooltip, {
        children: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(StyledUITimeInput, {
            value: sendWindowStartsAtMin,
            onChange: partial(this.onChangeTimeRange, 'sendWindowStartsAtMin'),
            max: sendWindowEndsAtMin,
            readOnly: readOnly,
            id: "send-window-start-input",
            "aria-label": I18n.text('edit.settings.followUpEmails.sendWindow.aria.timeRangeStart')
          }), /*#__PURE__*/_jsx(UIIcon, {
            name: "next",
            className: "m-x-3"
          }), /*#__PURE__*/_jsx(StyledUITimeInput, {
            value: sendWindowEndsAtMin,
            onChange: partial(this.onChangeTimeRange, 'sendWindowEndsAtMin'),
            min: sendWindowStartsAtMin,
            readOnly: readOnly,
            id: "send-window-end-input",
            "aria-label": I18n.text('edit.settings.followUpEmails.sendWindow.aria.timeRangeEnd')
          })]
        })
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(UITile, {
      compact: true,
      distance: "flush",
      children: [/*#__PURE__*/_jsxs(UITileSection, {
        children: [/*#__PURE__*/_jsx("b", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.settings.followUpEmails.sendWindow.label"
          })
        }), /*#__PURE__*/_jsx(Small, {
          use: "help",
          className: "display-block",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.settings.followUpEmails.sendWindow.help"
          })
        })]
      }), /*#__PURE__*/_jsx(UITileSection, {
        children: this.renderTimeRangeSelection()
      }), /*#__PURE__*/_jsx(UITileSection, {
        children: /*#__PURE__*/_jsxs(Small, {
          use: "help",
          children: [/*#__PURE__*/_jsx(UIIcon, {
            name: "dynamicFilter",
            size: "small"
          }), /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "edit.settings.emails.helpText_jsx",
            options: {
              href: sendTimeLearnMoreKBLink(),
              external: true
            },
            elements: {
              Link: UILink
            }
          })]
        })
      })]
    });
  }
});
export default FollowUpEmailsTimeRangeOption;