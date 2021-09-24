'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { EditCardsPanel } from '../../../board/editCardsPanel/components/EditCardsPanel';
import { usePanelActions } from '../hooks/usePanelActions';

var EditCardsPanelWrapper = function EditCardsPanelWrapper() {
  var _usePanelActions = usePanelActions(),
      closePanel = _usePanelActions.closePanel;

  return /*#__PURE__*/_jsx(EditCardsPanel, {
    onClose: closePanel
  });
};

export default EditCardsPanelWrapper;