'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import unescapedText from 'I18n/utils/unescapedText';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import Big from 'UIComponents/elements/Big';
import UILink from 'UIComponents/link/UILink';
import UIImage from 'UIComponents/image/UIImage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardSection from 'UIComponents/card/UICardSection';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';
import UIButton from 'UIComponents/button/UIButton';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import isValidI18nKey from 'I18n/utils/isValidI18nKey';

var getColumnType = function getColumnType(objectType) {
  var message = isValidI18nKey("genericTypes." + objectType) ? "genericTypes." + objectType : 'genericTypes.items';
  return unescapedText(message);
};

var EmptyStateMessage = /*#__PURE__*/function (_PureComponent) {
  _inherits(EmptyStateMessage, _PureComponent);

  function EmptyStateMessage() {
    var _this;

    _classCallCheck(this, EmptyStateMessage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EmptyStateMessage).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleTrackLinkClick = function (linkHref, linkText) {
      CrmLogger.logCRMOnboarding(_this.props.objectType, {
        action: 'clicked empty state link',
        link: linkHref,
        text: linkText
      });
    };

    _this.partial = memoize(partial);
    _this.handleTrackLinkClick = _this.handleTrackLinkClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EmptyStateMessage, [{
    key: "renderCTALink",
    value: function renderCTALink() {
      var _this$props = this.props,
          ctaText = _this$props.ctaText,
          ctaLink = _this$props.ctaLink,
          _this$props$extraCtaP = _this$props.extraCtaProps,
          extraCtaProps = _this$props$extraCtaP === void 0 ? {} : _this$props$extraCtaP;

      if (!ctaText || !ctaLink) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIButton, Object.assign({
        use: "tertiary-light",
        href: ctaLink
      }, extraCtaProps, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: ctaText
        })
      }));
    }
  }, {
    key: "renderPrimaryContent",
    value: function renderPrimaryContent() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          isKnowledgeBaseButton = _this$props2.isKnowledgeBaseButton,
          linkHref = _this$props2.linkHref,
          linkText = _this$props2.linkText,
          objectType = _this$props2.objectType,
          subText = _this$props2.subText,
          translatedSubtext = _this$props2.translatedSubtext,
          CustomCTAComponent = _this$props2.CustomCTAComponent,
          renderSubText = _this$props2.renderSubText;
      var isSubtextVisible = renderSubText || subText || translatedSubtext;
      var defaultTranslatedSubtext = renderSubText ? renderSubText() : subText && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: subText,
        options: {
          columnType: getColumnType(objectType)
        }
      });
      return /*#__PURE__*/_jsxs("span", {
        children: [isSubtextVisible && /*#__PURE__*/_jsx(Big, {
          "data-test-id": "empty-state-subtext",
          tagName: "p",
          use: "help",
          children: translatedSubtext || defaultTranslatedSubtext
        }), isSubtextVisible && !isKnowledgeBaseButton && linkText && linkHref && /*#__PURE__*/_jsx("p", {
          "data-test-id": "empty-state-link",
          children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: linkText,
            options: {
              href: linkHref,
              onClick: this.partial(this.handleTrackLinkClick, linkHref, linkText)
            },
            elements: {
              Link: UILink
            }
          })
        }), isSubtextVisible && isKnowledgeBaseButton && /*#__PURE__*/_jsx("p", {
          "data-test-id": "empty-state-kb-button",
          children: /*#__PURE__*/_jsx(KnowledgeBaseButton, {
            url: linkHref,
            useZorse: true,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: linkText
            })
          })
        }), this.renderCTALink(), CustomCTAComponent && /*#__PURE__*/_jsx(CustomCTAComponent, {}), children]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          illustration = _this$props3.illustration,
          _this$props3$illustra = _this$props3.illustrationWidth,
          illustrationWidth = _this$props3$illustra === void 0 ? 200 : _this$props3$illustra,
          imageUrl = _this$props3.imageUrl,
          _this$props3$imageWid = _this$props3.imageWidth,
          imageWidth = _this$props3$imageWid === void 0 ? 200 : _this$props3$imageWid,
          objectType = _this$props3.objectType,
          pageType = _this$props3.pageType,
          reversed = _this$props3.reversed,
          _this$props3$secondar = _this$props3.secondaryContentWidth,
          secondaryContentWidth = _this$props3$secondar === void 0 ? 200 : _this$props3$secondar,
          titleText = _this$props3.titleText;
      var isCardWrapperNeeded = pageType !== 'index';
      var secondaryContent = imageUrl ? /*#__PURE__*/_jsx(UIImage, {
        src: imageUrl,
        width: imageWidth
      }) : /*#__PURE__*/_jsx(UIIllustration, {
        name: illustration,
        width: illustrationWidth
      });

      var emptyState = /*#__PURE__*/_jsx(UIEmptyState, {
        flush: true,
        primaryContent: this.renderPrimaryContent(),
        reverseOrder: reversed,
        secondaryContent: secondaryContent,
        secondaryContentWidth: secondaryContentWidth,
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: titleText,
          options: {
            columnType: getColumnType(objectType)
          }
        })
      });

      return /*#__PURE__*/_jsx("div", {
        className: "empty-state-message",
        "data-selenium-test": "EmptyStateMessage",
        children: isCardWrapperNeeded ? /*#__PURE__*/_jsx(UICardWrapper, {
          children: /*#__PURE__*/_jsx(UICardSection, {
            children: emptyState
          })
        }) : /*#__PURE__*/_jsx("div", {
          className: "m-x-auto m-y-6",
          children: emptyState
        })
      });
    }
  }]);

  return EmptyStateMessage;
}(PureComponent);

EmptyStateMessage.propTypes = {
  children: PropTypes.node,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
  ctaLinkQueryBlackList: PropTypes.array,
  extraCtaProps: PropTypes.object,
  illustration: PropTypes.string,
  illustrationWidth: PropTypes.number,
  isKnowledgeBaseButton: PropTypes.bool,
  imageUrl: PropTypes.string,
  imageWidth: PropTypes.number,
  linkHref: PropTypes.string,
  linkText: PropTypes.string,
  objectType: AnyCrmObjectTypePropType.isRequired,
  pageType: PageType.isRequired,
  params: PropTypes.object,
  query: PropTypes.string,
  queryParams: PropTypes.object,
  reversed: PropTypes.bool,
  secondaryContentWidth: PropTypes.number,
  subText: PropTypes.string,
  renderSubText: PropTypes.func,
  titleText: PropTypes.string.isRequired,
  translatedSubtext: PropTypes.node,
  CustomCTAComponent: PropTypes.func
};
EmptyStateMessage.defaultProps = {
  reversed: false,
  pageType: PageTypes.INDEX
};
export default EmptyStateMessage;