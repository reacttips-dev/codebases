'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'general-store';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { List, Map as ImmutableMap } from 'immutable';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import ProductReferenceResolver from 'reference-resolvers/resolvers/ProductReferenceResolver';
import { PRODUCT } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { EXTERNAL_ACCOUNT_ID } from 'customer-data-objects/product/ProductProperties';
import ProductRecord from 'customer-data-objects/product/ProductRecord';
import { setProperty } from 'customer-data-objects/model/ImmutableModel';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIMediaObject from 'UIComponents/layout/UIMediaObject';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UILink from 'UIComponents/link/UILink';
import UIButton from 'UIComponents/button/UIButton';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import UIStatusTag from 'UIComponents/tag/UIStatusTag';
import UIIcon from 'UIComponents/icon/UIIcon';
import UINumberInput from 'UIComponents/input/UINumberInput';
import links from 'crm-legacy-links/links';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { CALYPSO } from 'HubStyleTokens/colors';
import ProductResolverSelect from './ProductResolverSelect';
import UserStore from 'crm_data/user/UserStore';
import { getCurrencyPriceProperty, RECURRING_BILLING_FREQUENCY, QUANTITY } from 'customer-data-objects/lineItem/PropertyNames';
import FormattedPrice from 'products-ui-components/components/display/FormattedPrice';
import { convertProductToLineItem, convertProductsToLineItems, calculateDealAmountFromPreference, setCalculatedPropertyValues } from 'products-ui-components/utils/lineItems';
import { getCalculatedPropertyValues } from 'products-ui-components/api/lineItemCalculatedPropertiesAPI';
var MAX_INT = 2147483647;
var ProductSelect = ProvideReferenceResolvers(_defineProperty({}, PRODUCT, ProductReferenceResolver))(ProductResolverSelect);
export var LineItemsInputFormComponent = createReactClass({
  displayName: "LineItemsInputFormComponent",
  propTypes: {
    setLineItemsToAdd: PropTypes.func.isRequired,
    defaultCurrencyCode: PropTypes.string,
    effectiveCurrencyCode: PropTypes.string,
    hasMulticurrencyActive: PropTypes.bool,
    multicurrencies: PropTypes.instanceOf(List).isRequired,
    productProperties: PropTypes.instanceOf(ImmutableMap).isRequired,
    userEmail: PropTypes.string.isRequired,
    dealAmountPreference: PropTypes.string
  },
  getInitialState: function getInitialState() {
    // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)
    this.partial = memoize(partial);
    return {
      total: 0,
      selectedLineItems: List(),
      valueOptions: List(),
      searchResult: null,
      hoveredRow: null,
      hideAddLineItem: true
    };
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    var _this = this;

    // if the currency updates, clear all selected products without the new currency
    if (nextProps.effectiveCurrencyCode !== this.props.effectiveCurrencyCode) {
      var valueOptions = this.state.valueOptions;
      var validValueOptions = valueOptions.filter(function (option) {
        return Boolean(_this.getPriceForEffectiveCurrency(option, nextProps.effectiveCurrencyCode, nextProps.hasMulticurrencyActive));
      });
      var validCurrencyProducts = validValueOptions.map(function (option) {
        return ProductRecord(option.record.referencedObject);
      });
      var formattedLineItems = convertProductsToLineItems(validCurrencyProducts, nextProps.hasMulticurrencyActive ? nextProps.effectiveCurrencyCode : null, nextProps.userEmail, nextProps.multicurrencies, nextProps.defaultCurrencyCode);
      this.setState({
        valueOptions: validValueOptions,
        hideAddLineItem: validValueOptions.size === 0
      });
      this.updateLineItemsAndTotal(formattedLineItems);
    }
  },
  hasUsedSync: function hasUsedSync() {
    var productProperties = this.props.productProperties;
    return !!productProperties.get(EXTERNAL_ACCOUNT_ID);
  },
  handleHoverRow: function handleHoverRow(index) {
    this.setState({
      hoveredRow: index
    });
  },
  handleStopHovering: function handleStopHovering() {
    this.setState({
      hoveredRow: -1
    });
  },
  updateLineItemsAndTotal: function updateLineItemsAndTotal(formattedLineItems) {
    var isCalculationUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var _this$props = this.props,
        setLineItemsToAdd = _this$props.setLineItemsToAdd,
        dealAmountPreference = _this$props.dealAmountPreference;
    var hasLineItems = formattedLineItems.size > 0;
    var total = calculateDealAmountFromPreference({
      dealAmountPreference: dealAmountPreference,
      lineItems: formattedLineItems
    });

    if (!isCalculationUpdate && hasLineItems) {
      this.updateLineItemsWithCalculations(formattedLineItems);
    }

    this.setState({
      selectedLineItems: formattedLineItems,
      total: total
    });
    setLineItemsToAdd(formattedLineItems, total, hasLineItems, // disable confirm on creation modal if calculations are not being updated
    hasLineItems && !isCalculationUpdate);
  },
  updateLineItemsWithCalculations: function updateLineItemsWithCalculations(lineItems) {
    var _this2 = this;

    getCalculatedPropertyValues(lineItems).then(function (calculations) {
      var updatedLineItems = setCalculatedPropertyValues({
        lineItems: lineItems,
        calculations: calculations
      });

      _this2.updateLineItemsAndTotal(updatedLineItems, true);
    }).catch(function (error) {
      // unblock user from creating deal if there's an API failure
      _this2.props.setLineItemsToAdd(lineItems, _this2.state.total, false, false);

      throw error;
    }).done();
  },
  handleQuantityChange: function handleQuantityChange(index, _ref) {
    var quantity = _ref.target.value;
    var selectedLineItems = this.state.selectedLineItems;

    if (Number.isInteger(quantity)) {
      var formattedLineItems = selectedLineItems.update(index, function (lineItem) {
        return setProperty(lineItem, QUANTITY, quantity);
      });
      this.updateLineItemsAndTotal(formattedLineItems);
    }
  },
  handleSelectFromProductLibrary: function handleSelectFromProductLibrary(index, _ref2) {
    var selectedOption = _ref2.target.value;
    var _this$props2 = this.props,
        hasMulticurrencyActive = _this$props2.hasMulticurrencyActive,
        effectiveCurrencyCode = _this$props2.effectiveCurrencyCode,
        userEmail = _this$props2.userEmail,
        multicurrencies = _this$props2.multicurrencies,
        defaultCurrencyCode = _this$props2.defaultCurrencyCode;
    var _this$state = this.state,
        valueOptions = _this$state.valueOptions,
        selectedLineItems = _this$state.selectedLineItems; // if user clicks on the Load more button, skip this function

    if (!selectedOption.record) {
      return;
    } // if we have set values for all line items, allow adding more


    if (index === selectedLineItems.size) {
      this.setState({
        hideAddLineItem: false
      });
    } // keep track of selected option to show the product name in the
    // select without having to fetch it again


    var updatedValueOptions = valueOptions.set(index, selectedOption);
    this.setState({
      valueOptions: updatedValueOptions
    });
    var formattedLineItem = convertProductToLineItem(ProductRecord(selectedOption.record.referencedObject), hasMulticurrencyActive ? effectiveCurrencyCode : null, userEmail, multicurrencies, defaultCurrencyCode);
    var formattedLineItems = selectedLineItems.set(index, formattedLineItem);
    this.updateLineItemsAndTotal(formattedLineItems);
  },
  handleDeleteLineItem: function handleDeleteLineItem(index) {
    var _this$state2 = this.state,
        selectedLineItems = _this$state2.selectedLineItems,
        valueOptions = _this$state2.valueOptions;
    var lineItemsAfterDelete = selectedLineItems.delete(index);
    this.setState({
      // if we deleted the last item, hide "Add line item" button and show empty row
      hideAddLineItem: lineItemsAfterDelete.size === 0,
      valueOptions: valueOptions.delete(index)
    });
    this.updateLineItemsAndTotal(lineItemsAfterDelete);
  },
  handleAddLineItemSelect: function handleAddLineItemSelect() {
    this.setState({
      hideAddLineItem: true
    });
  },
  getPriceForEffectiveCurrency: function getPriceForEffectiveCurrency(option) {
    var effectiveCurrencyCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.effectiveCurrencyCode;
    var hasMulticurrencyActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.hasMulticurrencyActive;

    if (!option.record) {
      return null;
    }

    var propertyName = hasMulticurrencyActive ? getCurrencyPriceProperty(effectiveCurrencyCode) : 'price';
    return option.record.getIn(['referencedObject', 'properties', propertyName, 'value']);
  },
  renderProductsValue: function renderProductsValue(option) {
    return /*#__PURE__*/_jsx("span", {
      children: option.text || option.dropdownText
    });
  },
  renderProductsItemComponent: function renderProductsItemComponent(_ref3) {
    var children = _ref3.children,
        option = _ref3.option;
    var effectiveCurrencyCode = this.props.effectiveCurrencyCode;
    var currencyPrice = this.getPriceForEffectiveCurrency(option);
    var currencyLabel = null;

    if (option.record) {
      currencyLabel = currencyPrice ? /*#__PURE__*/_jsx(FormattedPrice, {
        currencyCode: effectiveCurrencyCode,
        price: currencyPrice,
        frequency: option.record.getIn(['referencedObject', 'properties', RECURRING_BILLING_FREQUENCY, 'value'])
      }) : /*#__PURE__*/_jsx(UIStatusTag, {
        use: "warning",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "createDealModal.lineItemsField.missingCurrency"
        })
      });
    }

    return /*#__PURE__*/_jsxs(UIMedia, {
      align: "baseline",
      className: "p-right-6",
      children: [/*#__PURE__*/_jsx(UIMediaBody, {
        children: children
      }), /*#__PURE__*/_jsx(UIMediaRight, {
        children: currencyLabel
      })]
    });
  },
  renderProductsLibraryCta: function renderProductsLibraryCta() {
    return /*#__PURE__*/_jsx(UILink, {
      href: links.productsLibrary(),
      external: true,
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "createDealModal.lineItemsField.manageLibrary"
      })
    });
  },
  renderDeleteIcon: function renderDeleteIcon(index) {
    var handleDeleteLineItem = this.partial(this.handleDeleteLineItem, index);
    var hovered = this.state.hoveredRow === index;
    var visibility = hovered ? 'visible' : 'hidden';
    return /*#__PURE__*/_jsx(UIIcon, {
      className: "pointer",
      style: {
        visibility: visibility
      },
      onClick: handleDeleteLineItem,
      name: "delete",
      color: CALYPSO,
      size: 12
    });
  },
  renderLineItemRow: function renderLineItemRow(lineItem, index) {
    var selectedOption = this.state.valueOptions.get(index);
    var effectiveCurrencyCode = this.props.effectiveCurrencyCode;
    var handleSelectFromProductLibrary = this.partial(this.handleSelectFromProductLibrary, index);
    var handleQuantityChange = this.partial(this.handleQuantityChange, index);
    var handleHover = this.partial(this.handleHoverRow, index);
    var quantity = lineItem ? getLineItemProperties(lineItem, QUANTITY) : null;
    var value = selectedOption ? selectedOption.value : null;
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      className: "m-bottom-2",
      onMouseOver: handleHover,
      onMouseLeave: this.handleStopHovering,
      children: [/*#__PURE__*/_jsx("div", {
        className: "m-right-4",
        style: {
          width: 362
        },
        children: /*#__PURE__*/_jsx(ProductSelect, {
          anchorType: "button",
          "data-test-id": "add-line-item-select",
          searchCount: 20,
          value: value,
          currencyCode: effectiveCurrencyCode,
          getPriceForEffectiveCurrency: this.getPriceForEffectiveCurrency,
          hasUsedSync: this.hasUsedSync(),
          itemComponent: this.renderProductsItemComponent,
          valueRenderer: this.renderProductsValue,
          onSelectedOptionChange: handleSelectFromProductLibrary,
          placeholder: I18n.text('createDealModal.lineItemsField.placeholder'),
          dropdownFooter: this.renderProductsLibraryCta(),
          placement: "top"
        })
      }), /*#__PURE__*/_jsx(UINumberInput, {
        className: "m-right-4",
        disabled: !lineItem,
        style: {
          width: 70
        },
        value: quantity,
        min: 1,
        max: MAX_INT,
        onChange: handleQuantityChange
      }), this.renderDeleteIcon(index)]
    }, index);
  },
  renderAddLineItem: function renderAddLineItem() {
    if (this.state.hideAddLineItem) {
      return null;
    }

    return /*#__PURE__*/_jsxs(UIButton, {
      use: "link",
      onClick: this.handleAddLineItemSelect,
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "add",
        size: 12
      }), /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "createDealModal.lineItemsField.addLineItem"
      })]
    });
  },
  renderLineItems: function renderLineItems() {
    var _this$state3 = this.state,
        hideAddLineItem = _this$state3.hideAddLineItem,
        selectedLineItems = _this$state3.selectedLineItems;
    var allLineItemRows = hideAddLineItem ? selectedLineItems.push(null) : selectedLineItems;
    return /*#__PURE__*/_jsx("div", {
      children: allLineItemRows.map(this.renderLineItemRow)
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(UIMediaObject, {
          style: {
            width: 440
          },
          itemRight: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "crm_components.GenericModal.quantity"
          }),
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "createDealModal.lineItemsField.addLineItem"
          })
        }),
        children: this.renderLineItems()
      }), this.renderAddLineItem()]
    });
  }
});
var deps = {
  userEmail: {
    stores: [UserStore],
    deref: function deref() {
      return UserStore.get('email');
    }
  }
};
export default connect(deps)(LineItemsInputFormComponent);