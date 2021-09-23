'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cloneElement, isValidElement, PureComponent } from 'react';
import getComponentName from 'react-utils/getComponentName';
import UIBadge from '../../badge/UIBadge';
import UIButton from '../../button/UIButton';
import Small from '../../elements/Small';
import UIIcon from '../../icon/UIIcon';
import UIImage from '../../image/UIImage';
import UICheckbox from '../../input/UICheckbox';
import UIFlex from '../../layout/UIFlex';
import UILoadingSpinner from '../../loading/UILoadingSpinner';
import UITag from '../../tag/UITag';
import { OptionOrGroupType } from '../../types/OptionTypes';
import { stopPropagationHandler } from '../../utils/DomEvents';
import { warnIfFragment } from '../../utils/devWarnings';
import { getComponentPropType } from '../../utils/propTypes/componentProp'; // No-break space ensures that blank items are sized properly

var BLANK_LABEL = "\xA0";
var instanceCount = 0;

var UITypeaheadResultsItem = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITypeaheadResultsItem, _PureComponent);

  function UITypeaheadResultsItem(props) {
    var _this;

    _classCallCheck(this, UITypeaheadResultsItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITypeaheadResultsItem).call(this, props));
    instanceCount += 1;
    _this._checkboxId = "uitri-checkbox-" + instanceCount;
    return _this;
  }

  _createClass(UITypeaheadResultsItem, [{
    key: "getButtonClassName",
    value: function getButtonClassName(_ref) {
      var message = _ref.message,
          option = _ref.option;
      return classNames("uiTypeaheadResults__item", message ? "p-y-2 p-x-5" : "private-typeahead-result-label truncate-text", option.options && !option.selectAll && 'private-typeahead-result-heading');
    }
  }, {
    key: "getClassName",
    value: function getClassName(_ref2) {
      var highlighted = _ref2.highlighted,
          _ref2$option = _ref2.option,
          disabled = _ref2$option.disabled,
          dropdownClassName = _ref2$option.dropdownClassName;
      return classNames('private-typeahead-result', dropdownClassName, disabled ? 'private-typeahead-result--disabled' : 'private-typeahead-result--selectable' + (highlighted ? " private-typeahead-result--highlighted" : ""));
    }
  }, {
    key: "getLoadingIndicator",
    value: function getLoadingIndicator(computedButtonText) {
      return /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [computedButtonText, /*#__PURE__*/_jsx(UILoadingSpinner, {
          className: "private-typeahead-result__loading-indicator",
          size: "xs",
          use: "tertiary"
        })]
      });
    }
  }, {
    key: "getLabel",
    value: function getLabel(_ref3) {
      var _ref3$option = _ref3.option,
          buttonText = _ref3$option.buttonText,
          dropdownText = _ref3$option.dropdownText,
          loading = _ref3$option.loading,
          text = _ref3$option.text,
          value = _ref3$option.value,
          _useDropdownText = _ref3._useDropdownText;
      var fallbackText = text || (value == null ? '' : value.toString());

      if (_useDropdownText) {
        return dropdownText == null ? fallbackText : dropdownText;
      }

      var computedButtonText = buttonText == null ? fallbackText : buttonText;

      if (loading) {
        return this.getLoadingIndicator(computedButtonText);
      } else {
        return computedButtonText;
      }
    }
  }, {
    key: "getTitle",
    value: function getTitle(_ref4) {
      var _ref4$option = _ref4.option,
          text = _ref4$option.text,
          title = _ref4$option.title,
          value = _ref4$option.value;

      if (title === '') {
        return null;
      }

      return title || text || (value == null ? '' : value.toString());
    }
  }, {
    key: "renderHelp",
    value: function renderHelp(_ref5) {
      var _ref5$option = _ref5.option,
          disabled = _ref5$option.disabled,
          help = _ref5$option.help;

      if (help) {
        return /*#__PURE__*/_jsx(Small, {
          className: "private-typeahead-results-item__help",
          "data-uic-allow-dropdown-close": !disabled ? 'true' : null,
          disabled: disabled,
          use: "help",
          children: help
        });
      }

      return null;
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(_ref6, _ref7) {
      var search = _ref6.search;
      var computedLabel = _ref7.computedLabel;

      if (!computedLabel) {
        return BLANK_LABEL;
      }

      if (!search || typeof computedLabel !== 'string') {
        return computedLabel;
      }

      var searchResult = search.exec(computedLabel);

      if (!searchResult) {
        return computedLabel;
      }

      var match = searchResult[0];
      var head = computedLabel.slice(0, searchResult.index);
      var tail = computedLabel.slice(searchResult.index + match.length);
      return /*#__PURE__*/_jsxs("span", {
        children: [head, /*#__PURE__*/_jsx("span", {
          children: match
        }), tail]
      });
    }
  }, {
    key: "renderItemImage",
    value: function renderItemImage(_ref8) {
      var _ref8$option = _ref8.option,
          avatar = _ref8$option.avatar,
          icon = _ref8$option.icon,
          iconColor = _ref8$option.iconColor,
          imageUrl = _ref8$option.imageUrl;

      if (avatar) {
        var _avatar$props = avatar.props,
            className = _avatar$props.className,
            size = _avatar$props.size;
        var isUIAvatar = getComponentName(avatar) === 'UIAvatar';
        warnIfFragment(avatar, UITypeaheadResultsItem.displayName, 'avatar');
        var avatarEl = /*#__PURE__*/cloneElement(avatar, {
          className: classNames(className, !isUIAvatar && "private-dropdown__item__decoration private-dropdown__item__image"),
          size: isUIAvatar ? 'responsive' : size
        });

        if (!isUIAvatar) {
          return avatarEl;
        } // Resize UIAvatar to match UIImage/UIAvatarTag in UISelects by wrapping in HubStyle selectors (#8748)


        return /*#__PURE__*/_jsx("div", {
          className: "private-dropdown__item__decoration private-dropdown__item__image",
          children: avatarEl
        });
      }

      if (icon) {
        return /*#__PURE__*/_jsx(UIIcon, {
          className: "private-dropdown__item__decoration",
          name: icon,
          color: iconColor
        });
      }

      if (imageUrl) {
        return /*#__PURE__*/_jsx(UIImage, {
          className: "uiTypeaheadResults__image private-dropdown__item__decoration private-dropdown__item__image",
          src: imageUrl
        });
      }

      return null;
    }
  }, {
    key: "renderTag",
    value: function renderTag(_ref9) {
      var tag = _ref9.option.tag;

      if (!tag) {
        return null;
      }

      return /*#__PURE__*/_jsx(UITag, {
        inline: true,
        use: tag.use,
        children: tag.text
      });
    }
  }, {
    key: "renderBadge",
    value: function renderBadge(_ref10) {
      var badge = _ref10.option.badge;

      if (!badge) {
        return null;
      }

      if ( /*#__PURE__*/isValidElement(badge)) {
        warnIfFragment(badge, UITypeaheadResultsItem.displayName, 'badge');
        return /*#__PURE__*/cloneElement(badge, {
          className: classNames(badge.props.className, 'private-dropdown__badge')
        });
      } // Support object params (legacy)


      return /*#__PURE__*/_jsx(UIBadge, {
        className: "private-dropdown__badge",
        use: badge.use,
        children: badge.text
      });
    }
  }, {
    key: "renderContent",
    value: function renderContent(_ref11) {
      var renderedItemImage = _ref11.renderedItemImage,
          renderedLabel = _ref11.renderedLabel,
          renderedTag = _ref11.renderedTag,
          renderedBadge = _ref11.renderedBadge,
          toggleable = _ref11.toggleable;
      return /*#__PURE__*/_jsxs("span", {
        className: toggleable ? 'private-dropdown__item--toggleable' : '',
        children: [renderedItemImage, ' ', /*#__PURE__*/_jsx("span", {
          className: "private-dropdown__item__label",
          "data-option-text": true,
          children: renderedLabel
        }), ' ', renderedTag, " ", renderedBadge]
      });
    }
  }, {
    key: "renderButton",
    value: function renderButton(_ref12, _ref13) {
      var computedButtonClassName = _ref13.computedButtonClassName,
          computedTitle = _ref13.computedTitle,
          renderedContent = _ref13.renderedContent,
          renderedHelp = _ref13.renderedHelp;

      var _ref12$rest = _ref12.rest,
          onClick = _ref12$rest.onClick,
          rest = _objectWithoutProperties(_ref12$rest, ["onClick"]);

      return (
        /*#__PURE__*/
        // Keyboard events handled by parent component using aria-activedescendant pattern
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
        _jsxs("span", {
          onClick: onClick,
          children: [/*#__PURE__*/_jsx(UIButton, Object.assign({}, rest, {
            className: computedButtonClassName,
            tabIndex: -1,
            title: computedTitle,
            use: "unstyled",
            children: renderedContent
          })), renderedHelp]
        })
      );
    }
  }, {
    key: "renderCheckbox",
    value: function renderCheckbox(_ref14, _ref15) {
      var isIndeterminate = _ref14.isIndeterminate,
          isSelected = _ref14.isSelected,
          onToggle = _ref14.onToggle,
          option = _ref14.option,
          style = _ref14.style;
      var computedTitle = _ref15.computedTitle,
          renderedContent = _ref15.renderedContent,
          renderedHelp = _ref15.renderedHelp;
      return /*#__PURE__*/_jsxs("label", {
        // Route clicks on help text to checkbox
        style: {
          cursor: 'pointer'
        },
        onMouseDown: stopPropagationHandler // Prevent double-toggle
        ,
        children: [/*#__PURE__*/_jsx(UICheckbox, {
          className: "private-typeahead-result-label",
          checked: isSelected,
          disabled: option.disabled || isSelected && option.clearableValue === false,
          id: this._checkboxId,
          indeterminate: isIndeterminate,
          onChange: onToggle,
          style: style,
          title: computedTitle,
          children: renderedContent
        }), renderedHelp]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          highlighted = _this$props.highlighted,
          id = _this$props.id,
          isIndeterminate = _this$props.isIndeterminate,
          isSelected = _this$props.isSelected,
          Item = _this$props.itemComponent,
          message = _this$props.message,
          onMouseEnter = _this$props.onMouseEnter,
          onToggle = _this$props.onToggle,
          option = _this$props.option,
          search = _this$props.search,
          style = _this$props.style,
          toggleable = _this$props.toggleable,
          _useButton = _this$props._useButton,
          _useDropdownText = _this$props._useDropdownText,
          rest = _objectWithoutProperties(_this$props, ["highlighted", "id", "isIndeterminate", "isSelected", "itemComponent", "message", "onMouseEnter", "onToggle", "option", "search", "style", "toggleable", "_useButton", "_useDropdownText"]); // Escape hatch for dividers


      if (option.rawNode) return option.rawNode;
      var computedAriaSelected = highlighted || null;
      var computedItemClassName = this.getClassName({
        highlighted: highlighted,
        option: option
      });
      var computedButtonClassName = this.getButtonClassName({
        message: message,
        option: option
      });
      var computedTitle = this.getTitle({
        option: option
      });
      var computedLabel = this.getLabel({
        option: option,
        _useDropdownText: _useDropdownText
      });
      var renderedItemImage = this.renderItemImage({
        option: option
      });
      var renderedLabel = this.renderLabel({
        search: search
      }, {
        computedLabel: computedLabel
      });
      var renderedTag = this.renderTag({
        option: option
      });
      var renderedBadge = this.renderBadge({
        option: option
      });
      var renderedHelp = this.renderHelp({
        option: option,
        toggleable: toggleable
      });
      var renderedContent = this.renderContent({
        renderedItemImage: renderedItemImage,
        renderedLabel: renderedLabel,
        renderedTag: renderedTag,
        renderedBadge: renderedBadge,
        toggleable: toggleable
      }); // If _useButton={true}, wrap content in a button

      renderedContent = _useButton ? this.renderButton({
        rest: rest
      }, {
        computedButtonClassName: computedButtonClassName,
        computedTitle: computedTitle,
        renderedContent: renderedContent,
        renderedHelp: renderedHelp
      }) : renderedContent; // If toggleable={true}, wrap content in a checkbox

      renderedContent = toggleable ? this.renderCheckbox({
        isIndeterminate: isIndeterminate,
        isSelected: isSelected,
        onToggle: onToggle,
        option: option,
        style: style
      }, {
        computedTitle: computedTitle,
        renderedContent: renderedContent,
        renderedHelp: renderedHelp
      }) : renderedContent;

      if (typeof Item === 'function') {
        return /*#__PURE__*/_jsx(Item, Object.assign({}, rest, {
          "aria-selected": computedAriaSelected,
          id: id,
          onMouseEnter: onMouseEnter,
          option: option,
          className: computedItemClassName,
          "data-option-value": option.value,
          role: "option",
          children: renderedContent
        }));
      }

      return /*#__PURE__*/_jsx(Item, {
        "aria-selected": computedAriaSelected,
        className: computedItemClassName,
        "data-option-value": option.value,
        id: id,
        onMouseEnter: onMouseEnter,
        role: "option",
        children: renderedContent
      });
    }
  }]);

  return UITypeaheadResultsItem;
}(PureComponent);

export { UITypeaheadResultsItem as default };
UITypeaheadResultsItem.displayName = 'UITypeaheadResultsItem';
UITypeaheadResultsItem.propTypes = {
  highlighted: PropTypes.bool.isRequired,
  itemComponent: getComponentPropType({
    propTypes: {
      'aria-selected': PropTypes.bool,
      'data-option-value': PropTypes.string,
      id: PropTypes.string,
      className: PropTypes.string,
      option: OptionOrGroupType,
      onMouseEnter: PropTypes.func,
      children: PropTypes.node
    }
  }),
  isIndeterminate: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  message: PropTypes.bool,
  onToggle: PropTypes.func,
  option: OptionOrGroupType.isRequired,
  search: PropTypes.instanceOf(RegExp),
  toggleable: PropTypes.bool.isRequired,
  _useButton: PropTypes.bool,
  _useDropdownText: PropTypes.bool
};
UITypeaheadResultsItem.defaultProps = {
  highlighted: false,
  isIndeterminate: false,
  isSelected: false,
  itemComponent: 'li',
  toggleable: false,
  _useButton: true,
  _useDropdownText: true
};