import PropTypes from 'prop-types';
import { upgradeDataPropsInterface } from 'ui-addon-upgrades/_core/common/data/upgradeData/interfaces/upgradeDataPropsInterface';
export var ContactSalesButtonPropsInterface = Object.assign({}, upgradeDataPropsInterface, {
  additionalUnitQuantity: PropTypes.number,
  allowModal: PropTypes.bool,
  isAssignable: PropTypes.bool,
  termId: PropTypes.number,
  use: PropTypes.string,
  _textOverride: PropTypes.node,
  onClick: PropTypes.func,
  onCancel: PropTypes.func,
  _overrideCommunicationMethodKey: PropTypes.string,
  _buttonOverride: PropTypes.node,
  _overrideModalHeaderText: PropTypes.node
});