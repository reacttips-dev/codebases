'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as GridProperties from 'crm_data/properties/GridProperties';
import * as LoadingStatus from 'crm_data/flux/LoadingStatus';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import { AccessLevelContext, getAccessLevelWithCaching } from 'customer-data-properties/accessLevel/AccessLevelContext';
import { HIDDEN_REST } from 'customer-data-properties/constants/FieldLevelPermissionTypes';
import { connect } from 'general-store';
import { Map as ImmutableMap } from 'immutable';
import CustomPropertyHelper from '../../../crm_ui/utils/CustomPropertyHelper';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import H2 from 'UIComponents/elements/headings/H2';
import I18n from 'I18n';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import PropertyGroupsStore from 'crm_data/properties/PropertyGroupsStore';
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import ScopesContainer from '../../../containers/ScopesContainer';
import sortBy from 'transmute/sortBy';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIForm from 'UIComponents/form/UIForm';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIModal from 'UIComponents/dialog/UIModal';
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
export var BoardSortModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(BoardSortModal, _PureComponent);

  function BoardSortModal(props) {
    var _this;

    _classCallCheck(this, BoardSortModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BoardSortModal).call(this, props));
    _this.state = {
      sortDirection: props.initialSortDirection || 1,
      sortKey: props.initialSortKey || 'createdate'
    };
    _this.handleConfirm = _this.handleConfirm.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BoardSortModal, [{
    key: "getOrderTypeKey",
    value: function getOrderTypeKey(direction, objectType, property) {
      var _typeKeyLookup;

      var defaultTypeKey = 'default';
      var typeKeyLookup = (_typeKeyLookup = {}, _defineProperty(_typeKeyLookup, PropertyTypes.BOOLEAN, 'default'), _defineProperty(_typeKeyLookup, PropertyTypes.DATE, 'time'), _defineProperty(_typeKeyLookup, PropertyTypes.DATE_TIME, 'time'), _defineProperty(_typeKeyLookup, PropertyTypes.ENUMERATION, 'text'), _defineProperty(_typeKeyLookup, PropertyTypes.NUMBER, 'number'), _defineProperty(_typeKeyLookup, PropertyTypes.STRING, 'text'), _typeKeyLookup);
      var type = property && property.get('type');
      var customSortProperties = property && CustomPropertyHelper.get(objectType, property.get('name'));
      var typeKey = defaultTypeKey;

      if (type) {
        typeKey = typeKeyLookup[type];
      }

      if (customSortProperties && customSortProperties.has('sortType')) {
        typeKey = customSortProperties.get('sortType');
      }

      return direction > 0 ? "pipelineBoardSortModal.orderDesc." + typeKey : "pipelineBoardSortModal.orderAsc." + typeKey;
    }
  }, {
    key: "handleConfirm",
    value: function handleConfirm() {
      var _this$props = this.props,
          objectType = _this$props.objectType,
          onConfirm = _this$props.onConfirm,
          properties = _this$props.properties;
      var _this$state = this.state,
          sortDirection = _this$state.sortDirection,
          sortKey = _this$state.sortKey;
      var selectedProperty = properties.get(sortKey);
      var opts = {
        direction: sortDirection,
        orderText: I18n.text(this.getOrderTypeKey(sortDirection, objectType, selectedProperty)),
        propertyLabel: selectedProperty.get('label'),
        sortColumnName: sortKey,
        sortKey: sortKey
      };
      onConfirm(SyntheticEvent(opts));
    }
  }, {
    key: "renderForm",
    value: function renderForm(accessLevelContext) {
      var _this2 = this;

      var _this$props2 = this.props,
          objectType = _this$props2.objectType,
          properties = _this$props2.properties,
          visiblePropertiesByGroup = _this$props2.visiblePropertiesByGroup;
      var _this$state2 = this.state,
          sortDirection = _this$state2.sortDirection,
          sortKey = _this$state2.sortKey;
      var selectedProperty = properties.get(sortKey);

      var getDisplayOrder = function getDisplayOrder(propertyGroupRecord) {
        return propertyGroupRecord && propertyGroupRecord.get('displayOrder') || 0;
      };

      var transformToOption = function transformToOption(_ref) {
        var hubspotDefined = _ref.hubspotDefined,
            label = _ref.label,
            name = _ref.name,
            type = _ref.type;
        return {
          text: hubspotDefined ? propertyLabelTranslator(label) : label,
          value: name,
          type: type,
          disabled: getAccessLevelWithCaching({
            context: accessLevelContext,
            objectType: objectType,
            propertyName: name
          }) === HIDDEN_REST
        };
      };

      var defaultOptions = selectedProperty ? [transformToOption(selectedProperty)] : [];
      var options = visiblePropertiesByGroup.size > 0 && properties.size > 0 && sortBy(getDisplayOrder, visiblePropertiesByGroup).reduce(function (acc, propertyGroupRecord) {
        var displayName = propertyGroupRecord.get('displayName');
        var translatedDisplayName = propertyGroupRecord.get('hubspotDefined') ? propertyLabelTranslator(displayName) : displayName;
        var option = {
          text: translatedDisplayName || propertyGroupRecord.get('name') || ' ',
          options: propertyGroupRecord.get('properties').toArray().map(transformToOption)
        };
        return acc.concat([option]);
      }, []);

      var CustomItem = function CustomItem(_ref2) {
        var children = _ref2.children,
            option = _ref2.option,
            rest = _objectWithoutProperties(_ref2, ["children", "option"]);

        return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
          children: /*#__PURE__*/_jsx(UITooltip, {
            disabled: !option.disabled,
            placement: "right",
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "index.board.sortModal.hiddenPriority",
              options: {
                property: option.text
              }
            }),
            children: children
          })
        }));
      };

      return /*#__PURE__*/_jsxs(UIForm, {
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          label: I18n.text('pipelineBoardSortModal.labelPriority'),
          children: /*#__PURE__*/_jsx(UISelect, {
            itemComponent: CustomItem,
            onChange: function onChange(_ref3) {
              var value = _ref3.target.value;

              _this2.setState({
                sortKey: value
              });
            },
            options: options || defaultOptions,
            value: sortKey
          })
        }), /*#__PURE__*/_jsx(UIFormControl, {
          label: I18n.text('pipelineBoardSortModal.labelSortBy'),
          children: /*#__PURE__*/_jsx(UISelect, {
            onChange: function onChange(_ref4) {
              var value = _ref4.target.value;

              _this2.setState({
                sortDirection: value
              });
            },
            options: [{
              text: I18n.text(this.getOrderTypeKey(-1, objectType, selectedProperty)),
              value: -1
            }, {
              text: I18n.text(this.getOrderTypeKey(1, objectType, selectedProperty)),
              value: 1
            }],
            value: sortDirection
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props3 = this.props,
          onReject = _this$props3.onReject,
          objectType = _this$props3.objectType;
      var headerMessage = [DEAL, TICKET].includes(objectType) ? "pipelineBoardSortModal.title." + objectType : 'pipelineBoardSortModal.title.record';
      return /*#__PURE__*/_jsx(AccessLevelContext.Consumer, {
        children: function children(accessLevelContext) {
          return /*#__PURE__*/_jsxs(UIModal, {
            children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
              children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
                onClick: onReject
              }), /*#__PURE__*/_jsx(H2, {
                children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                  message: headerMessage
                })
              })]
            }), /*#__PURE__*/_jsx(UIDialogBody, {
              children: _this3.renderForm(accessLevelContext)
            }), /*#__PURE__*/_jsxs(UIDialogFooter, {
              children: [/*#__PURE__*/_jsx(UIButton, {
                onClick: _this3.handleConfirm,
                type: "submit",
                use: "primary",
                children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                  message: "pipelineBoardSortModal.actionConfirm"
                })
              }), /*#__PURE__*/_jsx(UIButton, {
                onClick: onReject,
                children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                  message: "pipelineBoardSortModal.actionReject"
                })
              })]
            })]
          });
        }
      });
    }
  }]);

  return BoardSortModal;
}(PureComponent);
BoardSortModal.propTypes = {
  initialSortDirection: PropTypes.number,
  initialSortKey: PropTypes.string,
  objectType: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  properties: ImmutablePropTypes.map.isRequired,
  visiblePropertiesByGroup: ImmutablePropTypes.map.isRequired
};
var deps = {
  properties: {
    stores: [PropertiesStore],
    deref: function deref(_ref5) {
      var objectType = _ref5.objectType;
      return PropertiesStore.get(objectType);
    }
  },
  visiblePropertiesByGroup: {
    stores: [PropertiesStore, PropertyGroupsStore],
    deref: function deref(props) {
      var objectType = props.objectType;
      var propertyGroups = PropertyGroupsStore.get(objectType);
      var properties = PropertiesStore.get(objectType);
      var scopes = ScopesContainer.get();

      var hydrate = function hydrate(propertyNameList) {
        return propertyNameList.map(function (name) {
          return properties.get(name);
        }).filter(function (property) {
          return GridProperties.isVisibleFilterProperty(scopes, property);
        });
      };

      return LoadingStatus.isLoading(propertyGroups, properties) ? ImmutableMap() : propertyGroups.map(function (group) {
        return group.update('properties', hydrate);
      });
    }
  }
};
export default connect(deps)(BoardSortModal);