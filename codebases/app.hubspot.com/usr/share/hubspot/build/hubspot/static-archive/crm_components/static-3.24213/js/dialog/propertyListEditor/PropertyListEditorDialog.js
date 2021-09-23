'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { COLUMN_SETTINGS, FAVORITE_PROPERTIES } from 'customer-data-objects/property/PropertyListTypes';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import PropertyListEditor from 'crm_components/dialog/propertyListEditor/PropertyListEditor';
import PropertyListHistory from 'crm_components/dialog/propertyListEditor/PropertyListHistory';
import { OptionGroupType, OptionType } from 'UIComponents/types/OptionTypes';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UIButton from 'UIComponents/button/UIButton';
import Small from 'UIComponents/elements/Small';
import { EDITOR_WIDTH } from './PropertyListEditorConstants';
export var PropertyListEditorDialog = createReactClass({
  displayName: 'PropertyListEditorDialog',
  mixins: [ImmutableRenderMixin],
  propTypes: Object.assign({
    confirmLabel: PropTypes.node,
    confirmOnNoChanges: PropTypes.bool,
    title: PropTypes.node,
    groups: PropTypes.arrayOf(OptionGroupType.isRequired).isRequired,
    objectType: AnyCrmObjectTypePropType,
    use: PropTypes.oneOf([COLUMN_SETTINGS, FAVORITE_PROPERTIES]).isRequired,
    value: PropTypes.arrayOf(OptionType.isRequired).isRequired,
    isCreateDisabled: PropTypes.bool,
    hasChanges: PropTypes.bool,
    onChange: PropTypes.func,
    onRequiredChange: PropTypes.func
  }, PromptablePropInterface),
  handleConfirm: function handleConfirm() {
    var _this$props = this.props,
        hasChanges = _this$props.hasChanges,
        confirmOnNoChanges = _this$props.confirmOnNoChanges;

    if (hasChanges || confirmOnNoChanges) {
      return this.props.onConfirm(this.props.value);
    }

    return this.props.onReject();
  },
  handleRemoveAll: function handleRemoveAll() {
    var _this$props2 = this.props,
        onChange = _this$props2.onChange,
        value = _this$props2.value;
    var filtered = value.filter(function (_ref) {
      var readOnly = _ref.readOnly,
          disabled = _ref.disabled;
      return readOnly || disabled;
    });
    return onChange(filtered);
  },
  renderRemoveAllLink: function renderRemoveAllLink() {
    var use = this.props.use;
    return /*#__PURE__*/_jsx("div", {
      className: "text-right",
      children: /*#__PURE__*/_jsx(UIButton, {
        onClick: this.handleRemoveAll,
        use: "link",
        children: /*#__PURE__*/_jsx(Small, {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "crm_components.PropertyListEditor.removeAll." + use
          })
        })
      })
    });
  },
  render: function render() {
    var _this$props3 = this.props,
        confirmLabel = _this$props3.confirmLabel,
        title = _this$props3.title,
        groups = _this$props3.groups,
        objectType = _this$props3.objectType,
        use = _this$props3.use,
        value = _this$props3.value,
        isCreateDisabled = _this$props3.isCreateDisabled,
        handleChange = _this$props3.onChange,
        handleReject = _this$props3.onReject,
        handleRequiredChange = _this$props3.onRequiredChange;
    return /*#__PURE__*/_jsx(BaseDialog, {
      confirmLabel: confirmLabel,
      title: title,
      confirmUse: "primary",
      onConfirm: this.handleConfirm,
      onReject: handleReject,
      width: EDITOR_WIDTH,
      "data-selenium-test": "edit-columns-dialog",
      extraRightAlignedFooter: this.renderRemoveAllLink(),
      children: /*#__PURE__*/_jsx(PropertyListEditor, {
        propertyCategories: groups,
        type: objectType,
        use: use,
        value: value,
        isCreateDisabled: isCreateDisabled,
        onChange: handleChange,
        onRequiredChange: handleRequiredChange
      })
    });
  }
});
export default PropertyListHistory(PropertyListEditorDialog);