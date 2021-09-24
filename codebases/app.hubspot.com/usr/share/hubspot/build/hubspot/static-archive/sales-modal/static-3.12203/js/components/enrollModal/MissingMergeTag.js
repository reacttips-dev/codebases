'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import replaceMissingMergeTags from 'sales-modal/lib/replaceMissingMergeTags';
import { formatMergeTag } from 'draft-plugins/utils/propertyUtils';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import memoize from 'transmute/memoize';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITag from 'UIComponents/tag/UITag';
import UIForm from 'UIComponents/form/UIForm';
import UIButton from 'UIComponents/button/UIButton';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UITextInput from 'UIComponents/input/UITextInput';
import EventBoundaryPopover from 'draft-plugins/components/EventBoundaryPopover';
var flattenPropertyList = memoize(function (propertyLists) {
  return propertyLists.map(function (a) {
    return a.reduce(function (propertyMap, propertyListData) {
      return propertyListData.get('properties').reduce(function (updatedPropertyMap, property) {
        var _property$toObject = property.toObject(),
            name = _property$toObject.name,
            fieldType = _property$toObject.fieldType;

        return updatedPropertyMap.set(name, fieldType);
      }, propertyMap);
    }, ImmutableMap());
  });
});
export default createReactClass({
  displayName: "MissingMergeTag",
  propTypes: {
    children: PropTypes.any,
    tagType: PropTypes.string.isRequired,
    flattenedProperties: PropTypes.instanceOf(ImmutableMap),
    contact: PropTypes.instanceOf(ContactRecord),
    user: PropTypes.object,
    handleMissingMergeTags: PropTypes.func.isRequired,
    properties: PropTypes.instanceOf(ImmutableMap).isRequired
  },
  getInitialState: function getInitialState() {
    return {
      value: '',
      isOpen: false
    };
  },
  getSplitTag: function getSplitTag() {
    var tagType = this.props.tagType;

    var _tagType$split = tagType.split('.'),
        _tagType$split2 = _slicedToArray(_tagType$split, 2),
        prefix = _tagType$split2[0],
        property = _tagType$split2[1];

    return {
      prefix: prefix,
      property: property
    };
  },
  getTagName: function getTagName() {
    var flattenedProperties = this.props.flattenedProperties;

    var _this$getSplitTag = this.getSplitTag(),
        prefix = _this$getSplitTag.prefix,
        property = _this$getSplitTag.property;

    return formatMergeTag(prefix, property, flattenedProperties);
  },
  handleApply: function handleApply() {
    var _this$props = this.props,
        tagType = _this$props.tagType,
        contact = _this$props.contact,
        user = _this$props.user,
        handleMissingMergeTags = _this$props.handleMissingMergeTags;
    var value = this.state.value;
    var mergeTagInputFields = ImmutableMap().set(tagType, value);
    handleMissingMergeTags(mergeTagInputFields);

    if (this.getIsUpdatablePropertyType()) {
      replaceMissingMergeTags(contact, mergeTagInputFields, user.get('email'));
    }

    this.setState({
      isOpen: false
    });
  },
  handleDelete: function handleDelete() {
    this.setState({
      value: ''
    }, this.handleApply);
  },
  handleSubmit: function handleSubmit(evt) {
    evt.preventDefault();

    if (!this.state.value) {
      return;
    }

    this.handleApply();
  },
  handleInputChange: function handleInputChange(e) {
    var value = e.target.value;
    this.setState({
      value: value
    });
  },
  getPlaceholder: function getPlaceholder() {
    var lowerCase = this.getTagName().toLowerCase();
    return I18n.text('missingMergeTagComponent.enter') + " " + lowerCase;
  },
  getIsUpdatablePropertyType: function getIsUpdatablePropertyType() {
    var recipientIsContact = this.props.contact.get('vid');
    return recipientIsContact && this.getPropertyType() === 'text';
  },
  getPropertyType: function getPropertyType() {
    var _this$getSplitTag2 = this.getSplitTag(),
        prefix = _this$getSplitTag2.prefix,
        property = _this$getSplitTag2.property;

    var properties = this.props.properties;
    var propertyGroup = properties.filter(function (_, groupName) {
      return groupName === prefix + "Properties";
    });
    return propertyGroup.size && flattenPropertyList(propertyGroup).first().get(property);
  },
  getApplyButtonMessage: function getApplyButtonMessage() {
    var _this$getSplitTag3 = this.getSplitTag(),
        prefix = _this$getSplitTag3.prefix;

    var properties = this.props.properties;

    if (!properties) {
      return null;
    }

    var message = 'missingMergeTagComponent.confirm.other';

    if (this.getIsUpdatablePropertyType()) {
      if (prefix === 'contact') {
        message = 'missingMergeTagComponent.confirm.contactRecord';
      }

      if (prefix === 'company') {
        message = 'missingMergeTagComponent.confirm.companyRecord';
      }
    }

    return message;
  },
  renderContent: function renderContent() {
    var _this = this;

    var value = this.state.value;
    var isReadyToApply = value !== '';
    return /*#__PURE__*/_jsxs(UIForm, {
      onSubmit: this.handleSubmit,
      className: "p-all-5",
      children: [/*#__PURE__*/_jsx(UIFormLabel, {
        className: "p-all-0 m-bottom-2",
        children: this.getTagName()
      }), /*#__PURE__*/_jsx(UIFlex, {
        direction: "row",
        align: "center",
        children: /*#__PURE__*/_jsx(UITextInput, {
          className: "m-bottom-3",
          value: value,
          onChange: this.handleInputChange,
          placeholder: this.getPlaceholder(),
          autoFocus: true,
          "data-selenium-test": "missing-merge-tag-input"
        })
      }), /*#__PURE__*/_jsxs(UIFlex, {
        direction: "row",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "tertiary",
          size: "extra-small",
          disabled: !isReadyToApply,
          onClick: this.handleApply,
          "data-selenium-test": "missing-merge-tag-apply",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: this.getApplyButtonMessage()
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "tertiary-light",
          size: "extra-small",
          onClick: function onClick() {
            return _this.setState({
              isOpen: false
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "missingMergeTagComponent.cancel"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          className: "m-left-3",
          onClick: this.handleDelete,
          "data-selenium-test": "missing-merge-tag-remove",
          size: "extra-small",
          use: "transparent",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "missingMergeTagComponent.removeToken"
          })
        })]
      })]
    });
  },
  render: function render() {
    var _this2 = this;

    var isOpen = this.state.isOpen;
    return /*#__PURE__*/_jsx(EventBoundaryPopover, {
      open: isOpen,
      placement: "top",
      content: this.renderContent(),
      onOpenChange: function onOpenChange(e) {
        return _this2.setState({
          isOpen: e.target.value
        });
      },
      children: /*#__PURE__*/_jsx(UITag, {
        use: "danger",
        inline: true,
        className: "m-top-1",
        children: /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "link",
          onClick: function onClick() {
            return _this2.setState({
              isOpen: !isOpen
            });
          },
          children: this.props.children
        })
      })
    });
  }
});