'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import UniversalPreviewSidebarAsync from '../../../previewSidebar/UniversalPreviewSidebarAsync';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { _tracker } from 'customer-data-tracking/tracker';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { useAuthAsJS } from '../../auth/hooks/useAuthAsJS';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { normalizeTypeId } from '../../../utils/normalizeTypeId';
import { Map as ImmutableMap } from 'immutable';
import { usePanelActions } from '../../overlay/hooks/usePanelActions';
import { usePanelData } from '../../overlay/hooks/usePanelData';
import { CALL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import TranscriptSidebar from 'transcript-sidebar/components/TranscriptSidebar';

var PreviewSidebarWrapper = function PreviewSidebarWrapper() {
  var objectTypeId = useSelectedObjectTypeId();

  var _usePanelData = usePanelData(),
      objectId = _usePanelData.objectId;

  var auth = useAuthAsJS();

  var _usePanelActions = usePanelActions(),
      closePanel = _usePanelActions.closePanel;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      crmObjectCreated = _useCrmObjectsActions.crmObjectCreated,
      crmObjectsUpdated = _useCrmObjectsActions.crmObjectsUpdated,
      crmObjectsDeleted = _useCrmObjectsActions.crmObjectsDeleted;

  var handleCreate = useCallback(function (_ref) {
    var createdObjectId = _ref.objectId,
        associationType = _ref.associationType;
    return crmObjectCreated({
      objectTypeId: normalizeTypeId(associationType),
      objectId: Number(createdObjectId)
    });
  }, [crmObjectCreated]);
  var handleUpdate = useCallback(function (_ref2) {
    var objectType = _ref2.objectType,
        updatedObjectId = _ref2.objectId,
        _ref2$properties = _ref2.properties,
        properties = _ref2$properties === void 0 ? ImmutableMap() : _ref2$properties;
    crmObjectsUpdated({
      objectTypeId: normalizeTypeId(objectType),
      objectIds: [Number(updatedObjectId)],
      propertyValues: properties.map(function (value, key) {
        return {
          name: key,
          value: value
        };
      }).toArray()
    });
  }, [crmObjectsUpdated]);
  var handleDelete = useCallback(function (_ref3) {
    var deletedObjectTypeId = _ref3.objectTypeId,
        deletedObjectId = _ref3.objectId;
    return crmObjectsDeleted({
      objectTypeId: normalizeTypeId(deletedObjectTypeId),
      objectIds: [Number(deletedObjectId)]
    });
  }, [crmObjectsDeleted]);

  if (objectTypeId === CALL_TYPE_ID) {
    return /*#__PURE__*/_jsx(TranscriptSidebar, {
      engagementId: objectId,
      onCloseSidebar: closePanel
    });
  }

  return /*#__PURE__*/_jsx(UniversalPreviewSidebarAsync, {
    objectType: denormalizeTypeId(objectTypeId),
    subjectId: String(objectId),
    tracker: _tracker,
    auth: auth,
    onCloseSidebar: closePanel,
    onObjectCreate: handleCreate,
    onObjectUpdate: handleUpdate,
    onObjectDelete: handleDelete
  });
};

export default PreviewSidebarWrapper;