'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite } from 'SequencesUI/lib/permissions';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { trackViewSequencesPermissionTooltip } from '../../util/UsageTracker';

var EditSequenceTooltip = function EditSequenceTooltip(_ref) {
  var children = _ref.children,
      placement = _ref.placement,
      _ref$subscreen = _ref.subscreen,
      subscreen = _ref$subscreen === void 0 ? 'sequence-editor' : _ref$subscreen;
  var onOpenChange = useCallback(function (_ref2) {
    var open = _ref2.target.value;
    if (open) trackViewSequencesPermissionTooltip(subscreen);
  }, [subscreen]);

  if (canWrite()) {
    return children;
  }

  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.missingSequencesWriteScope.editSequence"
    }),
    placement: placement,
    onOpenChange: onOpenChange,
    children: children
  });
};

EditSequenceTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
  subscreen: PropTypes.string
};
export default EditSequenceTooltip;