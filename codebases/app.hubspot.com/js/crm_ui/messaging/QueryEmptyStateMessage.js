'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import EmptyStateMessage from '../emptyState/EmptyStateMessage';
import emptyStateMessages from '../emptyState/messages/emptyStateMessages';
import { getZeroStateMessage } from '../emptyState/messages/zeroStateMessages';

var QueryEmptyStateMessage = /*#__PURE__*/function (_PureComponent) {
  _inherits(QueryEmptyStateMessage, _PureComponent);

  function QueryEmptyStateMessage() {
    _classCallCheck(this, QueryEmptyStateMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(QueryEmptyStateMessage).apply(this, arguments));
  }

  _createClass(QueryEmptyStateMessage, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          extraEmptyCtaProps = _this$props.extraEmptyCtaProps,
          hasFilters = _this$props.hasFilters,
          objectType = _this$props.objectType,
          pageType = _this$props.pageType,
          query = _this$props.query,
          isEstimate = _this$props.isEstimate;
      var shouldShowZeroStateMessages = !(hasFilters || query);
      var config = shouldShowZeroStateMessages ? getZeroStateMessage(objectType, pageType) || getZeroStateMessage('generic') : isEstimate ? emptyStateMessages.preview || emptyStateMessages.generic : emptyStateMessages[objectType] || emptyStateMessages.generic;
      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(EmptyStateMessage, {
          illustration: config.illustration,
          illustrationWidth: config.illustrationWidth,
          isKnowledgeBaseButton: config.isKnowledgeBaseButton,
          linkHref: config.linkHref,
          linkText: config.linkText,
          objectType: objectType,
          pageType: pageType,
          reversed: config.reversed,
          secondaryContentWidth: config.secondaryContentWidth,
          subText: config.subText,
          renderSubText: config.renderSubText,
          titleText: config.titleText,
          ctaText: config.ctaText,
          ctaLink: config.ctaLink,
          ctaLinkQueryBlackList: config.ctaLinkQueryBlackList,
          extraCtaProps: extraEmptyCtaProps,
          query: query,
          CustomCTAComponent: config.CustomCTAComponent,
          children: children
        })
      });
    }
  }]);

  return QueryEmptyStateMessage;
}(PureComponent);

QueryEmptyStateMessage.propTypes = {
  children: PropTypes.node,
  extraEmptyCtaProps: PropTypes.object,
  hasFilters: PropTypes.bool,
  isEstimate: PropTypes.bool,
  objectType: AnyCrmObjectTypePropType,
  pageType: PageType.isRequired,
  query: PropTypes.string
};
export default QueryEmptyStateMessage;