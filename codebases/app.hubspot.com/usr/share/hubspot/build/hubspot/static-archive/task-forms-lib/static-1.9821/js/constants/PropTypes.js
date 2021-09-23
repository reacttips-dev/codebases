'use es6';

import PropTypes from 'prop-types';
export var TaskFormButtonPropTypes = {
  onSave: PropTypes.func,
  onSaveAndAddAnother: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  isDeleteDisabled: PropTypes.bool,
  isSaveDisabled: PropTypes.bool,
  isCreateDisabled: PropTypes.bool,
  isSaveTooltipDisabled: PropTypes.bool,
  isDeleteTooltipDisabled: PropTypes.bool,
  saveButtonTooltipMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.string]),
  deleteButtonTooltipMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.string])
};