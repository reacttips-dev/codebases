'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import hubspot from 'hubspot';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getKnowledgeBaseUrl from '../internal/utils/getKnowledgeBaseUrl';
export default createReactClass({
  displayName: "KnowledgeBaseButton",
  propTypes: {
    children: PropTypes.node,
    onClick: PropTypes.func,
    url: PropTypes.string.isRequired,
    useZorse: PropTypes.bool,
    zorseOptions: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "i18nAddon.supportLink.learnMore"
      }),
      use: 'link',
      useZorse: false,
      zorseOptions: {}
    };
  },
  getZorseCaller: function getZorseCaller(useZorse) {
    return useZorse && hubspot.zorse && hubspot.zorse.openHelpWidget;
  },
  handleClick: function handleClick(event) {
    var _this$props = this.props,
        onClick = _this$props.onClick,
        useZorse = _this$props.useZorse,
        zorseOptions = _this$props.zorseOptions,
        url = _this$props.url;
    var localeUrl = getKnowledgeBaseUrl(url);
    var openZorse = this.getZorseCaller(useZorse);

    if (openZorse) {
      event.preventDefault();
      openZorse(Object.assign({
        url: localeUrl
      }, zorseOptions));
    }

    if (onClick) {
      onClick();
    }
  },
  render: function render() {
    var _this$props2 = this.props,
        children = _this$props2.children,
        url = _this$props2.url,
        external = _this$props2.external,
        useZorse = _this$props2.useZorse,
        __zorseOptions = _this$props2.zorseOptions,
        __onClick = _this$props2.onClick,
        passThroughProps = _objectWithoutProperties(_this$props2, ["children", "url", "external", "useZorse", "zorseOptions", "onClick"]);

    var localeUrl = getKnowledgeBaseUrl(url);
    var linkProps = {};
    linkProps.external = typeof external === 'boolean' ? external : !this.getZorseCaller(useZorse);
    linkProps.href = localeUrl;
    linkProps.onClick = this.handleClick;
    return /*#__PURE__*/_jsx(UIButton, Object.assign({}, passThroughProps, {}, linkProps, {
      children: children
    }));
  }
});