'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { normalizeTypeId } from '../../../crm_ui/grid/utils/gridStateLocalStorage';
import { isLegacyObjectType } from 'customer-data-objects/types/LegacyObjectType';
import { useCallback } from 'react';
import HeaderActions from '../../../header/actions/HeaderActions';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { usePanelActions } from '../../overlay/hooks/usePanelActions';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { useLegacyPageType } from '../../views/hooks/useLegacyPageType';

var HeaderActionsWrapper = function HeaderActionsWrapper() {
  var objectType = denormalizeTypeId(useSelectedObjectTypeId());
  var viewId = String(useCurrentView().id);
  var pageType = useLegacyPageType();

  var _usePanelActions = usePanelActions(),
      openObjectBuilderPanel = _usePanelActions.openObjectBuilderPanel;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectCreated = _useCrmObjectsActions.crmObjectCreated;

  var handleLegacyCreateSuccess = useCallback(function (_ref) {
    var createdObjectType = _ref.objectType,
        objectId = _ref.objectId;
    return crmObjectCreated({
      objectTypeId: normalizeTypeId(createdObjectType),
      objectId: objectId
    });
  }, [crmObjectCreated]);
  return /*#__PURE__*/_jsx(HeaderActions, {
    objectType: objectType,
    viewId: viewId,
    pageType: pageType,
    pipelineId: null // TODO: don't need this until pipelines
    ,
    isCrmObject: !isLegacyObjectType(objectType),
    onOpenObjectBuilderPanel: openObjectBuilderPanel,
    onLegacyCreateSuccess: handleLegacyCreateSuccess
  });
};

export default HeaderActionsWrapper;