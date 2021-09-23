'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { getNewSnippetsUrl } from 'draft-plugins/lib/links';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import HR from 'UIComponents/elements/HR';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILink from 'UIComponents/link/UILink';
var SnippetsSearchNoResults = createReactClass({
  displayName: "SnippetsSearchNoResults",
  propTypes: {
    portalId: PropTypes.number.isRequired,
    toggleForcedOverlayFocus: PropTypes.func.isRequired
  },
  componentDidMount: function componentDidMount() {
    var toggleForcedOverlayFocus = this.props.toggleForcedOverlayFocus;

    if (toggleForcedOverlayFocus) {
      toggleForcedOverlayFocus(true);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    var toggleForcedOverlayFocus = this.props.toggleForcedOverlayFocus;

    if (toggleForcedOverlayFocus) {
      toggleForcedOverlayFocus(false);
    }
  },
  render: function render() {
    var portalId = this.props.portalId;
    return /*#__PURE__*/_jsxs("div", {
      className: "p-y-3",
      children: [/*#__PURE__*/_jsx("p", {
        className: "p-x-3 m-bottom-0",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.snippetsPlugin.resultsZeroState.text"
        })
      }), /*#__PURE__*/_jsx(HR, {
        distance: "flush",
        className: "m-y-3"
      }), /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        className: "p-x-3 m-bottom-0",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "add",
          color: BATTLESHIP,
          size: 4,
          className: "m-right-1"
        }), /*#__PURE__*/_jsx(UILink, {
          href: getNewSnippetsUrl(portalId),
          external: true,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.snippetsPlugin.resultsZeroState.link"
          })
        })]
      })]
    });
  }
});
export default SnippetsSearchNoResults;