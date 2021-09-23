'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import { COLUMN_SETTINGS, FAVORITE_PROPERTIES } from 'customer-data-objects/property/PropertyListTypes';
import PreviewColumn from 'crm_components/dialog/propertyListEditor/PreviewColumn';
import SearchResultsCategories from 'crm_components/dialog/propertyListEditor/SearchResultsCategories';
import DnDColumnManagement from 'crm_components/dialog/propertyListEditor/DnDColumnManagement';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import { OptionType } from 'UIComponents/types/OptionTypes';
import UIButton from 'UIComponents/button/UIButton';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UIScrollingColumns from 'UIComponents/layout/UIScrollingColumns';
import { CONTACT, COMPANY, DEAL, LINE_ITEM } from 'customer-data-objects/constants/ObjectTypes';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import PortalIdParser from 'PortalIdParser';
import { EDITOR_WIDTH } from './PropertyListEditorConstants';
var SETTINGS_TYPE_MAP = {};
SETTINGS_TYPE_MAP[COMPANY] = 'company';
SETTINGS_TYPE_MAP[CONTACT] = 'contact';
SETTINGS_TYPE_MAP[DEAL] = 'deal';
SETTINGS_TYPE_MAP[LINE_ITEM] = 'product';
var PropertyListEditor = createReactClass({
  displayName: 'PropertyListEditor',
  mixins: [ImmutableRenderMixin],
  propTypes: {
    propertyCategories: PropTypes.array.isRequired,
    type: PropTypes.oneOfType([ObjectTypesType, ObjectTypeIdType]),
    use: PropTypes.oneOf([COLUMN_SETTINGS, FAVORITE_PROPERTIES]).isRequired,
    value: PropTypes.arrayOf(OptionType.isRequired).isRequired,
    isCreateDisabled: PropTypes.bool,
    onAddOption: PropTypes.func,
    onRemoveOption: PropTypes.func,
    onReorderOption: PropTypes.func,
    onReset: PropTypes.func,
    onSave: PropTypes.func,
    onRequiredChange: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isCreateDisabled: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      search: ''
    };
  },
  getCreatePropertyURI: function getCreatePropertyURI() {
    var type = this.props.type;
    var uri;

    if (SETTINGS_TYPE_MAP[type]) {
      uri = "/property-settings/" + PortalIdParser.get() + "/" + SETTINGS_TYPE_MAP[type] + "/";
    }

    return uri;
  },
  handleSearchChange: function handleSearchChange(_ref) {
    var value = _ref.target.value;
    return this.setState({
      search: value
    });
  },
  renderSelectedPropertiesHeader: function renderSelectedPropertiesHeader() {
    return /*#__PURE__*/_jsx("h6", {
      className: "m-bottom-1",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "crm_components.PropertyListEditor.selected." + this.props.use,
        options: {
          count: this.props.value.length
        }
      })
    });
  },
  renderPreview: function renderPreview() {
    if (!this.props.value) {
      return null;
    }

    var _this$props = this.props,
        type = _this$props.type,
        use = _this$props.use,
        value = _this$props.value,
        handleRequiredChange = _this$props.onRequiredChange,
        handleAddOption = _this$props.onAddOption,
        handleRemoveOption = _this$props.onRemoveOption,
        handleReorderOption = _this$props.onReorderOption,
        handleReset = _this$props.onReset,
        handleSave = _this$props.onSave;
    return /*#__PURE__*/_jsx(PreviewColumn, {
      rows: value,
      onRequiredChange: handleRequiredChange,
      onAddOption: handleAddOption,
      onRemoveOption: handleRemoveOption,
      onReorderOption: handleReorderOption,
      onReset: handleReset,
      onSave: handleSave,
      requirable: false,
      type: type,
      use: use
    });
  },
  renderCreateLink: function renderCreateLink() {
    var propertyURI = this.getCreatePropertyURI();

    if (!propertyURI) {
      return null;
    }

    var isCreateDisabled = this.props.isCreateDisabled;
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "crm_components.GenericModal.createPropertyText"
      }), /*#__PURE__*/_jsx(PermissionTooltip, {
        disabled: !isCreateDisabled,
        tooltipKey: "editPropertiesDisabled",
        children: /*#__PURE__*/_jsx(UIButton, {
          href: isCreateDisabled ? '' : propertyURI,
          target: "_blank",
          use: "link",
          disabled: isCreateDisabled,
          className: "p-x-0",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "crm_components.GenericModal.addPropertyLink"
          })
        })
      })]
    });
  },
  renderSearchResults: function renderSearchResults() {
    var value = this.props.value;

    if (!value) {
      return null;
    }

    var _this$props2 = this.props,
        propertyCategories = _this$props2.propertyCategories,
        type = _this$props2.type,
        use = _this$props2.use,
        handleAddOption = _this$props2.onAddOption,
        handleRemoveOption = _this$props2.onRemoveOption,
        handleReset = _this$props2.onReset,
        handleSave = _this$props2.onSave;
    var search = this.state.search;
    return /*#__PURE__*/_jsx(SearchResultsCategories, {
      onAddOption: handleAddOption,
      onRemoveOption: handleRemoveOption,
      onReset: handleReset,
      onSave: handleSave,
      optionGroups: propertyCategories,
      selectedOptions: value,
      type: type,
      use: use,
      search: search
    });
  },
  renderSearchInput: function renderSearchInput() {
    return /*#__PURE__*/_jsx(UISearchInput, {
      autoFocus: true,
      "data-selenium-test": "edit-columns-search",
      onChange: this.handleSearchChange,
      placeholder: I18n.text('crm_components.GenericModal.searchPropertiesPlaceholder'),
      value: this.state.search
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UIScrollingColumns, {
      className: "propertyListEditor",
      "data-selenium-test": "property-list-editor",
      leftColumnHeader: this.renderSearchInput(),
      leftColumnContent: this.renderSearchResults(),
      leftColumnFooter: this.renderCreateLink(),
      rightColumnHeader: this.renderSelectedPropertiesHeader(),
      rightColumnContent: this.renderPreview(),
      leftColumnMinWidth: EDITOR_WIDTH / 2,
      rightColumnWidth: EDITOR_WIDTH / 2
    });
  }
});
export default DnDColumnManagement(PropertyListEditor);