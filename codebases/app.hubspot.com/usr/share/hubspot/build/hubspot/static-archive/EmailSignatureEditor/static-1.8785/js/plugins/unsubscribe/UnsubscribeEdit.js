'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import getLangLocale from 'I18n/utils/getLangLocale';
import HubSpotLanguageSelect from 'ui-addon-i18n/components/HubSpotLanguageSelect';
import UIFlex from 'UIComponents/layout/UIFlex';
import EventBoundaryPopover from 'draft-plugins/components/EventBoundaryPopover';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import unsubscribeBlockToHTML from './unsubscribeBlockToHTML';
import { LINK_TYPES } from './UnsubscribeConstants';
import UnsubscribeSelection from './UnsubscribeSelection';

var toI18n = function toI18n(key) {
  return I18n.text("signatureEditorModal.unsubscribeLink.edit." + key);
};

export default createReactClass({
  displayName: "UnsubscribeEdit",
  propTypes: {
    unsubscribeData: PropTypes.instanceOf(ImmutableMap).isRequired,
    onConfirm: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    var unsubscribeData = this.props.unsubscribeData;
    return {
      open: false,
      linkType: unsubscribeData.get('linkType') || LINK_TYPES.PREFER_LESS,
      url: unsubscribeData.get('url'),
      selectedLang: unsubscribeData.get('locale') || getLangLocale()
    };
  },
  handleClick: function handleClick() {
    var _this = this;

    this.setState(function (_ref) {
      var open = _ref.open;
      return Object.assign({}, _this.getInitialState(), {
        open: !open
      });
    });
  },
  handleLinkSelect: function handleLinkSelect(link) {
    this.setState({
      linkType: link
    });
  },
  handleConfirm: function handleConfirm() {
    var onConfirm = this.props.onConfirm;
    var _this$state = this.state,
        linkType = _this$state.linkType,
        url = _this$state.url,
        selectedLang = _this$state.selectedLang;
    onConfirm(ImmutableMap({
      linkType: linkType,
      url: url,
      locale: selectedLang
    }));
    this.setState(this.getInitialState());
  },
  handleReject: function handleReject() {
    this.setState(this.getInitialState());
  },
  removeUnsubscribeLink: function removeUnsubscribeLink() {
    var _this2 = this;

    this.setState({
      open: false
    }, function () {
      _this2.props.onConfirm(ImmutableMap({
        linkType: null
      }));
    });
  },
  renderPopover: function renderPopover() {
    var _this3 = this;

    return {
      header: /*#__PURE__*/_jsx("strong", {
        children: toI18n('header')
      }),
      body: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(HubSpotLanguageSelect, {
          value: this.state.selectedLang,
          isPublic: true,
          onChange: function onChange(_ref2) {
            var defaultLocale = _ref2.defaultLocale;
            return _this3.setState({
              selectedLang: defaultLocale
            });
          },
          className: "m-bottom-3"
        }), /*#__PURE__*/_jsx(UnsubscribeSelection, {
          selectedLinkType: this.state.linkType,
          selectedLang: this.state.selectedLang,
          onChange: this.handleLinkSelect
        })]
      }),
      footer: /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "tertiary",
          size: "small",
          onClick: this.handleConfirm,
          children: toI18n('submit')
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "tertiary-light",
          size: "small",
          onClick: this.handleReject,
          children: toI18n('cancel')
        }), /*#__PURE__*/_jsx(UILink, {
          className: "m-left-auto",
          onClick: this.removeUnsubscribeLink,
          children: toI18n('removeLink')
        })]
      })
    };
  },
  render: function render() {
    var open = this.state.open; // if the popover is closed always use block data via props

    var _ref3 = open ? this.state : this.getInitialState(),
        linkType = _ref3.linkType,
        url = _ref3.url,
        selectedLang = _ref3.selectedLang;

    return /*#__PURE__*/_jsx(EventBoundaryPopover, {
      open: open,
      content: this.renderPopover(),
      width: 500,
      children: /*#__PURE__*/_jsxs("div", {
        className: "sig-editor-unsubscribe-edit",
        onClick: this.handleClick,
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "edit",
          className: "edit-icon pull-right m-right-2"
        }), unsubscribeBlockToHTML({
          linkType: linkType,
          url: url,
          locale: selectedLang
        })]
      })
    });
  }
});