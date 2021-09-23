'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { OrderedMap } from 'immutable';
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import memoize from 'transmute/memoize';
import SkeletonBox from 'conversations-skeleton-state/components/SkeletonBox';
import { getEntries } from 'conversations-async-data/indexed-async-data/operators/getters';
import { getPropertyName, getObjectType, getPhoneNumberProperties, getAdditionalProperties, getValue, getObjectId, getObjectTypeId } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { createPropertyKey } from 'calling-lifecycle-internal/callees/operators/getPropertyKeys';
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getPropertyLabel } from '../operators/getPhonePropertyLabel';
import UILink from 'UIComponents/link/UILink';
import PortalIdParser from 'PortalIdParser';
import { getRequiredCalleeProperties } from 'calling-lifecycle-internal/callees/operators/getPropertyKeys';
import { getIsEditing, UpdateTypePropType } from '../../callees/operators/updatePropertyTypes';
import { getFormattedName } from '../../callee-properties/operators/propertyValueGetters';
import PhoneNumberEditor from './PhoneNumberEditor';
import { getCustomPhoneContactProperties } from '../operators/getCustomPhoneContactProperties';
import RemovePropertyModal from './RemovePropertyModal';
import styled from 'styled-components';
import { HUBSPOT_PROPERTIES } from '../../callee-properties/clients/calleePropertiesClient';
var Remove = styled.div.withConfig({
  displayName: "UpdateCalleeNumbers__Remove",
  componentId: "l8jy1g-0"
})(["padding-top:20px;"]);
var getPropertyOptions = memoize(function (phoneNumberProperties) {
  if (!phoneNumberProperties) {
    return [];
  }

  return phoneNumberProperties.reduce(function (acc, phoneNumberProperty) {
    var propertyName = getPropertyName(phoneNumberProperty);
    var propertyLabel = getPropertyLabel(propertyName, phoneNumberProperty);

    if (getValue(phoneNumberProperty)) {
      return acc;
    }

    acc.push({
      text: propertyLabel || propertyName,
      value: propertyName
    });
    return acc;
  }, []);
});
var getSelectedPropertyLabel = memoize(function (selectedObject, selectedPropertyName) {
  if (!selectedObject) {
    return '';
  }

  var phoneNumberProperties = getPhoneNumberProperties(selectedObject);
  var property = phoneNumberProperties.find(function (phoneNumberProperty) {
    return getPropertyName(phoneNumberProperty) === selectedPropertyName;
  }, []);
  return property && getPropertyLabel(selectedPropertyName, property);
});

