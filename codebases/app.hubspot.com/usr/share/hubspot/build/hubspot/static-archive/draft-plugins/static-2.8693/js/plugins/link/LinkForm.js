'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import LinkFormPagesSelector from './LinkFormPagesSelector';
import UIButton from 'UIComponents/button/UIButton';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import UIPopoverFooter from 'UIComponents/tooltip/UIPopoverFooter';
import UITextInput from 'UIComponents/input/UITextInput';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILink from 'UIComponents/link/UILink';
import { ENTER, ESCAPE } from 'draft-plugins/lib/keyCodes';
import Small from 'UIComponents/elements/Small';

var toI18nText = function toI18nText(name) {
  return I18n.text("draftPlugins.linkPlugin." + name);
};

var POPOVER_WIDTH = 328;
var PAGES_POPOVER_WIDTH = 425;
export default createReactClass({
  displayName: "LinkForm",
  propTypes: {
    isNew: PropTypes.bool.isRequired,
    headerText: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string.isRequired,
    pages: PropTypes.array.isRequired,
    isTargetBlank: PropTypes.bool.isRequired,
    isNoFollow: PropTypes.bool.isRequired,
    showText: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    hideTargetConfiguration: PropTypes.bool,
    hideNoFollowConfiguration: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      headerText: '',
      pages: [],
      showText: true,
      hideTargetConfiguration: false,
      hideNoFollowConfiguration: false
    };
  },
  cancelOrConfirmKeys: function cancelOrConfirmKeys(e) {
    switch (e.keyCode) {
      case ESCAPE:
        e.preventDefault();
        this.props.onCancel();
        return;

      case ENTER:
        e.preventDefault();

        if (this.canSubmit()) {
          this.props.onConfirm();
          return;
        }

        return;

      default:
        return;
    }
  },
  handleTextChange: function handleTextChange(_ref) {
    var target = _ref.target;
    var value = target.value;
    this.props.onChange({
      text: value
    });
  },
  handleUrlChange: function handleUrlChange(_ref2) {
    var target = _ref2.target;
    var _this$props = this.props,
        url = _this$props.url,
        text = _this$props.text,
        showText = _this$props.showText;
    var onChange = this.props.onChange;
    var value = target.value;

    if (showText && url === text) {
      onChange({
        url: value,
        text: value
      });
      return;
    }

    onChange({
      url: value
    });
  },
  handleNoFollowChange: function handleNoFollowChange(_ref3) {
    var target = _ref3.target;
    this.props.onChange({
      isNoFollow: target.checked
    });
  },
  handleTargetChange: function handleTargetChange(_ref4) {
    var target = _ref4.target;
    this.props.onChange({
      isTargetBlank: target.checked
    });
  },
  canSubmit: function canSubmit() {
    var _this$props2 = this.props,
        showText = _this$props2.showText,
        text = _this$props2.text,
        url = _this$props2.url; // eslint-disable-next-line no-script-url

    var doesNotContainScript = url && url.indexOf('javascript:') === -1;
    var textIsNotEmpty = !showText || text && text.trim().length > 0;
    var urlIsNotEmpty = url && url.trim().length > 0;
    return urlIsNotEmpty && textIsNotEmpty && doesNotContainScript;
  },
  shouldDisplayPages: function shouldDisplayPages() {
    return this.props.pages.length > 0;
  },
  renderFooter: function renderFooter() {
    var _this$props3 = this.props,
        isNew = _this$props3.isNew,
        onCancel = _this$props3.onCancel,
        onConfirm = _this$props3.onConfirm;
    var saveText = isNew ? toI18nText('apply') : toI18nText('save');
    return /*#__PURE__*/_jsxs(UIPopoverFooter, {
      className: "p-top-4",
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "tertiary",
        size: "extra-small",
        "data-selenium-test": "communicator-link-apply",
        disabled: !this.canSubmit(),
        onClick: onConfirm,
        children: saveText
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        size: "extra-small",
        onClick: function onClick() {
          return onCancel();
        },
        children: toI18nText('cancel')
      }), this.renderRemove()]
    });
  },
  renderVisitLink: function renderVisitLink() {
    var _this$props4 = this.props,
        isNew = _this$props4.isNew,
        url = _this$props4.url;

    if (!isNew) {
      return /*#__PURE__*/_jsx(UILink, {
        href: url,
        external: true,
        children: toI18nText('visitLink')
      });
    }

    return null;
  },
  renderText: function renderText() {
    var _this$props5 = this.props,
        text = _this$props5.text,
        showText = _this$props5.showText;

    if (!showText) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIFormControl, {
      label: toI18nText('text'),
      className: "m-top-1",
      children: /*#__PURE__*/_jsx(UITextInput, {
        className: "hs-input",
        "data-selenium-test": "communicator-link-text",
        onChange: this.handleTextChange,
        onKeyDown: this.cancelOrConfirmKeys,
        value: text
      })
    });
  },
  renderNoFollow: function renderNoFollow() {
    var _this$props6 = this.props,
        isNoFollow = _this$props6.isNoFollow,
        hideNoFollowConfiguration = _this$props6.hideNoFollowConfiguration;
    return hideNoFollowConfiguration ? null : /*#__PURE__*/_jsx(UIFormControl, {
      className: "m-top-2 LinkForm__no-follow-ui",
      children: /*#__PURE__*/_jsx(UICheckbox, {
        checked: isNoFollow,
        "data-test-id": "toggle-no-follow",
        onChange: this.handleNoFollowChange,
        innerPadding: "none",
        children: /*#__PURE__*/_jsx(Small, {
          children: toI18nText('noFollow')
        })
      })
    });
  },
  renderTarget: function renderTarget() {
    var _this$props7 = this.props,
        isTargetBlank = _this$props7.isTargetBlank,
        hideTargetConfiguration = _this$props7.hideTargetConfiguration;
    return hideTargetConfiguration ? null : /*#__PURE__*/_jsx(UIFormControl, {
      className: "m-top-2 LinkForm__target-ui",
      children: /*#__PURE__*/_jsx(UICheckbox, {
        checked: isTargetBlank,
        "data-test-id": "toggle-target",
        onChange: this.handleTargetChange,
        innerPadding: "none",
        children: /*#__PURE__*/_jsx(Small, {
          children: toI18nText('openInNewTab')
        })
      })
    });
  },
  renderRemove: function renderRemove() {
    var _this$props8 = this.props,
        isNew = _this$props8.isNew,
        onRemove = _this$props8.onRemove;

    if (!isNew) {
      return /*#__PURE__*/_jsx(UIButton, {
        use: "link",
        onClick: onRemove,
        children: toI18nText('removeLink')
      });
    }

    return null;
  },
  renderHeader: function renderHeader() {
    var isNew = this.props.isNew;
    var headerText = this.props.headerText;

    if (isNew) {
      headerText = toI18nText('newLink');
    }

    return /*#__PURE__*/_jsx(UIPopoverHeader, {
      children: /*#__PURE__*/_jsxs(UIFlex, {
        direction: "row",
        align: "baseline",
        justify: "between",
        children: [/*#__PURE__*/_jsx("h5", {
          children: headerText || toI18nText('editLink')
        }), this.renderVisitLink()]
      })
    });
  },
  renderUrl: function renderUrl() {
    var _this$props9 = this.props,
        onChange = _this$props9.onChange,
        pages = _this$props9.pages,
        showText = _this$props9.showText,
        text = _this$props9.text,
        url = _this$props9.url;

    if (this.shouldDisplayPages()) {
      return /*#__PURE__*/_jsx(LinkFormPagesSelector, {
        onChange: onChange,
        pages: pages,
        showText: showText,
        text: text,
        url: url
      });
    }

    return /*#__PURE__*/_jsx(UIFormControl, {
      label: toI18nText('url'),
      className: "m-top-1",
      children: /*#__PURE__*/_jsx(UITextInput, {
        autoFocus: true,
        className: "hs-input",
        "data-selenium-test": "communicator-link-url",
        onChange: this.handleUrlChange,
        onKeyDown: this.cancelOrConfirmKeys,
        value: url
      })
    });
  },
  render: function render() {
    var onConfirm = this.props.onConfirm;
    var width = this.shouldDisplayPages() ? PAGES_POPOVER_WIDTH : POPOVER_WIDTH;
    return /*#__PURE__*/_jsxs("div", {
      style: {
        width: width
      },
      children: [this.renderHeader(), /*#__PURE__*/_jsx(UIPopoverBody, {
        className: "p-top-2",
        children: /*#__PURE__*/_jsxs("form", {
          onSubmit: onConfirm,
          children: [this.renderText(), this.renderUrl(), /*#__PURE__*/_jsxs("div", {
            className: "m-top-2",
            children: [this.renderTarget(), this.renderNoFollow()]
          })]
        })
      }), this.renderFooter()]
    });
  }
});