'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as EditorTabNames from 'SequencesUI/constants/EditorTabNames';
import { isUngatedForEmbeddedAutomation } from 'SequencesUI/lib/permissions';
import UIBadge from 'UIComponents/badge/UIBadge';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIToolBar from 'UIComponents/nav/UIToolBar';
import UIToolBarGroup from 'UIComponents/nav/UIToolBarGroup';
import UITab from 'UIComponents/nav/UITab';
import UITabs from 'UIComponents/nav/UITabs';
export default createReactClass({
  displayName: "EditorTabs",
  propTypes: {
    selectedTab: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func.isRequired
  },
  render: function render() {
    var _this$props = this.props,
        selectedTab = _this$props.selectedTab,
        handleTabChange = _this$props.handleTabChange;
    return /*#__PURE__*/_jsxs(UIToolBar, {
      use: "tabs",
      children: [/*#__PURE__*/_jsx(UIToolBarGroup, {}), /*#__PURE__*/_jsx(UIToolBarGroup, {
        children: /*#__PURE__*/_jsxs(UITabs, {
          selected: selectedTab,
          onSelectedChange: handleTabChange,
          children: [/*#__PURE__*/_jsx(UITab, {
            tabId: EditorTabNames.STEPS,
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.tabs.steps"
            })
          }), /*#__PURE__*/_jsx(UITab, {
            className: "editor-tab-settings",
            tabId: EditorTabNames.SETTINGS,
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.tabs.settings"
            })
          }), /*#__PURE__*/_jsx(UITab, {
            className: "editor-tab-automation",
            tabId: EditorTabNames.AUTOMATION,
            title: /*#__PURE__*/_jsxs(UIFlex, {
              children: [/*#__PURE__*/_jsx(FormattedMessage, {
                message: "edit.tabs.automation"
              }), isUngatedForEmbeddedAutomation() && /*#__PURE__*/_jsx(UIBadge, {
                use: "new",
                className: "m-left-2",
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "sequences.new"
                })
              })]
            })
          })]
        })
      }), /*#__PURE__*/_jsx(UIToolBarGroup, {})]
    });
  }
});