var UpdateCalleeNumbers = /*#__PURE__*/function (_PureComponent) {
  _inherits(UpdateCalleeNumbers, _PureComponent);

  function UpdateCalleeNumbers() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UpdateCalleeNumbers);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UpdateCalleeNumbers)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      prevSelectedObject: null,
      propertyOptions: null,
      customPhoneNumberProperties: null,
      showModal: false
    };
    _this.getPropertyOption = memoize(function (selectedPropertyName, selectedObject) {
      if (!selectedPropertyName) {
        return null;
      }

      var phoneNumberProperties = getPhoneNumberProperties(selectedObject);
      var phoneNumberProperty = phoneNumberProperties.find(function (property) {
        return getPropertyName(property) === selectedPropertyName;
      }); // custom property

      if (!phoneNumberProperty) {
        var customProperties = _this.state.customPhoneNumberProperties;
        phoneNumberProperty = customProperties && customProperties.find(function (property) {
          return getPropertyName(property) === selectedPropertyName;
        });
      }

      return phoneNumberProperty;
    });

    _this.handlePropertySelection = function (_ref) {
      var value = _ref.target.value;
      var onPropertyChange = _this.props.onPropertyChange;
      onPropertyChange(value);
    };

    _this.handleConfirm = function () {
      var _this$props = _this.props,
          selectedPropertyName = _this$props.selectedPropertyName,
          removeProperty = _this$props.removeProperty;

      _this.setState({
        showModal: false
      });

      removeProperty(selectedPropertyName);
    };

    _this.handleReject = function () {
      _this.setState({
        showModal: false
      });
    };

    return _this;
  }

  _createClass(UpdateCalleeNumbers, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateCalleeProperties();
      this.getCustomProperties();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.selectedObject !== this.props.selectedObject) {
        this.updateCalleeProperties();
        this.getCustomProperties();
        this.setState({});
      }
    }
  }, {
    key: "getCustomProperties",
    value: function getCustomProperties() {
      var _this2 = this;

      var selectedObject = this.props.selectedObject;
      var existingProperties = selectedObject && getPhoneNumberProperties(selectedObject);
      var callableObjectType = getObjectType(selectedObject);
      var isContactRecord = callableObjectType === CONTACT;

      if (!isContactRecord) {
        return;
      }

      getCustomPhoneContactProperties().then(function (properties) {
        // filter custom properties that are not being used in selected object
        var notUsedCustomProperties = properties.filter(function (property) {
          return !existingProperties || !existingProperties.has(getPropertyName(property));
        });

        _this2.setState({
          customPhoneNumberProperties: properties,
          propertyOptions: _this2.state.propertyOptions.concat(getPropertyOptions(notUsedCustomProperties))
        });
      });
    }
  }, {
    key: "updateCalleeProperties",
    value: function updateCalleeProperties() {
      var _this$props2 = this.props,
          getCalleeProperties = _this$props2.getCalleeProperties,
          calleeProperties = _this$props2.calleeProperties,
          selectedObject = _this$props2.selectedObject;

      if (!calleeProperties) {
        return;
      }

      var propertiesByCallee = getEntries(calleeProperties);
      var objectId = getObjectId(selectedObject);
      var objectTypeId = getObjectTypeId(selectedObject);
      var propertyKey = createPropertyKey({
        objectId: objectId,
        objectTypeId: objectTypeId
      });
      var requiredCalleeProperties = getRequiredCalleeProperties({
        callableObjects: OrderedMap(_defineProperty({}, propertyKey, selectedObject)),
        propertyKeySeq: propertiesByCallee.keySeq()
      });

      if (requiredCalleeProperties.keys.length > 0) {
        getCalleeProperties(requiredCalleeProperties);
      }
    }
  }, {
    key: "renderNumberEditor",
    value: function renderNumberEditor() {
      var _this$props3 = this.props,
          onNumberChange = _this$props3.onNumberChange,
          onDeleteNumber = _this$props3.onDeleteNumber,
          selectedObject = _this$props3.selectedObject,
          selectedPropertyName = _this$props3.selectedPropertyName,
          updateType = _this$props3.updateType,
          isAsyncUpdatesStarted = _this$props3.isAsyncUpdatesStarted,
          setIsValidatingNumber = _this$props3.setIsValidatingNumber,
          isValidatingNumber = _this$props3.isValidatingNumber,
          canEdit = _this$props3.canEdit;

      if (!selectedObject || !selectedPropertyName) {
        return null;
      }

      var callableNumber = this.getPropertyOption(selectedPropertyName, selectedObject);
      if (!callableNumber) return null;
      return /*#__PURE__*/_jsx(PhoneNumberEditor, {
        onNumberChange: onNumberChange,
        onDeleteNumber: onDeleteNumber,
        isEditing: getIsEditing(updateType),
        callableNumber: callableNumber,
        isAsyncUpdatesStarted: isAsyncUpdatesStarted,
        setIsValidatingNumber: setIsValidatingNumber,
        isValidatingNumber: isValidatingNumber,
        disabled: !canEdit
      });
    }
  }, {
    key: "renderAddNewPropertyFooter",
    value: function renderAddNewPropertyFooter() {
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.customPropertyHelpText"
        }),
        children: /*#__PURE__*/_jsx(UILink, {
          href: "/property-settings/" + PortalIdParser.get() + "?action=create&type=0-1",
          external: true,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "callee-selection.addCustomPhoneProperty"
          })
        })
      });
    }
  }, {
    key: "renderPropertiesOptions",
    value: function renderPropertiesOptions() {
      var _this$props4 = this.props,
          canEdit = _this$props4.canEdit,
          selectedPropertyName = _this$props4.selectedPropertyName,
          selectedObject = _this$props4.selectedObject,
          isAsyncUpdatesStarted = _this$props4.isAsyncUpdatesStarted;
      var propertyOptions = this.state.propertyOptions;
      var callableObjectType = getObjectType(selectedObject);
      var isCompanyRecord = callableObjectType === COMPANY;
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.phoneNumbers.cannotEditProperty"
        }),
        placement: "bottom",
        disabled: canEdit,
        children: /*#__PURE__*/_jsx(UIFormControl, {
          children: /*#__PURE__*/_jsx(UISelect, {
            className: "m-y-2",
            align: "right",
            "data-selenium-test": "property-select",
            onChange: this.handlePropertySelection,
            disabled: isAsyncUpdatesStarted || !canEdit,
            options: propertyOptions,
            value: selectedPropertyName,
            placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "callee-selection.selectProperty"
            }),
            dropdownFooter: !isCompanyRecord && this.renderAddNewPropertyFooter()
          })
        })
      });
    }
  }, {
    key: "renderRemoveProperty",
    value: function renderRemoveProperty() {
      var _this3 = this;

      var _this$props5 = this.props,
          selectedObject = _this$props5.selectedObject,
          selectedPropertyName = _this$props5.selectedPropertyName,
          canEdit = _this$props5.canEdit;
      var propertyOptions = this.state.propertyOptions;
      var isEditing = getIsEditing(this.props.updateType);

      if (!selectedObject || !selectedPropertyName) {
        return null;
      }

      var isCustomProperty = !HUBSPOT_PROPERTIES.includes(selectedPropertyName);
      var isPropertyExists = selectedObject && getPhoneNumberProperties(selectedObject).has(selectedPropertyName);

      if (!isCustomProperty || !isPropertyExists) {
        return null;
      }

      var selectedOptionLabel;

      if (isEditing) {
        selectedOptionLabel = getSelectedPropertyLabel(selectedObject, selectedPropertyName);
      } else {
        var propertyOption = propertyOptions.find(function (property) {
          return property.value === selectedPropertyName;
        });
        selectedOptionLabel = propertyOption && propertyOption.text;
      }

      return /*#__PURE__*/_jsxs(Remove, {
        children: [/*#__PURE__*/_jsx(UILink, {
          disabled: !canEdit,
          onClick: function onClick() {
            return _this3.setState({
              showModal: true
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "callee-selection.removeProperty"
          })
        }), this.state.showModal && /*#__PURE__*/_jsx(RemovePropertyModal, {
          onConfirm: this.handleConfirm,
          onReject: this.handleReject,
          propertyToRemove: selectedOptionLabel
        })]
      });
    }
  }, {
    key: "renderPermissionsError",
    value: function renderPermissionsError() {
      return /*#__PURE__*/_jsx("small", {
        className: "is--text--error",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.editPermissionsError"
        })
      });
    }
  }, {
    key: "renderPropertyOptions",
    value: function renderPropertyOptions() {
      var isEditing = getIsEditing(this.props.updateType);
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [!isEditing && this.renderPropertiesOptions(), this.renderNumberEditor(), this.renderRemoveProperty()]
      });
    }
  }, {
    key: "renderHeading",
    value: function renderHeading() {
      var updateType = this.props.updateType;
      var headingKey = getIsEditing(updateType) ? 'editNumber' : 'addNewNumber';
      return /*#__PURE__*/_jsx("div", {
        className: "is--heading-5",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callee-selection.phoneNumbers." + headingKey
        })
      });
    }
  }, {
    key: "renderCalleeSelect",
    value: function renderCalleeSelect() {
      var _this$props6 = this.props,
          selectedObject = _this$props6.selectedObject,
          updateType = _this$props6.updateType,
          selectedPropertyName = _this$props6.selectedPropertyName;

      if (getIsEditing(updateType)) {
        var selectedOptionLabel = getSelectedPropertyLabel(selectedObject, selectedPropertyName);
        return /*#__PURE__*/_jsx("strong", {
          className: "display-block m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "callee-selection.phoneNumbers.addPropertyModal.nameAndProperty",
            options: {
              propertyName: selectedOptionLabel,
              formattedName: getFormattedName(getAdditionalProperties(selectedObject))
            }
          })
        });
      }

      return /*#__PURE__*/_jsx("strong", {
        children: getFormattedName(getAdditionalProperties(selectedObject))
      });
    }
  }, {
    key: "render",
    value: function render() {
      var isPermissionsLoading = this.props.isPermissionsLoading;
      var className = 'p-top-4 p-x-2';

      if (isPermissionsLoading) {
        return /*#__PURE__*/_jsxs("div", {
          className: className,
          children: [this.renderHeading(), /*#__PURE__*/_jsx(SkeletonBox, {
            height: 16,
            width: 100
          }), /*#__PURE__*/_jsx(SkeletonBox, {
            height: 41,
            className: "width-100 m-top-3"
          })]
        });
      }

      return /*#__PURE__*/_jsxs("div", {
        className: className,
        children: [this.renderHeading(), this.renderCalleeSelect(), this.renderPropertyOptions()]
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var selectedObject = props.selectedObject;
      var prevSelectedObject = state.prevSelectedObject;

      if (selectedObject !== prevSelectedObject) {
        var properties = selectedObject && getPhoneNumberProperties(selectedObject);
        state.propertyOptions = selectedObject && getPropertyOptions(properties);
        state.prevSelectedObject = selectedObject;
      }

      return state;
    }
  }]);

  return UpdateCalleeNumbers;
}(PureComponent);

UpdateCalleeNumbers.propTypes = {
  onNumberChange: PropTypes.func.isRequired,
  onPropertyChange: PropTypes.func.isRequired,
  onDeleteNumber: PropTypes.func.isRequired,
  selectedObject: RecordPropType('CallableObject'),
  selectedPropertyName: PropTypes.string,
  getCalleeProperties: PropTypes.func.isRequired,
  calleeProperties: RecordPropType('IndexedAsyncData'),
  updateType: UpdateTypePropType,
  isAsyncUpdatesStarted: PropTypes.bool.isRequired,
  setIsValidatingNumber: PropTypes.func.isRequired,
  isValidatingNumber: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
  isPermissionsLoading: PropTypes.bool.isRequired,
  removeProperty: PropTypes.func.isRequired
};
UpdateCalleeNumbers.defaultProps = {
  onNumberChange: function onNumberChange() {}
};
export { UpdateCalleeNumbers as default };