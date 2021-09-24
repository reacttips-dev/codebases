'use es6';

import PropTypes from 'prop-types';
var PromptablePropInterface = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default PromptablePropInterface;