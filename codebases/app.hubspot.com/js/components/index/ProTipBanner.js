'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { tracker } from 'SequencesUI/util/UsageTracker';
import UIButton from 'UIComponents/button/UIButton';
import UIAlert from 'UIComponents/alert/UIAlert';
import * as links from 'SequencesUI/lib/links';
import { isProTipDismissed, dismissProTip } from 'SequencesUI/util/proTipUtils';
export default createReactClass({
  displayName: "ProTipBanner",
  getInitialState: function getInitialState() {
    return {
      isDismissed: isProTipDismissed()
    };
  },
  handleDismiss: function handleDismiss() {
    dismissProTip();
    this.setState({
      isDismissed: true
    });
  },
  handleLearnMore: function handleLearnMore() {
    tracker.track('sequencesInteraction', {
      action: 'Clicked proptip learn more',
      subscreen: 'sequences-index'
    });
  },
  renderLink: function renderLink(key, link) {
    var copy = "proTipBanner." + key;
    return /*#__PURE__*/_jsx(UIButton, {
      href: link,
      external: true,
      use: "link",
      className: "m-all-0",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: copy
      })
    });
  },
  renderContent: function renderContent() {
    return /*#__PURE__*/_jsxs("div", {
      className: "align-center",
      children: [/*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "proTipBanner.content",
        options: {
          gmailLink: this.renderLink('gmail', links.proTipGmail()),
          outlookLink: this.renderLink('outlook', links.proTipOutlook()),
          office365Link: this.renderLink('office365', links.proTipOffice365())
        }
      }), /*#__PURE__*/_jsx(UIButton, {
        type: "button",
        className: "m-left-5",
        use: "tertiary",
        size: "extra-small",
        onClick: this.handleLearnMore,
        href: links.proTipLearnMore(),
        external: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "proTipBanner.learnMore"
        })
      })]
    });
  },
  render: function render() {
    if (this.state.isDismissed) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIAlert, {
      className: "m-bottom-4",
      type: "info",
      closeable: true,
      onClose: this.handleDismiss,
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "proTipBanner.title"
      }),
      children: this.renderContent()
    });
  }
});