'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import transformBatchMutateProperties from '../../../../config/transformBatchMutateProperties';
import BulkActionButton from './BulkActionButton';
import { edit } from '../../../permissions/bulkActionPermissions';
import { getObjectTypeLabel } from '../../../utils/BulkActionPropsRecord';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import BulkEditPrompt from '../../../../prompts/grid/BulkEditPrompt';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import { connect } from 'general-store';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import get from 'transmute/get';
export var BulkAddGDPRLawfulBasisToProcessButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(BulkAddGDPRLawfulBasisToProcessButton, _PureComponent);

  function BulkAddGDPRLawfulBasisToProcessButton() {
    var _this;

    _classCallCheck(this, BulkAddGDPRLawfulBasisToProcessButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BulkAddGDPRLawfulBasisToProcessButton).call(this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BulkAddGDPRLawfulBasisToProcessButton, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          _this$props$Prompt = _this$props.Prompt,
          Prompt = _this$props$Prompt === void 0 ? BulkEditPrompt : _this$props$Prompt,
          bulkActionProps = _this$props.bulkActionProps,
          options = _this$props.options;
      var propertyOptions = transformBatchMutateProperties.selectedProperties(this.props.properties, bulkActionProps.get('objectType'));
      var property = propertyOptions.get('hs_legal_basis');
      Prompt({
        bulkActionProps: bulkActionProps,
        preSelectedProperty: property,
        isIKEA: get('isIKEA', options)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          options = _this$props2.options,
          bulkActionProps = _this$props2.bulkActionProps;
      var canBulkEditAll = bulkActionProps.get('canBulkEditAll');
      var objectTypeLabel = getObjectTypeLabel(bulkActionProps);
      var objectType = bulkActionProps.get('objectType');

      var _edit = edit({
        canBulkEditAll: canBulkEditAll,
        objectTypeLabel: objectTypeLabel,
        objectType: objectType
      }),
          disabled = _edit.disabled,
          disabledTooltip = _edit.disabledTooltip;

      return /*#__PURE__*/_jsx(BulkActionButton, {
        "data-selenium-test": "bulk-add-gdpr-lawful-basis",
        disabled: disabled,
        disabledTooltip: disabledTooltip,
        icon: "add",
        onClick: this.handleClick,
        options: options,
        title: /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.gdprAddLawfulBasis"
        })
      });
    }
  }]);

  return BulkAddGDPRLawfulBasisToProcessButton;
}(PureComponent);
BulkAddGDPRLawfulBasisToProcessButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object,
  Prompt: PropTypes.func,
  properties: ImmutablePropTypes.map
};
export default connect({
  properties: {
    stores: [PropertiesStore],
    deref: function deref(_ref) {
      var bulkActionProps = _ref.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');
      return PropertiesStore.get(objectType) || null;
    }
  }
})(BulkAddGDPRLawfulBasisToProcessButton);