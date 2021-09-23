'use es6';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModalAction, closeModalAction } from '../actions/overlayActions';
import { getModalType } from '../selectors/overlaySelectors';
import { BULK_DELETE_MODAL, BULK_EDIT_MODAL, CLONE_VIEW_MODAL, CREATE_VIEW_MODAL, EDIT_COLUMNS_MODAL, EXPORT_VIEW_MODAL, MANAGE_VIEW_SHARING_MODAL, RENAME_VIEW_MODAL, DELETE_VIEW_MODAL, BOARD_SORT_MODAL, EDIT_STAGE_PROPERTIES_MODAL } from '../constants/modalTypes';
import { trackOpenEditColumnsModal } from '../../../crm_ui/tracking/indexPageTracking';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
export var useModalActions = function useModalActions() {
  var dispatch = useDispatch();
  var modalType = useSelector(getModalType);
  var objectTypeDef = useSelectedObjectTypeDef();
  var openModal = useCallback(function (type, data) {
    return dispatch(openModalAction(type, data));
  }, [dispatch]);
  var closeModal = useCallback(function () {
    return dispatch(closeModalAction());
  }, [dispatch]);
  var openEditColumnsModal = useCallback(function () {
    if (modalType !== EDIT_COLUMNS_MODAL) {
      trackOpenEditColumnsModal(objectTypeDef);
    }

    openModal(EDIT_COLUMNS_MODAL);
  }, [objectTypeDef, openModal, modalType]);
  var openViewExportModal = useCallback(function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        viewId = _ref.viewId,
        _ref$isModified = _ref.isModified,
        isModified = _ref$isModified === void 0 ? false : _ref$isModified,
        exportPageType = _ref.exportPageType;

    return openModal(EXPORT_VIEW_MODAL, {
      viewId: viewId,
      isModified: isModified,
      exportPageType: exportPageType
    });
  }, [openModal]);
  var openRenameViewModal = useCallback(function (viewId) {
    return openModal(RENAME_VIEW_MODAL, {
      viewId: viewId
    });
  }, [openModal]);
  var openDeleteViewModal = useCallback(function (viewId) {
    return openModal(DELETE_VIEW_MODAL, {
      viewId: viewId
    });
  }, [openModal]);
  var openCloneViewModal = useCallback(function (viewId) {
    return openModal(CLONE_VIEW_MODAL, {
      viewId: viewId
    });
  }, [openModal]);
  var openCreateViewModal = useCallback(function (viewIdToClone) {
    return openModal(CREATE_VIEW_MODAL, {
      viewIdToClone: viewIdToClone
    });
  }, [openModal]);
  var openManageViewSharingModal = useCallback(function (viewId) {
    return openModal(MANAGE_VIEW_SHARING_MODAL, {
      viewId: viewId
    });
  }, [openModal]);
  var openBulkDeleteModal = useCallback(function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        selection = _ref2.selection,
        onConfirm = _ref2.onConfirm,
        isSelectingEntireQuery = _ref2.isSelectingEntireQuery;

    return openModal(BULK_DELETE_MODAL, {
      selection: selection,
      onConfirm: onConfirm,
      isSelectingEntireQuery: isSelectingEntireQuery
    });
  }, [openModal]);
  var openBulkEditModal = useCallback(function (_ref3) {
    var selection = _ref3.selection,
        onConfirm = _ref3.onConfirm,
        isSelectingEntireQuery = _ref3.isSelectingEntireQuery;
    return openModal(BULK_EDIT_MODAL, {
      selection: selection,
      onConfirm: onConfirm,
      isSelectingEntireQuery: isSelectingEntireQuery
    });
  }, [openModal]);
  var openBoardSortModal = useCallback(function () {
    return openModal(BOARD_SORT_MODAL);
  }, [openModal]);
  var openEditStagePropertiesModal = useCallback(function (_ref4) {
    var objectTypeId = _ref4.objectTypeId,
        objectId = _ref4.objectId,
        stageId = _ref4.stageId;
    return openModal(EDIT_STAGE_PROPERTIES_MODAL, {
      objectTypeId: objectTypeId,
      objectId: objectId,
      stageId: stageId
    });
  }, [openModal]);
  return {
    openEditColumnsModal: openEditColumnsModal,
    openBulkDeleteModal: openBulkDeleteModal,
    openViewExportModal: openViewExportModal,
    openRenameViewModal: openRenameViewModal,
    openDeleteViewModal: openDeleteViewModal,
    openCloneViewModal: openCloneViewModal,
    openCreateViewModal: openCreateViewModal,
    openManageViewSharingModal: openManageViewSharingModal,
    openBulkEditModal: openBulkEditModal,
    openBoardSortModal: openBoardSortModal,
    openEditStagePropertiesModal: openEditStagePropertiesModal,
    closeModal: closeModal
  };
};