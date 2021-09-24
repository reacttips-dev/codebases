'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { EDIT_COLUMNS_MODAL, EXPORT_VIEW_MODAL, RENAME_VIEW_MODAL, BULK_DELETE_MODAL, MANAGE_VIEW_SHARING_MODAL, BULK_EDIT_MODAL, DELETE_VIEW_MODAL, CLONE_VIEW_MODAL, CREATE_VIEW_MODAL, BOARD_SORT_MODAL, EDIT_STAGE_PROPERTIES_MODAL } from '../constants/modalTypes';
import { FILTER_PANEL, PREVIEW_PANEL, OBJECT_BUILDER_PANEL, EDIT_CARDS_PANEL } from '../constants/panelTypes';
import { NONE } from '../constants/none';
import { getModalType, getPanelType } from '../selectors/overlaySelectors';
import FilterSidebar from '../../filters/components/FilterSidebar';
import ObjectBuilderWrapper from './ObjectBuilderWrapper';
import EditColumnsModalContainer from './EditColumnsModalContainer';
import ViewExportDialogWrapper from '../../views/components/ViewExportDialogWrapper';
import RenameViewModal from '../../views/components/RenameViewModal';
import ManageViewSharingModal from '../../views/components/ManageViewSharingModal';
import BulkDeleteModal from '../../crmObjects/components/BulkDeleteModal';
import PreviewSidebarWrapper from '../../crmObjects/components/PreviewSidebarWrapper';
import BulkEditModal from '../../crmObjects/components/BulkEditModal';
import DeleteViewModal from '../../views/components/DeleteViewModal';
import CloneViewModal from '../../views/components/CloneViewModal';
import CreateViewModal from '../../views/components/CreateViewModal';
import EditCardsPanelWrapper from './EditCardsPanelWrapper';
import BoardSortModalWrapper from '../../boardSort/components/BoardSortModalWrapper';
import EditStagePropertiesModalWrapper from './EditStagePropertiesModalWrapper';

var Empty = function Empty() {
  return null;
};

var OverlayContainer = function OverlayContainer() {
  var openModalType = useSelector(getModalType);
  var Modal = useMemo(function () {
    switch (openModalType) {
      case EDIT_COLUMNS_MODAL:
        return EditColumnsModalContainer;

      case EXPORT_VIEW_MODAL:
        return ViewExportDialogWrapper;

      case RENAME_VIEW_MODAL:
        return RenameViewModal;

      case MANAGE_VIEW_SHARING_MODAL:
        return ManageViewSharingModal;

      case DELETE_VIEW_MODAL:
        return DeleteViewModal;

      case CLONE_VIEW_MODAL:
        return CloneViewModal;

      case CREATE_VIEW_MODAL:
        return CreateViewModal;

      case BULK_DELETE_MODAL:
        return BulkDeleteModal;

      case BULK_EDIT_MODAL:
        return BulkEditModal;

      case BOARD_SORT_MODAL:
        return BoardSortModalWrapper;

      case EDIT_STAGE_PROPERTIES_MODAL:
        return EditStagePropertiesModalWrapper;

      case NONE:
      default:
        return Empty;
    }
  }, [openModalType]);
  var openPanelType = useSelector(getPanelType);
  var Panel = useMemo(function () {
    switch (openPanelType) {
      case FILTER_PANEL:
        return FilterSidebar;

      case OBJECT_BUILDER_PANEL:
        return ObjectBuilderWrapper;

      case PREVIEW_PANEL:
        return PreviewSidebarWrapper;

      case EDIT_CARDS_PANEL:
        return EditCardsPanelWrapper;

      case NONE:
      default:
        return Empty;
    }
  }, [openPanelType]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(Modal, {}), /*#__PURE__*/_jsx(Panel, {})]
  });
};

export default OverlayContainer;